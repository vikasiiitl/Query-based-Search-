import streamlit as st
import os
from pymilvus import connections, Collection
from transformers import AutoTokenizer, AutoModel
import torch
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set page config FIRST
st.set_page_config(page_title="Knowledge Chatbot", page_icon="🧠", layout="wide")

# Milvus connection
milvus_uri = os.getenv("MILVUS_URI")
milvus_token = os.getenv("MILVUS_TOKEN")
connections.connect("default", uri=milvus_uri, token=milvus_token)

collection_name = "knowledge_base"
collection = Collection(collection_name)

# Create index if not present
if not collection.has_index():
    index_params = {
        "metric_type": "IP",
        "index_type": "IVF_FLAT",
        "params": {"nlist": 1024}
    }
    collection.create_index(field_name="embedding", index_params=index_params)

# Load collection
collection.load()

# Load embedding model
@st.cache_resource
def load_model():
    tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
    return tokenizer, model

tokenizer, model = load_model()

# Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Function to call Groq
def call_groq(prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

# Function to embed text
def embed_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1).numpy()
    return embeddings.flatten().tolist()

# Streamlit page config
st.title("🧠 Knowledge Base Chatbot")

# Stateless Chat Interface
user_query = st.chat_input("Ask your question...")

if user_query:
    with st.chat_message("user"):
        st.markdown(user_query)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                query_embedding = embed_text(user_query)

                all_retrieved_docs = set()
                search_params = {"metric_type": "IP", "params": {"nprobe": 10}}

                results = collection.search(
                    [query_embedding],
                    anns_field="embedding",
                    param=search_params,
                    limit=10,
                    output_fields=["content"]
                )

                for hits in results:
                    for hit in hits:
                        content = hit.get("content")
                        if content:
                            all_retrieved_docs.add(content)

                if not all_retrieved_docs:
                    assistant_response = "❗ Sorry, I couldn't find any relevant documents."
                else:
                    selected_docs = list(all_retrieved_docs)[:10]
                    context = "\n\n".join(selected_docs)

                    prompt = f"""
                        You are a knowledgeable assistant. Analyze the following context retrieved from a vector database in multiple rounds.
                        Your goal is to provide the most accurate, concise, and helpful answer to the user's question based solely on the context provided.
                        Do not make up any information that is not explicitly found in the context.

                        Context:
                        {context}

                        User Question:
                        {user_query}

                        Instructions:
                        1. Carefully review all retrieved pieces of information.
                        2. Identify the most relevant facts or data points.
                        3. If the documents conflict, summarize the disagreement and indicate which side seems more supported.
                        4. If the answer cannot be found, clearly state that the information is unavailable.
                        5. Give the answer in markdown format list and tables
                        6. for comparision question use markdown tables to display the data
                        7. Do not Include the words like based on the provided data and all
                        8. If you are given normal conversation hello hii etc just simply say hello how may i help you

                        Respond in a concise and clear manner:
                        """

                    assistant_response = call_groq(prompt.strip())

                st.markdown(assistant_response)

            except Exception as e:
                st.error(f"Error: {str(e)}")
