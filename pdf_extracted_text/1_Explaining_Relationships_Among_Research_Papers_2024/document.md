Explaining Relationships Among Research Papers
Xiangci Li
Jessica Ouyang
Department of Computer Science
University of Texas at Dallas
Richardson, TX 75080
lixiangci8@gmail.com,
Jessica.Ouyang@UTDallas.edu
Abstract
Due to the rapid pace of research publications,
keeping up to date with all the latest related
papers is very time-consuming, even with daily
feed tools. There is a need for automatically
generated, short, customized literature reviews
of sets of papers to help researchers decide
what to read. While several works in the last
decade have addressed the task of explaining a
single research paper, usually in the context of
another paper citing it, the relationship among
multiple papers has been ignored; prior works
have focused on generating a single citation
sentence in isolation, without addressing the
expository and transition sentences needed to
connect multiple papers in a coherent story. In
this work, we explore a feature-based, LLM-
prompting approach to generate richer citation
texts, as well as generating multiple citations
at once to capture the complex relationships
among research papers. We perform an ex-
pert evaluation to investigate the impact of our
proposed features on the quality of the gener-
ated paragraphs and find a strong correlation be-
tween human preference and integrative writing
style, suggesting that humans prefer high-level,
abstract citations, with transition sentences be-
tween them to provide an overall story.
1
Introduction
Due to the rapid pace of research publications,
including pre-prints that have not yet been peer-
reviewed, keeping up to date with the latest work
is very time-consuming.
Even with daily feed
tools like the Semantic Scholar Research Feed1,
researchers must still curate, read, and digest all
the new papers in their feed. Thus, there is a need
for concise, automatically generated literature re-
views summarizing the set of new papers in a feed,
customized for the researcher whose feed it is.
1https://www.semanticscholar.org/faq/
what-are-research-feeds
Unfortunately, there does not exist a dataset of
such literature reviews. Survey articles are sim-
ilar, but they are very long, not customized to a
specific reader, and relatively rare. In this work,
we use the related work sections of scientific arti-
cles as a proxy for the kind of short, customized,
daily feed summaries we wish to generate. Related
work sections have several advantages: they are
concise, usually no more than one page long; they
are customized to their parent article, just as a daily
feed summary should be customized to its owner;
and they are plentiful and can be automatically ex-
tracted as the “Related Work," “Literature Review,"
or “Introduction" sections of scientific articles. To
relate back to a daily feed summary, one can easily
imagine using the most similar paper authored by
the feed owner as the “citing" paper perspective
from which to customize the literature review.
The task of automatically generating citations for
scientific articles has been explored using both ex-
tractive (Hoang and Kan, 2010; Hu and Wan, 2014;
Chen and Zhuge, 2019; Wang et al., 2019; Deng
et al., 2021) and abstractive techniques (AbuRa’ed
et al., 2020; Xing et al., 2020; Ge et al., 2021; Luu
et al., 2021; Chen et al., 2021; Li et al., 2022).
However, we argue that the dominant approach of
generating a single citation sentence in isolation ig-
nores the relationships among cited papers, which
are just as important as that between the citing and
cited papers. Literature reviews, whether for a re-
lated work section or a daily feed summary, are
multi-document summaries and should contain the
non-citation, expository and transition sentences
needed to compose a coherent story (Li et al., 2022).
Recent neural approaches frame citation generation
as an end-to-end, sequence-to-sequence task; they
are thus constrained by the length limitations of
their models — research papers are long documents
— and are unable to make use of supporting features,
such as citation intents or topic information, which
would require training additional models.
arXiv:2402.13426v1  [cs.CL]  20 Feb 2024
The task of generating related work sections in scientific papers has been explored by several researchers. The primary 
focus has been on the automatic generation of citation texts in scholarly papers. Xing et al1 conducted a pilot study on this 
topic, demonstrating that citation texts could be automatically generated given the context of a citing paper and a cited 
paper. They proposed a multi-source pointer-generator network with a cross-attention mechanism for citation text 
generation, which showed promising results.
Building on this, Ge et al2 introduced BACO, a framework for citing sentence generation that leverages both background 
knowledge and content information. This approach considers structural information from a citation network as background 
knowledge and uses salience estimation to identify what to cite from the cited paper.
The relationship between scientific documents has also been studied. Luu et al3 addressed the task of explaining 
relationships between two scientific documents using natural language text. This task requires modeling the complex 
content of long technical documents, deducing a relationship between these documents, and expressing that relationship 
in text.
A meta-study conducted by Li and Ouyang 4 compared existing literature on related work generation from various 
perspectives such as problem formulation, dataset collection, methodological approach, performance evaluation, and 
future prospects. This study provided valuable insights into the progress of state-of-the-art studies and suggested 
directions for future research.
Hoang and Kan 5 proposed an approach towards automated related work summarization. They introduced a fully 
automated approach to generate related work sections by leveraging a seq2seq neural network. Their goal was to improve 
the abstractive generation of related work by introducing problem and method information.
In another study, Li et al6 presented CORWA, a dataset that labels different types of citation text fragments from different 
information sources. They trained a strong baseline model that automatically tags the CORWA labels on massive unlabeled 
related work section texts.
Chen et al7 proposed an optimization approach for the automatic generation of related work sections in scientific papers. 
They introduced problem and method information as an additional feature to enhance the generation of related work.
Radford et al.'s work on Language Models as Unsupervised Multitask Learners 8 demonstrated that language models begin 
to learn tasks without any explicit supervision when trained on large datasets like WebText. This finding is particularly 
relevant as it suggests that language models could potentially be used for tasks like related work section generation.
Chen et al.'s study 9 proposed an abstractive model for related work section generation that captures relations between 
scientific papers. They introduced a Relation-aware Related work Generator (RRG) which generates an abstractive related 
work section from multiple scientific papers in the same research area.
Wu et al.'s ToC-RWG 10 explored the combination of topic model and citation information for automatic related work 
generation. They proposed a relation-aware multi-document encoder that relates one document to another according to 
their content dependency in a relation graph.
Other notable works in this area include “Automatic generation of related work through summarizing citations” 11, “Get To 
The Point: Summarization with Pointer-Generator Networks” 12, “Longformer: The Long-Document Transformer” 13, 
“Automatic Related Work Section Generation: Experiments in Scientific Document Abstracting” 14, “BERT: Pre-training of 
Deep Bidirectional Transformers for Language Understanding” 15, “Towards Full Related Work Generation” 16, “Automatic 
Related Work Section Generation by Sentence Extraction and Reordering” 17, and “Attention Is All You Need” 18. These 
works have contributed significantly to the field of automatic related work section generation.
(a) Bing Chat output (“more precise” setting).
The task of automatic related work generation has been explored by several researchers. Hu and Wan (2014) 
proposed an optimization approach, ARWG, which uses a PLSA model to split the sentence set of given papers 
into different topic-biased parts and employs regression models to learn the importance of sentences. This 
approach was later built upon by Chen and Zhuge (2019), who introduced a method for generating related work 
sections by summarizing citations. However, these methods often resulted in outputs lacking coherence and 
stylistic variation. To address this, Wang et al. (2019) proposed a framework, ToC-RWG, that incorporates topic 
models and citation information for related work generation. Despite these advancements, the challenge of 
generating a coherent overall story remained. Deng et al. (2021) attempted to address this by developing SERGE, 
a BERT-based ensemble model for sentence extraction and reordering to generate descriptive related work 
sections. However, even this approach was unable to fully capture the complex relationships among cited papers. 
In this work, we build upon these previous studies and propose a feature-based, LLM-prompting approach to 
generate citation texts and their expository and transition sentences at the paragraph or section level. 
Recent advancements in abstractive text summarization have paved the way for the development of models 
capable of generating citation texts. See et al. (2017) introduced a hybrid pointer-generator network with 
coverage, which significantly improved the accuracy of text summarization and reduced repetition. This work has 
been widely recognized and cited by several subsequent studies, including those by Xing et al. (2020), Ge et al. 
(2021), and Luu et al. (2021), among others. Xing et al. (2020) built upon the foundation laid by See et al. (2017) 
and proposed a multi-source pointer-generator network with a cross-attention mechanism for automatic citation 
text generation. Their work was further extended by Ge et al. (2021), who introduced a framework for citing 
sentence generation that considers both background knowledge and content information. Meanwhile, Luu et al. 
(202) utilized citing sentences as a proxy for explaining relationships between scientific documents, 
demonstrating the potential of large language models in this domain. These studies collectively highlight the 
growing trend of using abstractive approaches and large language models for generating citation texts, setting 
the stage for our feature-based, LLM-prompting approach. 
The most closely related work to ours is by Chen et al. (2021), who proposed a Relation-aware Related work 
Generator (RRG) model for generating an abstractive related work section from multiple scientific papers. Their 
approach, like other abstractive methods, is end-to-end and utilizes a relation-aware multi-document encoder to 
relate one document to another based on their content dependency in a relation graph. The model iteratively 
refines the relation graph and document representation during the training process and incorporates the relation 
graph information in the decoding process to assist in generating the related work section. Their experiments on 
two large-scale related work generation datasets demonstrated that the RRG model outperforms several strong 
baselines in terms of ROUGE metrics and human evaluations. However, unlike their approach, our work proposes 
human-interpretable, natural language features to express the content and relationships of each paper, as well as 
the discourse role and writing style of each citation. It is worth noting that there is currently no standard 
benchmark evaluation approach that allows for a direct comparison of methods used in these different prior 
works, as they employ different datasets and slightly vary in their task definition.
(b) Our approach.
Figure 1: Comparison between GPT4-powered Bing Chat and our approach on reproducing Section 2 of this paper.
Bing Chat is given a prompt consisting of the title and abstract of this paper, as well as a list of reference paper
titles, which fits comfortably in its context window. Bing Chat’s output is generic, ill-organized, and non-factual;
statements in red are misattributed or incorrect.
The recent dramatic success of prompting-based
methods using LLMs, like Chat-GPT and GPT-
4 (OpenAI, 2023), makes it possible to pursue a
feature-based approach to generating richer cita-
tion texts, as well as generating multiple citations
at a time to better capture the complex relation-
ships among research papers. However, as Figure
1 shows, even a SOTA LLM, augmented with a
search engine to retrieve papers 2, cannot generate
a factually-correct, on-topic literature review from
scratch. Bing Chat with GPT-4 hallucinates cited
papers’ approaches, and the expository sentences
are generic and vague. We can see that the LLM
needs guidance in identifying the relevant contribu-
tions of each cited paper, as well as how the cited
papers relate to one another.
In this work, as a first step towards generating
customized daily feed summaries, we explore a
feature-based, LLM-prompting approach to gener-
ating citation texts and their transition sentences at
the paragraph level, using automatically extracted
related work sections as the evaluation targets. Our
main contributions are as follows:
• We propose features capturing the relation-
ships between cited and citing papers and
among papers cited together. We show that
these features can be extracted by prompting
LLMs and compose them into a new prompt
for generating several citations, along with
transition sentences, in one pass.
2https://www.bing.com/new
• We conduct experiments on a planning-based
setting, where a plan consisting of a few sen-
tences describing the high-level relationships
among cited papers is used to guide gener-
ation. In this preliminary study, we use a
human-provided plan to investigate the impact
of these guiding “main ideas" on the organiza-
tion of citations in the generated paragraphs.
• We perform an expert evaluation to investigate
the impact of our proposed features on the
quality of the generated paragraphs. We find a
strong correlation between human preference
and integrative writing style, suggesting that
readers prefer more high-level, abstract cita-
tions, with transition sentences between them
to provide a coherent overall story.
2
Background and Related Work
Hoang and Kan (2010) proposed the task of au-
tomatic related work generation: generating the
related work section of a target paper given a list of
papers to cite, assuming the rest part of the target
paper is available. Early extractive approaches au-
tomatically select and concatenate salient sentences
from the cited papers (Hu and Wan, 2014; Chen
and Zhuge, 2019; Wang et al., 2019; Deng et al.,
2021). As a result, their outputs lack coherence
among citations and have no overall story, and the
sentences lack stylistic variation; transitions and
sentences relating back to the target paper are im-
possible to produce using an extractive approach.
More recently, abstractive approaches have fo-
cused on generating a single citation at a time,
given the cited paper and assuming the rest of tar-
get paper, including the rest of the related work
section, is available (AbuRa’ed et al., 2020; Xing
et al., 2020; Ge et al., 2021; Luu et al., 2021; Li
et al., 2022). These works used a variety of architec-
tures (pointer-generator (See et al., 2017), vanilla
Transformer (Vaswani et al., 2017), GPT-2 (Rad-
ford et al., 2019) or Longformer-Encoder-Decoder
(LED; Beltagy et al., 2020)) to generate citations
from cited paper abstracts; the cited paper full texts
were not used due to their length.
The most similar work to ours is Chen et al.
(2021), who attempt to generate multiple citations
at once. However, their approach, like that of other
abstractive prior works, is end-to-end; they aug-
ment a document encoder with a graph network
to learn relationships among document representa-
tions. In contrast, we propose human-interpretable,
natural language features to express paper content
and relationships, as well as the discourse role and
writing style of each citation.
Finally, as Li and Ouyang (2022) note, there is
no standard benchmark to directly compare meth-
ods from these prior works, which use different
datasets and vary slightly on the task definition.
3
Approach
We use multi-stage prompting of LLMs to first col-
lect features from each cited paper and then com-
pose them into a prompt for generating a paragraph
of citations with supporting expository and transi-
tion sentences. It is well-known that, given a simple
prompt, such as “Generate a literature review about
XXX," LLMs produce poorly-organized and inac-
curate citations; from our Bing Chat example, we
can see that the LLM inaccurately describes the
approaches and contributions of the cited papers.
We must provide the LLM with more detailed and
specific information about the cited papers.
We identify two sets of key support features.
First, we extract features for the target paper and
each cited paper from a local citation network, cap-
turing information about the relationship between
the target and each cited paper, as well as between
pairs of cited papers (Section 3.1). Second, we ex-
tract features from the text of the target paper itself,
which provide contextual information to ensure the
generated citations stay on topic (Section 3.2); in
our experiments, the target paper stands in for the
daily feed owner so that the literature review is
customized for their perspective.
After extracting these features, we compose a
prompt to generate paragraphs3 of citations (Sec-
tion 3.3). Finally, we use the generated draft to
extract candidate cited text spans for each cited
paper, add them to the prompt, and re-generate im-
proved paragraphs (Section 3.4). Our prompts are
shown in Appendix Tables 6–10; Appendices B &
C show examples of features and paragraphs.
3.1
Citation Network Features
We identify key features under the framework of
a local citation network centered on the target pa-
per. Each node represents a paper, and an edge
represents the relationship between two papers. Un-
like Chen et al. (2021), we use natural language
descriptions as network features, allowing us to
leverage the seq2seq nature of LLMs, rather us-
ing numerical feature vectors with a graph neural
network; the natural language descriptions also im-
prove the interpretability of the citation network.
Faceted summary.
Each node in the citation net-
work represents a paper, and its core feature is
the faceted summary (Meng et al., 2021), which
highlights the key aspects of the paper for rapid
understanding: the paper’s objective, method, find-
ings, contributions and keywords. Just as a human
may quickly skim the title, abstract, introduction,
or conclusion (TAIC) sections to get the gist of a
paper, we focus on the most important facets of
a paper when generating its citation. The faceted
summary also provides the practical benefit of re-
ducing the number of tokens needed to represent
a paper; the limited input window size of LLMs
encourages a compact representation for each node.
We prompt the LLM to generate a faceted summary
given the TAIC of each paper.
Relationship between paper pairs.
Each edge
in the citation network represents the relationship
between the two paper nodes it connects. Given
a pair of papers A and B, we leverage the LLM’s
strong summarization ability to synthesize informa-
tion from all citation spans4 where paper A cites
paper B, conditioned on the faceted summaries of
A and B, into a single natural language descrip-
3The number of paragraphs we generate in one shot de-
pends on the total number of cited papers; if there are too
many, the input prompt becomes too long to generate more
than one paragraph at a time.
4We use Li et al. (2022)’s citation tagger to extract spans.
tion of their (directed) relationship. The incoming
edges on paper B’s node thus capture how B has
been discussed by other works, providing a his-
tory of how its ideas have influenced its field; the
outgoing edges from likewise capture how B has
developed ideas from other works in its field.
Enriched citation intent & usage.
Citation in-
tents encode why and how an author cites a paper:
to give background information, to use a proposed
methodology, or to compare experimental results.
Existing work on citation intent focuses on propos-
ing new label sets or modeling approaches to pre-
dict those labels, without applying them to down-
stream applications (Garfield et al., 1965; Teufel
et al., 2006; Dong and Schäfer, 2011; Jurgens et al.,
2018; Cohan et al., 2019; Tuarob et al., 2019; Zhao
et al., 2019), and they framed intent prediction as a
classification task to reduce its complexity. How-
ever, as Lauscher et al. (2022) point out, simple
classification label sets struggle to represent am-
biguous, real-world citations. To the best of our
knowledge, we are the first to apply citation intent
to citation generation and to extend intent labels to
rich natural language descriptions.
In addition, Li et al. (2022) distinguish between
dominant- and reference-type citations. For ex-
ample, consider the sentence “Luu et al. (2021)
fine-tuned GPT-2 (Radford et al., 2019) to pre-
dict citation sentences." The emphasis is on the
dominant-type citation of Luu et al., whereas the
reference-type citation of Radford et al. is not ex-
plained in detail, since GPT-2 is being cited as a
tool. Ignoring this distinction results in unnatural-
sounding paragraphs that treat all cited papers as
equally-important, dominant-type citations.
Thus, for each cited paper B, we prompt the
LLM to summarize how other papers Ai in the
network cite B (intent) as well as if the majority
usage of B is as an important, dominant cited paper
or if it is simply cited for reference. The prompt
includes the faceted summaries (node features) of
the other citing papers Ai, all relationships (edge
features) between Ai and B, and the text of the
citation spans for B in Ai. This enriched citation
intent/usage feature roughly corresponds to a dis-
cursive summary of all edges incident to node B.
3.2
Target Paper Features
To generate paragraphs with a coherent overall
story, we collect features from the target paper,
capturing the context and perspective of the reader.
Title, abstract, introduction, and conclusion
(TAIC).
Despite the powerful zero-shot genera-
tion ability of LLMs, they are typically not trained
specifically for scientific document generation and
lack the necessary domain knowledge to write like
a domain expert. We leverage the LLM’s strong
in-context learning ability by including the full text
of the TAIC sections of the target paper. The TAIC
provides context to the LLM, so that the story and
tone of the TAIC can inform the focus and organi-
zation of the citations to be generated; in our ex-
periments, the target paper represents the reader’s
interests, so a good literature review should be co-
herent with the target paper.
Guiding plan of main ideas.
Intuitively, there
can be multiple plausible literature reviews for the
same set of cited papers. A reader may prefer one
over another, even though they are all factually
correct, depending on the perspective given by the
target paper. To better capture this information, we
experiment with a human-provided plan to guide
generation; we leave the automatic generation of
a guiding plan to future work. The plan is a short
summary of the main ideas to be discussed; to
simulate this feature during evaluation, we prompt
an LLM to condense the gold related work section
of the target paper into a short summary of its main
ideas, ignoring citations to avoid information leak.
3.3
Related Work Paragraph Generation
With the features above, we prompt the LLM to
generate one paragraph, subsection, or when length
allows, the entire literature review in one pass (Fig-
ure 2). We find section-level generation to be the
most robust, as the LLM often does not follow
prompt instructions as closely when generating
paragraph-by-paragraph, but we are constrained
by the length limit of the LLM. During evaluation,
for target related work sections with many cited pa-
pers, such that the full prompt exceeds the LLM’s
limit, we manually chunk the gold related work
section based on subsections or titled paragraphs,
partition the cited papers according to those chunks,
and generate each chunk individually, concatenat-
ing the generated subsections or paragraphs in the
same order as in the gold related work section.
3.4
Enhancing Details with CTS
We observe that the generated citations may lack
detail compared to human-written ones.
This
makes sense because the generation prompt con-
Prompt
The title, abstract, introduction and conclusion
section of the target paper are as follows:
Title: {{title}}
Abstract: {{abstract}}
Introduction: {{introduction}}
Conclusion: {{conclusion}}
... Write a literature review that concisely cites
the following papers in a natural way using all of
the main ideas as the main story. ... You can freely
reorder the cited papers to adapt to the main ideas.
...
Main idea of our literature review:
{{main ideas}}
List of cited papers:
1. {{titleB1}} by {{authorB1}} et al. {{yearB1}}
{{Faceted Summary or Abstract of B1}}
<Usage> {{Enriched citation usage of B1}}
How other papers cite it:
{{Relation between Ax and B1}}
{{Relation between Ay and B1}}
...
Potentially useful sentences from the target paper:
{{section #1}} {{CTS #1}}
{{section #2}} {{CTS #2}}
...
2.
{{titleB2}}
by
{{authorB2}}
et
al.
{{yearB2}}
......
Figure 2: Prompt format for generating a literature re-
view paragraph (simplified for length).
tains only summaries of, but no actual text from,
each cited paper. To supply more detail, we fol-
low Yasunaga et al. (2019); Wang et al. (2019) in
using ROUGE-based ranking (Cao et al., 2015) to
retrieve cited text spans (CTS; Jaidka et al., 2018,
2019; AbuRa’ed et al., 2020): the cited paper text
span most relevant to the corresponding citation.
We retrieve CTS using a newly generated candi-
date citation span as query, which we extract using
Li et al. (2022)’s citation tagger; we compute the
average of ROUGE-1 and -2 recall scores against
each sentence in the corresponding cited paper. We
take the top-k5 sentences as CTS to augment the
prompt and then re-generate the paragraph.
4
Experimental Settings
For each target related work section, we start with
the PDF of the target paper and aim to generate a
plausible candidate to replace the gold related work
section using our feature-based approach.
As we discuss in Sections 1–2, to the best of
our knowledge, there is no prior baseline that can
generate the long texts of this task; even a SOTA
LLM, Bing Chat with GPT-4, fails to be a compet-
itive baseline. Therefore, we focus on comparing
5We adjust k case-by-case so the prompt length does not
exceed the LLM’s input window, with a hard cap at k = 10.
different input feature variations (Section 4.3).
4.1
Implementation Details
We use Google search API 6 to find and download
cited papers and doc2json (Lo et al., 2020) to parse
PDFs into JSON format. We use Chat-GPT (gpt-
3.5-turbo-0301) for all feature extraction steps and
GPT-4 (gpt-4-0314; maximum input length limit
of 8k tokens) for the generation step.
We do not perform any training or fine-tuning,
and we do not use any datasets; we only use the
pre-trained citation tagger of Li et al. (2022) for
citation span extraction. We design our prompts
using the first author’s previous publications as a
development set and use our human judges’ nomi-
nated papers as our test set.
4.2
Human Evaluation Settings
Because it is challenging for non-domain experts
to evaluate the quality and factuality of scientific
texts, we conduct a human evaluation by inviting
domain experts to evaluate candidate literature re-
views generated for one of their own published
papers, or a paper closely related to their own work.
Our experts are all fluent in English and are a mix
of Ph.D. students and post-doctorate researchers
in both academia and industry. We instruct them
to nominate a target paper such that they are very
familiar with all of the cited papers.
Because the experts were recruited from among
our colleagues, about half of the papers evaluated
are natural language processing papers, with the
other half from other computational fields, includ-
ing machine learning, speech processing, computer
vision, robotics, computer graphics, and program-
ming languages. Almost all papers were published
after September 2021 and so were not included in
the training data of the LLMs (Appendix Table 12).
The evaluators are asked to score each generated
related work section in terms of (1) fluency, (2) or-
ganization & coherence, (3) relevance to the target
paper, (4) relevance to the cited papers, (5) factu-
ality and the number of non-factual or inaccurate
statements, (6) usefulness & informativeness, (7)
writing style, and (8) overall quality.
4.3
Input Feature Variations
Table 1 shows the input features used by each of our
generated variants. A is our baseline, with access
to all features, including the human-provided main
6https://pypi.org/project/
googlesearch-python/
Feature
A B C D E F G H
main idea
✓-
✓✓✓✓✓✓
target TAIC
✓✓-
✓✓✓✓✓
faceted summary ✓✓✓-
✓✓✓✓
cited abstract
-
-
-
✓-
-
-
-
intent/usage
✓✓✓✓-
✓-
✓
relationship
✓✓✓✓✓-
-
✓
CTS
-
-
-
-
-
-
-
✓
Table 1: Features in each generation variant.
Variant ROUGE-1 ROUGE-2 ROUGE-L
A
0.513
0.216
0.248
B
0.446
0.131
0.177
C
0.501
0.201
0.235
D
0.511
0.215
0.249
E
0.514
0.223
0.255
F
0.520
0.221
0.252
G
0.517
0.225
0.256
H
0.513
0.215
0.249
Table 2: ROUGE scores of generated variants evaluated
against the gold related work sections. Bold indicates
improvement over baseline A, while italics indicate
lowered performance.
idea plan. B is the only variant that does not use the
main ideas, making it the only variant that could
be generated completely automatically. Variant C
ablates the TAIC of the target paper, while D re-
places each cited paper’s faceted summary with its
abstract. Variants E, F, and G ablate the enriched
citation intent and usage, the relationship between
paper pairs, and both, respectively. Finally, variant
H adds the CTS-based re-generation step.
5
Results and Analyses
Automatic Evaluation.
Table 2 shows the
ROUGE scores of our generated variants compared
to the gold related work sections. Overall, most
variants yield decent scores, indicating that they
are mostly on-topic. Notably, variant B has signif-
icantly lower ROUGE scores than other variants,
which makes sense because it is the only one with-
out the main idea plan. This emphasizes the impor-
tant and irreplaceable nature of the guiding plan.
Variant C, which has the main ideas but no target
paper TAIC is the next lowest, again suggesting
that features related to the reader’s perspective are
the most important for a good literature review.
Human Evaluation.
Due to the challenging and
expensive nature of evaluating highly specialized
academic research papers, we are only able to eval-
uate one target related work section per domain
expert judge, with 27 judges in total. Table 3 shows
the average human evaluation scores across all 27
judges. Writing is a highly personal and idiosyn-
Metrics
A
B
C
D
E
F
G
H
Fluency
4.11 3.78 4.00 4.33 4.07 4.11 4.15 4.19
Coherence 3.30 3.07 3.33 3.70 3.59 3.59 3.52 3.37
Rel target
3.78 3.67 3.89 4.19 4.11 4.00 4.07 4.00
Rel cited
4.22 3.93 4.15 4.22 4.19 4.19 4.00 4.04
Factuality
4.04 3.89 3.74 3.89 3.93 4.30 3.93 3.74
Usefulness 3.74 3.30 3.59 3.52 3.85 3.70 3.59 3.78
Writing
3.48 3.07 3.30 3.78 3.70 3.52 3.44 3.81
Overall
3.33 2.89 3.15 3.48 3.67 3.56 3.22 3.15
# error
0.70 0.78 0.78 0.70 0.81 0.44 0.74 0.89
Table 3: Average human evaluation scores.
Diff
Vrt ♡Vrt% Tie% ♡Bsl%
−main story
B
22.2
29.6
48.1
−target TAIC
C
22.2
37.0
40.7
−faceted summary
D
29.6
48.1
22.2
+ cited abstract
−intent/usage
E
40.7
37.0
22.2
−relationship
F
40.7
29.6
29.6
−intent/usage
G
22.2
33.3
44.4
−relationship
+ CTS
H
25.9
37.0
37.0
Table 4: Comparison of human overall scores across
variants, with respect to the baseline A.
cratic process, and the high variance in the human
evaluation scores reflects this fact; different vari-
ants are preferred by different judges.
5.1
Importance of Input Features
We integrate the results of Tables 2, 3 & 4 to ana-
lyze the usefulness of each input feature.
Main idea plan.
All tables show that baseline A
outperforms variant B, which ablates the main idea
feature. The fact that main idea information is not
found in any other feature (Appendix A) confirms
the importance of a human-provided main idea to
guide the LLM in generating a satisfactory story.
Target paper TAIC.
The baseline A also out-
performs variant C, which ablates the target paper
title, abstract, introduction, and conclusion, con-
firming our hypothesis that this feature provides
crucial context for the generated paragraphs.
Enriched citation usage & relationship between
papers.
Comparing A to variants E, F, and G,
we find a weak trend that access to either enriched
citation usage or relationship between papers is
helpful, with the latter slightly preferred; this find-
ing is consistent with the observed coverage and
density discussed in Appendix A. Variants with
access to both or neither feature underperform, sug-
gesting that, while the usage and relationship fea-
tures are important, they are also mutually redun-
dant (the usage feature of a cited paper summarizes
all its relationships) and the presence of both causes
Label%
Gld
A
B
C
D
E
F
G
H
Transition 31.1 17.0 10.9 18.5 19.7 17.0 19.3 19.6 20.1
Single-Sum 28.2 47.2 59.8 51.7 40.7 45.7 46.2 45.4 40.7
Narrative
20.8 11.3 3.5
8.4 13.5 14.5 10.0 14.1 14.1
Reflection 15.4 17.0 21.6 15.4 19.3 17.4 16.9 16.9 17.8
Multi-Sum 3.6
7.5
3.3
6.0
6.8
5.5
7.4
4.0
6.6
Dominant 34.7 70.0 81.4 77.1 64.7 63.6 70.3 60.1 63.2
Reference 65.3 30.0 18.6 22.9 35.3 36.4 29.7 39.9 36.8
Table 5: Li et al. (2022) writing style analysis. Percent-
age of the discourse role of sentences (top) or citation
types (bottom) within each variant. Bold indicates styles
used more frequently in generated variants than gold re-
lated work sections; italics indicate less frequent styles.
the LLM to over-emphasize this information.
Faceted summaries & cited paper abstracts.
We are surprised to observe that variant D, which
uses cited paper abstracts instead of faceted sum-
maries, outperforms A in terms of fluency, coher-
ence, writing, and overall. We note that D still
has indirect access to the faceted summaries since
the relationship-between-papers feature is derived
from faceted summaries. We hypothesize that D
is preferred over A because abstracts are human-
written and contain more narrative-style sentences
than the LLM-generated faceted summaries (see
Section 5.2). However, the baseline A still outper-
forms D in terms of informativeness and factuality.
CTS.
Comparing the baseline A with variant H,
we observe that re-generating the related work sec-
tion using cited text spans is a controversial choice
that leads to very high variance in human evaluation
scores. 44% of the judges report improved writing
style, and 26% report improved informativeness,
while 30% report decreased factuality. Therefore,
CTS should be used cautiously.
5.2
Analysis of Writing Style
Khoo et al. (2011) studied the writing style of liter-
ature reviews by categorizing them as integrative
or descriptive, depending on whether they focus
on high-level ideas or on detailed information from
specific studies. Li et al. (2022) extended this dis-
tinction to individual citations, distinguishing dom-
inant citations, which focus on and describe cited
papers in detail, and reference citations, which are
short, highly abstracted, and often tangential to
the rest of the sentence. Li et al. also introduced
sentence-level discourse roles: transition and nar-
rative sentences provide exposition and high-level
observations; single and multi-summarization sen-
tences give specific, detailed information about one
or more cited papers; and reflection sentences relate
cited papers to the target paper.
To study the writing style of our generated para-
graphs, we use Li et al.’s citation tagger to label
the usage types and discourse roles of the gold
related work sentences and our variants. As Ta-
ble 5 shows, there is a huge gap between the two
writing styles: gold sentences mainly consist of
transition and narrative sentences with reference-
type citations, while all generated variants have
far more explicit single-summary sentences with
dominant-type citations. In other words, the gener-
ated paragraphs are mostly descriptive, consisting
of individual paper summaries, rather than a coher-
ent story integrating all the cited papers.
5.3
Correlation Among Human Preference,
ROUGE, and Writing Style
As Tables 2, 3 & 5 show, there is a strong corre-
lation between human preference (overall score)
and ROUGE-L scores, as well as between ROUGE
scores and writing style (proportion of reference-
type citations), with Kendall’s τ of 0.592 and 0.691,
respectively. This suggests that we can use auto-
matic metrics such as ROUGE and the proportion
of reference-type citations to estimate human judg-
ments, which is extremely challenging to collect
on a large scale. Moreover, this observation em-
phasizes the importance of having a coherent and
organized story consisting of narrative-style sen-
tences with reference-type citations and transition
sentences bridging between them.
5.4
Qualitative Error Analysis
Despite the overall success of our approach — over
half the judges wrote that the generated variants
would be good first drafts for the gold related work
sections — our collected comments from the judges
show that composing a literature review is still a
very challenging task. We summarize the typical
issues mentioned by the judges below:
Factual errors.
While all generated variants have
a small absolute number of factual errors (see Ta-
ble 3), incorrect statements are the most frequently
mentioned problem. For example, one judge com-
plained, “. .. two descriptions are false (Hearst pat-
terns not extracted from Wikipedia, and there were
no edits in Bowman et al.).” We observe that the
overall human evaluation score correlates with the
factuality score (Kendall’s τ=0.50).
Emphasizing the right cited papers.
A good
literature review should have a logical story; simply
concatenating individual cited paper summaries is
not sufficient. Our judges complained about less
important papers receiving too much attention:
• “...too much detail for the papers and has a
paragraph on human-in-the-loop data gener-
ation which is not very relevant to the paper
(should be mentioned briefly).”
• “The descriptions of the cited papers, while
accurate, seem less relevant to the citing paper
and to the story as a whole, and the papers that
get a lengthier description are not the most
central ones.”
• “The focus on traditional decompilation meth-
ods is too strong for the paper content.”
Further, due to the nature of using related work
sections as our evaluation targets, the publica-
tion dates of the cited papers can vary greatly.
While this would not be a problem in a daily feed
literature review (since all of the papers would
be new), our judges were more likely to com-
plain if the generated literature review focused
to much on earlier works: “...why does it focus
on approaches from 20 years ago than recent ap-
proaches?" These comments confirm our finding
that dominant, summarization-type citation sen-
tences may not be appropriate for all cited papers.
Paragraph organization.
How to group similar
works together is a major challenge. While our
approach is usually able to generate well-organized
texts when the variant includes sufficient features,
failure cases significantly impact the human eval-
uation. For example, one judge wrote, “Second
paragraph starts with ‘In the pursuit of automating
reinforcement learning’, but then immediately cite
Henderson et al. (2018) which talks about repro-
ducibility and not automating RL issues.”
Judges also commented that they would prefer
more comparisons among cited papers: “...some
citations did not highlight their difference from
other work, such as Schick et al. (2021) generates
pairs of data.”
Other observed issues include insufficient evi-
dence for claims and inconsistent citation format-
ting. In addition, the LLM does not always follow
the prompts, occasionally resulting in some cited
papers being silently dropped from the output.
Overall, we find that organization and flow be-
tween citations is very important to the judges and
is mentioned in most positive comments:
• “Good connection between the explained
works. It is not just a list of contributions.”
• “The organization is close to perfect, and the
story flows well in this one. One citation is
missing, and, surprisingly, one citation was
added (Kondadadi, 2013) - in exactly the right
place and with an accurate description! weird
but pretty cool!”
6
Conclusion
We have presented a feature-based approach for
prompting LLMs to explain the relationships
among cited papers. With the ultimate goal of
generating a literature review summarizing the con-
tents of a researcher’s daily paper feed, we have
conducted a pilot study using the related work sec-
tions of scientific articles as a proxy for the kind of
literature reviews we wish to generate: short, cus-
tomized for a particular target paper (standing in
for daily feed’s owner), and focused on explaining
how the cited papers relate to each other and why
they are important. Our approach focuses on us-
ing the strong natural language understanding and
summarization abilities of LLMs to extract inter-
pretable, natural language features describing the
content of the cited and target papers, as well as
their relationships with each other and with other
papers that have cited them in the past. We also
propose a “main ideas" plan to guide the LLM to
generate a coherent story, using a human-supplied
plan in these preliminary experiments.
Our detailed expert evaluation reveals that hu-
man judges dislike literature reviews that sim-
ply concatenate cited paper summaries together,
demonstrating the importance of generating at the
paragraph or section level, including transition sen-
tences, rather than focusing on individual citations.
Human judges are also sensitive to the relevance of
each cited paper and strongly dislike generations
that wrongly emphasize less impactful papers. We
conclude that accurate descriptions of a cited pa-
per’s methodology are not the only important facet
of scientific document processing — understand-
ing the rich and sophisticated relationships among
papers is the key.
Limitations
Citation retrieval.
In their written comments,
several judges expressed the wish that our system
would help them find other related papers to read.
This is a limitation not only of our work, but of
all prior work in automatic literature review gener-
ation, going back to Hoang and Kan (2010). We
suggest that future work can explore integrating
citation list optimization with literature review gen-
eration, perhaps by generating iteratively candidate
drafts and retrieving additional papers to cite.
Length limit of GPT-4.
Our experiments used
gpt-4-0314, which has a maximum input token
length of 8k; we did not have access to gpt-4-32k,
which has four times the length limit. For nearly
half of the related work sections, we had to iter-
atively generate subsections and concatenate the
outputs, as described in Section 4.1. Consequently,
the coherence between subsections is significantly
impacted, and they read like a concatenation of
different related work sections. This problem will
be mitigated as more LLMs have longer maximum
input lengths.
Imperfect preprocessing pipeline.
We were un-
able to access the PDFs of some cited works due to
several problems: (1) the PDF parser is only able
to parse research papers, but not books or websites;
(2) the citation lists are automatically extracted
from the parsed PDFs, and some papers may be
missing; (3) we were unable to retrieve some cited
papers using the Google seach API; and (4) we
were unable to download some cited papers due to
publisher pay-walls. The missing cited papers limit
the performance of our system.
Inconsistent citation markers.
Since we use
heuristics to extract citation markers from a JSON
parsed from the target paper PDF, some of the au-
thor last names and publication years may not be
accurate. In addition, we observe a few cases of
inconsistency in citation styles (e.g. mixing “Smith
et al. (2023)” and “[1]”) across multiple passes of
generation. In future work, we will leverage the
LLM’s code comprehension and generation ability
to directly input the bibliography and output related
work texts in LATEXformat.
Quality of the intermediate outputs.
Since
there are no gold features introduced in Section 3.1
& 3.2, nor do we have the resource of additional
human evaluation for these intermediate output fea-
tures from the LLM, we have to leave the study of
intermediate feature quality and its influence to the
final output for future work.
Post-processing layer.
In this preliminary study,
we only limit our scope to the initial generation
process without additional post-processing steps.
We leave additional fact-checking and correction,
and potential plagiarism avoidance for future work.
Proprietary LLM APIs.
Our prompts are de-
signed based on OpenAI gpt-3.5-turbo-0301 and
gpt-4-0314. As these models may be deprecated,
the results may not be replicated in the future.
Moreover, the prompts may have to be updated
to adapt to newly released models. Nonetheless,
we argue that the key input features and general
prompt format we propose should be consistently
useful across any LLM. We later test our prompts
on other LLMs: gpt-3.5-turbo-0613 & gpt-4-0613,
as well as Anthropic Claude-v2 7 output qualita-
tively similar texts, while Google text-bison-32k
8 output texts with less satisfactory styles. On the
other hand, LLaMA-2 70B Chat (Touvron et al.,
2023) fails the task by generating related work sec-
tions irrelevant to the input.
Limited field of studies and generalizability.
As Appendix Table 11 shows, our evaluated papers
are concentrated on the field of computer science,
particularly natural language processing, and our
prompts are also designed for computer science
papers. We note that it is very challenging and ex-
pensive to use authors/experts to evaluate literature
reviews and we do not have the resources to tune
the LLM prompts and recruit experts in other dis-
ciplines. We do evaluate a geology paper because
the expert is friends with an author, and we do not
see any significant difference from the computer
science evaluations. We leave other domains of
target papers, and more dynamic prompt template
for future work.
Ethics Statement
As an early exploratory work, we use LLMs to
automatically generate literature reviews. LLMs
may produce inappropriate outputs, such as toxic or
non-factual statements. LLMs may also plagiarize
the cited papers; however, in our intended use case,
generating a literature review summarizing a daily
paper feed, this is less of a concern, since the review
is shown only to feed owner for the purpose of
assisting them in curating their reading list.
7https://www.anthropic.com/index/claude-2
8https://cloud.google.com/vertex-ai/docs/
generative-ai/model-reference/text
Because our experiments are conducted using
related work sections as evaluation targets, it is
possible that unscrupulous individuals may use our
system to “cheat” at writing related work sections
for their own publications. We strongly advise
against doing so, as this violates the requirement of
a fully original piece of work for academic venues.
Since there is not yet an established norm around
the use of generative systems in writing scientific
papers, there may be some risk of harm to the sci-
entific community from careless use of such tools,
and their use might be explicitly prohibited in some
contexts. Therefore, future researchers, developers,
and users must be extra careful about the potential
regulations.
From a practical standpoint, the quality of litera-
ture reviews generated using our approach is still
noticeably lower than human-written ones, espe-
cially in terms of organization and writing style.
In addition, the human-provided main idea plan is
required for higher-quality output, and the fully-
automated setting performs very poorly, which
should discourage the malicious use of our system.
Our results clearly show that the human thinking
process cannot be replaced by an automated system,
and human readers are easily able to distinguish
and criticize AI-generated content.
References
Ahmed AbuRa’ed, Horacio Saggion, and Luis Chiruzzo.
2020. A multi-level annotated corpus of scientific
papers for scientific document summarization and
cross-document relation discovery. In Proceedings
of the Twelfth Language Resources and Evaluation
Conference, pages 6672–6679, Marseille, France. Eu-
ropean Language Resources Association.
Ahmed AbuRa’ed, Horacio Saggion, Alexander Shvets,
and Àlex Bravo. 2020. Automatic related work sec-
tion generation: experiments in scientific document
abstracting. Scientometrics, 125:3159–3185.
Iz Beltagy, Matthew E Peters, and Arman Cohan. 2020.
Longformer: The long-document transformer. arXiv
preprint arXiv:2004.05150.
Ziqiang Cao, Furu Wei, Li Dong, Sujian Li, and Ming
Zhou. 2015. Ranking with recursive neural networks
and its application to multi-document summarization.
In Proceedings of the AAAI conference on artificial
intelligence, volume 29.
Jingqiang Chen and Hai Zhuge. 2019. Automatic gener-
ation of related work through summarizing citations.
Concurrency and Computation: Practice and Experi-
ence, 31(3):e4261.
Xiuying Chen, Hind Alamro, Mingzhe Li, Shen Gao, Xi-
angliang Zhang, Dongyan Zhao, and Rui Yan. 2021.
Capturing relations between scientific papers: An
abstractive model for related work section generation.
In Proceedings of the 59th Annual Meeting of the
Association for Computational Linguistics and the
11th International Joint Conference on Natural Lan-
guage Processing (Volume 1: Long Papers), pages
6068–6077, Online. Association for Computational
Linguistics.
Arman Cohan, Waleed Ammar, Madeleine van Zuylen,
and Field Cady. 2019. Structural scaffolds for ci-
tation intent classification in scientific publications.
In Proceedings of the 2019 Conference of the North
American Chapter of the Association for Computa-
tional Linguistics: Human Language Technologies,
Volume 1 (Long and Short Papers), pages 3586–3596,
Minneapolis, Minnesota. Association for Computa-
tional Linguistics.
Zekun Deng, Zixin Zeng, Weiye Gu, Jiawen Ji, and
Bolin Hua. 2021. Automatic related work section
generation by sentence extraction and reordering. In
AII@ iConference, pages 101–110.
Cailing Dong and Ulrich Schäfer. 2011. Ensemble-style
self-training on citation classification. In Proceed-
ings of 5th International Joint Conference on Natural
Language Processing, pages 623–631, Chiang Mai,
Thailand. Asian Federation of Natural Language Pro-
cessing.
Eugene Garfield et al. 1965. Can citation indexing be
automated. In Statistical association methods for
mechanized documentation, symposium proceedings,
volume 269, pages 189–192. Washington.
Yubin Ge, Ly Dinh, Xiaofeng Liu, Jinsong Su, Ziyao
Lu, Ante Wang, and Jana Diesner. 2021. BACO:
A background knowledge- and content-based frame-
work for citing sentence generation. In Proceedings
of the 59th Annual Meeting of the Association for
Computational Linguistics and the 11th International
Joint Conference on Natural Language Processing
(Volume 1: Long Papers), pages 1466–1478, Online.
Association for Computational Linguistics.
Max Grusky, Mor Naaman, and Yoav Artzi. 2018.
Newsroom: A dataset of 1.3 million summaries with
diverse extractive strategies. In Proceedings of the
2018 Conference of the North American Chapter of
the Association for Computational Linguistics: Hu-
man Language Technologies, Volume 1 (Long Pa-
pers), pages 708–719, New Orleans, Louisiana. As-
sociation for Computational Linguistics.
Cong Duy Vu Hoang and Min-Yen Kan. 2010. Towards
automated related work summarization. In Coling
2010: Posters, pages 427–435, Beijing, China. Col-
ing 2010 Organizing Committee.
Yue Hu and Xiaojun Wan. 2014.
Automatic gener-
ation of related work sections in scientific papers:
An optimization approach. In Proceedings of the
2014 Conference on Empirical Methods in Natural
Language Processing (EMNLP), pages 1624–1633,
Doha, Qatar. Association for Computational Linguis-
tics.
Kokil Jaidka, Muthu Kumar Chandrasekaran, Sajal
Rustagi, and Min-Yen Kan. 2018.
Insights from
cl-scisumm 2016: the faceted scientific document
summarization shared task. International Journal on
Digital Libraries, 19(2):163–171.
Kokil Jaidka, Michihiro Yasunaga, Muthu Kumar Chan-
drasekaran, Dragomir Radev, and Min-Yen Kan.
2019. The cl-scisumm shared task 2018: Results
and key insights. arXiv preprint arXiv:1909.00764.
David Jurgens, Srijan Kumar, Raine Hoover, Dan Mc-
Farland, and Dan Jurafsky. 2018. Measuring the
evolution of a scientific field through citation frames.
Transactions of the Association for Computational
Linguistics, 6:391–406.
Christopher SG Khoo, Jin-Cheon Na, and Kokil Jaidka.
2011. Analysis of the macro-level discourse structure
of literature reviews. Online Information Review.
Anne Lauscher, Brandon Ko, Bailey Kuehl, Sophie
Johnson, Arman Cohan, David Jurgens, and Kyle
Lo. 2022. MultiCite: Modeling realistic citations
requires moving beyond the single-sentence single-
label setting. In Proceedings of the 2022 Conference
of the North American Chapter of the Association for
Computational Linguistics: Human Language Tech-
nologies, pages 1875–1889, Seattle, United States.
Association for Computational Linguistics.
Xiangci Li, Biswadip Mandal, and Jessica Ouyang.
2022. CORWA: A citation-oriented related work
annotation dataset. In Proceedings of the 2022 Con-
ference of the North American Chapter of the As-
sociation for Computational Linguistics: Human
Language Technologies, pages 5426–5440, Seattle,
United States. Association for Computational Lin-
guistics.
Xiangci Li and Jessica Ouyang. 2022. Automatic re-
lated work generation: A meta study. arXiv preprint
arXiv:2201.01880.
Kyle Lo, Lucy Lu Wang, Mark Neumann, Rodney Kin-
ney, and Daniel Weld. 2020. S2ORC: The semantic
scholar open research corpus. In Proceedings of the
58th Annual Meeting of the Association for Compu-
tational Linguistics, pages 4969–4983, Online. Asso-
ciation for Computational Linguistics.
Kelvin Luu, Xinyi Wu, Rik Koncel-Kedziorski, Kyle
Lo, Isabel Cachola, and Noah A. Smith. 2021. Ex-
plaining relationships between scientific documents.
In Proceedings of the 59th Annual Meeting of the
Association for Computational Linguistics and the
11th International Joint Conference on Natural Lan-
guage Processing (Volume 1: Long Papers), pages
2130–2144, Online. Association for Computational
Linguistics.
Rui Meng, Khushboo Thaker, Lei Zhang, Yue Dong,
Xingdi Yuan, Tong Wang, and Daqing He. 2021.
Bringing structure into summaries: a faceted sum-
marization dataset for long scientific documents. In
Proceedings of the 59th Annual Meeting of the Asso-
ciation for Computational Linguistics and the 11th
International Joint Conference on Natural Language
Processing (Volume 2: Short Papers), pages 1080–
1089, Online. Association for Computational Linguis-
tics.
OpenAI. 2023. Gpt-4 technical report.
Alec Radford, Jeffrey Wu, Rewon Child, David Luan,
Dario Amodei, Ilya Sutskever, et al. 2019. Language
models are unsupervised multitask learners. OpenAI
blog, 1(8):9.
Abigail See, Peter J. Liu, and Christopher D. Manning.
2017. Get to the point: Summarization with pointer-
generator networks. In Proceedings of the 55th An-
nual Meeting of the Association for Computational
Linguistics (Volume 1: Long Papers), pages 1073–
1083, Vancouver, Canada. Association for Computa-
tional Linguistics.
Simone Teufel, Advaith Siddharthan, and Dan Tidhar.
2006. Automatic classification of citation function.
In Proceedings of the 2006 Conference on Empiri-
cal Methods in Natural Language Processing, pages
103–110, Sydney, Australia. Association for Compu-
tational Linguistics.
Hugo Touvron, Louis Martin, Kevin Stone, Peter Al-
bert, Amjad Almahairi, Yasmine Babaei, Nikolay
Bashlykov, Soumya Batra, Prajjwal Bhargava, Shruti
Bhosale, et al. 2023.
Llama 2:
Open founda-
tion and fine-tuned chat models.
arXiv preprint
arXiv:2307.09288.
Suppawong Tuarob, Sung Woo Kang, Poom Wet-
tayakorn, Chanatip Pornprasit, Tanakitti Sachati,
Saeed-Ul Hassan, and Peter Haddawy. 2019. Au-
tomatic classification of algorithm citation functions
in scientific literature. IEEE Transactions on Knowl-
edge and Data Engineering, 32(10):1881–1896.
Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob
Uszkoreit, Llion Jones, Aidan N Gomez, Łukasz
Kaiser, and Illia Polosukhin. 2017. Attention is all
you need. Advances in neural information processing
systems, 30.
Pancheng Wang, Shasha Li, Haifang Zhou, Jintao Tang,
and Ting Wang. 2019. Toc-rwg: Explore the com-
bination of topic model and citation information for
automatic related work generation. IEEE Access,
8:13043–13055.
Xinyu Xing, Xiaosheng Fan, and Xiaojun Wan. 2020.
Automatic generation of citation texts in scholarly
papers: A pilot study. In Proceedings of the 58th
Annual Meeting of the Association for Computational
Linguistics, pages 6181–6190, Online. Association
for Computational Linguistics.
Michihiro Yasunaga, Jungo Kasai, Rui Zhang, Alexan-
der R Fabbri,
Irene Li,
Dan Friedman,
and
Dragomir R Radev. 2019.
Scisummnet: A large
annotated corpus and content-impact models for sci-
entific paper summarization with citation networks.
In Proceedings of the AAAI conference on artificial
intelligence, volume 33, pages 7386–7393.
He Zhao, Zhunchen Luo, Chong Feng, Anqing Zheng,
and Xiaopeng Liu. 2019. A context-based framework
for modeling the role and function of on-line resource
citations in scientific literature. In Proceedings of
the 2019 Conference on Empirical Methods in Natu-
ral Language Processing and the 9th International
Joint Conference on Natural Language Processing
(EMNLP-IJCNLP), pages 5206–5215, Hong Kong,
China. Association for Computational Linguistics.
Prompt
Title: {{title}}
Abstract: {{abstract}}
Introduction: {{introduction}}
Conclusion: {{conclusion}}
What are the objective, method, findings, contributions
and keywords of the paper above? Answer in the format
of
Objective: XXX.
Method: XXX.
Findings: XXX.
Contribution: XXX.
Keywords: A; B; C.
Faceted Summary
Objective: {{objective}}
Method: {{method}}
Findings: {{findings}}
Contribution: {{contribution}}
Keywords: {{keywords}}
Table 6: Prompt and output format for generating
faceted summary of a paper.
Prompt
Faceted summary of the citing paper, {{title A}} by
{{author A}} et al. {{year A}}:
{{Faceted Summary A}}
Faceted summary of the cited paper, {{title B}} by
{{author B}} et al. {{year B}}:
{{Faceted Summary B}}
Citation contexts that {{author A}} et al. {{year A}}
cites {{author B}} et al. {{year B}} (which is cited as
{{citation marker of B in A}})):
1. {{span #1}}
2. {{span #2}}
......
Very briefly explain the relationship between {{author
A}} et al. {{year A}} and {{title B}} by {{author B}}
et al. {{year B}}. TLDR:
Relation Between Paper Pairs
{{author A}} et al. {{year A}} cites {{author B}} et al.
{{year B}} ......
Table 7: Prompt and output format for generating the
relationship between paper pairs. The “citation marker
of B in A” is how paper A refers to paper B, e.g. “B et
al. (2023)” or simply “[1]”.
A
Extractiveness of Generations
We use Grusky et al. (2018)’s coverage and den-
sity metrics to investigate how each of the features
contributes to the generated related work sections.
Coverage
measures how much generated text is
extracted from each of the input features. As Fig-
ure 5a shows, the features have very different cov-
erage scores. Many, such as faceted summaries,
cited paper abstracts, and CTS, have high coverage
across all generation variants. Since the informa-
tion among different features is likely to overlap,
the coverage scores do not sum to 1 for each variant;
for example, faceted summaries and cited paper ab-
stracts contain highly similar information.
Due to this overlap, certain features, such as
Prompt
How other papers cite {{author B}} et al. {{year B}}:
{{Relation between A1 and B}}
Example citation fragments:
1. {{span #1 of A1 citing B}}
2. {{span #2 of A1 citing B}}
......
{{Relation between A2 and B}}
Example citation fragments:
1. {{span #1 of A2 citing B}}
2. {{span #2 of A2 citing B}}
......
......
Very briefly answer what {{author B}} et al. {{year B}}
is mostly known for, and the common citation intent.
Hint: pay attention to how {{author B}} et al. {{year
B}} is referred by the citing papers. Answer in the
format of "{{author B}} et al. {{year B}} is known for
XXX and it is cited for YYY". TLDR:
Enriched Citation Usage
{{author B}} et al. {{year B}} is known for ... and it is
cited for ...
Table 8: Prompt and output format for generating en-
riched citation intent and usage of cited papers.
Prompt
Our title: {{title}}
Faceted summary of our paper:
{{Faceted Summary}}
Write a short summary of the main idea of the following
related work section paragraphs. Ignore citations.
{{Human-written related work section}}
Main idea of the target related work section
{{main ideas}}
Table 9: Prompt and output format for generating the
main ideas of the target related work section.
cited paper abstracts and CTS, have high coverage
scores even in variants where they are not part of
the input prompt (cells in cyan), suggesting they
contain information that is highly valued by the
LLM. The coverage of each feature varies only
slightly across prompt variants, likely due to the
same information overlap reason. The only excep-
tion is variant B: the human-provided main ideas
cannot be found in any other feature.
Density
measures the length of extracted frag-
ments. As the columns of Figure 5b show, scores
vary significantly among features. Interestingly, de-
spite faceted summaries and cited paper abstracts
having similar coverage scores, the former have
significantly higher density scores, indicating that
the LLM prefers to directly copy from the faceted
summaries. The main idea and relationship be-
tween paper pairs are also highly extractive. Note
that, although this kind of extraction can be vulner-
able to plagiarism, it is less of a concern for our
approach because the highly extractive features are
not taken directly from the cited papers, but from
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(a) Fluency
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(b) Organization and coherence
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(c) Relevance to the target paper
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(d) Relevance to the cited paper
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(e) Factuality
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(f) Usefulness/informativeness
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(g) Writing style
A
B
C
D
E
F
G
H
0
1
2
3
4
5
(h) Overall
Figure 3: Bar chart showing the distribution of human evaluation scores.
Prompt
We have finished writing the title, abstract, intro-
duction and conclusion section of our NLP paper
as follows:
Title: {{title}}
Abstract: {{abstract}}
Introduction: {{introduction}}
Conclusion: {{conclusion}}
However, the related work section is still missing.
Write our related work section that concisely cites
the following papers in a natural way using all of
the main ideas as the main story. Keep it short, e.g.
3 paragraphs at most. Make sure the related work
section does not conflict with the sections already
written. You can freely reorder the cited papers
to adapt to the main ideas. Pay extra attention to
<Usage> which indicates how each work is cited
by other work.
Main idea of our related work section:
{{main ideas}}
List of cited papers:
1. {{title B1}} by {{author B1}} et al. {{year
B1}}
{{Faceted Summary or Abstract of B1}}
<Usage> {{Enriched citation usage of B1}}
How other papers cite it:
{{Relation between Ax and B1}}
{{Relation between Ay and B1}}
...
Potentially useful sentences from this paper:
{{section #1}} {{CTS #1}}
{{section #2}} {{CTS #2}}
...
2. {{title B2}} by {{author B2}} et al. {{year
B2}}
......
Output
{{related work section}}
Table 10: Prompt and output format for generating the
full target related work section. Cited papers are given
in chronological order.
the feature-extraction LLM’s summaries.
Unlike coverage, density scores vary signifi-
cantly among variants, since the LLM is not able to
reconstruct an exact substring that is not present in
its input. When features are ablated from a variant,
their density scores are much lower (cells in cyan),
and the scores of the remaining features are much
higher. For example, in variant G, both the en-
riched citation usage and the relationship between
paper pairs are ablated; to compensate, G has very
high density scores for the main idea and faceted
summaries.
B
Examples of Features and Generated
Variants
We use Section 2 of this paper as an example target
related work section to demonstrate our key sup-
port features. For conciseness, we show only one
example per feature, as showing all features across
Field of Study
Count
Natural Language Processing
14
Machine Learning
4
Speech and Audio Processing
3
Computer Vision
2
Programming Languages
1
Robotics
1
Computer Graphics
1
Geoscience
1
Table 11: Distribution of the field of study among the
human-rated related work sections.
Year Count
2022
13
2023
7
2021
4
2019
1
2018
1
2016
1
Table 12: Distribution of the publication year among
the human-rated related work sections.
all cited papers would be extremely long.
We then generate the corresponding related work
section variants A-H. Due to the maximum input
length limit of our LLMs, we use the approach
described in Section 3.3 to generate the two para-
graphs in each variant sequentially.
B.1
Citation Network Features
Faceted Summary of Hoang and Kan (2010).
Objective: The objective of this paper is to intro-
duce the problem of automated related work sum-
marization and propose it as a challenge to the
automatic summarization community. The paper
aims to take initial steps towards solving this prob-
lem by dividing the task into general and specific
summarization processes.
Method: The paper presents a prototype Related
Work Summarization system, ReWoS, which takes
in a set of keywords arranged in a hierarchical fash-
ion that describes a target paper’s topics, to drive
A
B
C
D
E
F
G
H
0
1
2
3
4
5
Figure 4: Bar chart of the number of factual errors.
Metrics
A
B
C
D
E
F
G
H
Fluency
4.11
3.78
4.0
4.33
4.07
4.11
4.15
4.19
(0.87)
(1.23)
(0.9)
(0.72)
(0.81)
(0.74)
(0.59)
(0.72)
Organization and Coherence
3.30
3.07
3.33
3.70
3.59
3.59
3.52
3.37
(1.12)
(1.15)
(0.90)
(0.90)
(0.91)
(0.95)
(0.96)
(0.99)
Relevance (to target paper)
3.78
3.67
3.89
4.19
4.11
4.00
4.07
4.00
(0.99)
(1.09)
(1.03)
(0.67)
(0.83)
(0.94)
(0.81)
(0.98)
Relevance (to cited papers)
4.22
3.93
4.15
4.22
4.19
4.19
4.00
4.04
(0.57)
(1.05)
(0.70)
(0.63)
(0.67)
(0.77)
(0.86)
(0.74)
Factuality
4.04
3.89
3.74
3.89
3.93
4.30
3.93
3.74
(0.96)
(1.17)
(1.20)
(1.10)
(1.09)
(0.76)
(1.05)
(1.00)
Usefulness/Informativeness
3.74
3.30
3.59
3.52
3.85
3.70
3.59
3.78
(0.89)
(1.01)
(0.87)
(0.96)
(0.89)
(1.08)
(0.95)
(0.68)
Writing Style
3.48
3.07
3.30
3.78
3.70
3.52
3.44
3.81
(0.88)
(1.09)
(0.94)
(0.74)
(0.90)
(0.83)
(0.92)
(0.90)
Overall
3.33
2.89
3.15
3.48
3.67
3.56
3.22
3.15
(1.05)
(0.96)
(1.01)
(0.96)
(0.82)
(1.03)
(0.96)
(0.93)
# of factual errors
0.70
0.78
0.78
0.70
0.81
0.44
0.74
0.89
(0.94)
(1.07)
(1.07)
(0.81)
(0.98)
(0.92)
(1.14)
(1.13)
Table 13: Average (and standard deviation) of human evaluation scores.
A
B
C
D
E
F
G
H
main idea
target TAIC
faceted summary
cited abstract
intent/usage
relationship
CTS
0.35
0.17
0.32
0.35
0.36
0.35
0.35
0.33
0.41
0.37
0.37
0.42
0.41
0.38
0.41
0.42
0.54
0.58
0.56
0.51
0.55
0.54
0.56
0.53
0.51
0.53
0.52
0.52
0.51
0.51
0.53
0.51
0.34
0.41
0.35
0.35
0.31
0.35
0.28
0.33
0.49
0.56
0.5
0.5
0.48
0.48
0.43
0.48
0.62
0.62
0.61
0.62
0.63
0.61
0.63
0.63
(a) Coverage
A
B
C
D
E
F
G
H
3.66
0.35
2.89
3.48
3.76
3.57
4.24
3.32
1.08
0.99
0.8
1.11
1.07
0.84
1.12
1.13
3.03
3.77
3.46
1.97
3.48
3.09
3.81
2.92
1.5
1.7
1.62
1.51
1.6
1.57
1.78
1.5
1.41
2.28
1.71
1.63
1.07
1.73
0.85
1.35
2.47
3.52
2.66
2.58
2.78
2.15
1.6
2.36
1.58
1.66
1.54
1.51
1.64
1.47
1.66
1.69
(b) Density
Figure 5: Extractiveness of generated related work sections (n = 38), measured by coverage and density against
input features. Scores for features not included in the prompt for a variant are shown in cyan.
Metrics
Average
Std
Fluency
4.48
0.83
Organization and coherence
4.15
0.80
Relevance-citing
4.48
0.57
Relevance-cited
4.52
0.50
Factuality
4.44
0.62
# of factual errors
0.30
0.71
Usefulness/informativeness
4.33
0.72
Writing style
4.19
0.67
Overall
4.41
0.62
Table 14: Average and standard deviation of the varia-
tion with the best human evaluation overall score.
the creation of an extractive summary using two dif-
ferent strategies for locating appropriate sentences
for general topics as well as detailed ones. The
paper also conducts a study of the argumentative
patterns used in related work sections to describe
the plausible summarization tactics for their cre-
ation.
Findings: The paper’s initial results show an
improvement over generic multi-document summa-
rization baselines in a human evaluation.
Contribution: The paper introduces the novel
problem of automated related work summarization
and proposes it as a challenge to the automatic
summarization community. The paper presents a
prototype system, ReWoS, that takes initial steps
towards solving this problem by dividing the task
into general and specific summarization processes.
The paper also conducts a study of the argumen-
tative patterns used in related work sections to de-
scribe the plausible summarization tactics for their
creation.
Keywords: automated summarization, related
work summarization, multi-document summariza-
tion, citation prediction, keyphrase extraction.
Relationship between Xing et al. (2020) and See
et al. (2017).
Xing et al. (2020) cite See et al.
(2017) as a reference for the pointer-generator net-
work architecture, which they adapt for their own
task of automatic citation text generation in schol-
arly papers.
Enriched citation intent & usage of Xing et al.
(2020).
Xing et al. (2020) is known for proposing
a task of automatic citation text generation in schol-
arly papers and developing a multi-source pointer-
generator network with cross attention mechanism
to address it. It is cited for related work and as a
baseline for comparison in citation sentence gener-
ation tasks.
B.2
Target Paper Features
Main idea of Section 2.
The paragraph discusses
previous work on automatic related work genera-
tion, including Hoang and Kan’s proposal of gen-
erating the related work section given a list of pa-
pers to cite, and later extractive approaches that use
probabilistic models or BERT to select and concate-
nate sentences from cited papers. However, these
approaches result in outputs lacking coherence and
stylistic variation.
The paragraph discusses recent abstractive ap-
proaches that focus on citation text generation,
which involves generating a single citation sen-
tence or span given the cited paper(s) and assum-
ing the rest of the related work section and other
sections of the target paper are available. These
approaches use various architectures and mostly
rely on cited paper abstracts rather than full texts.
However, there is no standard benchmark evalua-
tion approach to compare methods from different
prior works.
B.3
CTS
Extracted from Hoang and Kan (2010).
[Struc-
ture of Related Work Section] Each article’s data
consists of the reference related work summary, the
collection of the input research articles Inspired by
the above observations, we propose a novel strat-
egy for related work summarization with respect to
a given topic tree.
C
Example Generated Variants
See Figures 6-13 for the reproduced Section 2 of
this paper.
In the last decade, several works have addressed the task of automatic related work generation.
Hoang et al.
(2010) introduced the problem of automated related work summarization and
proposed a prototype system, ReWoS, which laid the foundation for subsequent works in
the field. Hu et al. (2014) built upon this work by proposing a novel system for automatic
related work generation using an optimization approach. Chen et al. (2019) further explored
this area by proposing an approach for automatically generating a related work section in
scientific papers through summarizing citations. Wang et al. (2019) introduced a new framework,
ToC-RWG, for automatic related work generation by incorporating topic model and citation
information. Deng et al. (2021) proposed a novel and effective system for generating related
work sections based on sentence extraction and reordering using a BERT-based ensemble
model. However, these approaches result in outputs lacking coherence and stylistic variation,
which our work aims to address by proposing a workflow for generating a full related work
section using an abstractive approach and prompting large language models with key support features.
Recent abstractive approaches have focused on citation text generation, which involves generating a
single citation sentence or span given the cited paper(s) and assuming the rest of the related work
section and other sections of the target paper are available. For instance, Abura’ed et al. (2020)
proposed a method for generating related work sections in scientific documents using neural sequence
learning, while Xing et al. (2020) introduced a task of automatic citation text generation in scholarly
papers and developed a multi-source pointer-generator network with cross attention mechanism to
address it. Ge et al. (2021) proposed a framework for citing sentence generation that considers
both background knowledge and content information, and Luu et al. (2021) developed a dataset and
model for explaining relationships between scientific documents using natural language text. Chen
et al. (2021) proposed a relation-aware multi-document encoder for abstractive related work section
generation. However, there is no standard benchmark evaluation approach to compare methods from
different prior works.
Figure 6: Variant A (baseline).
In the last decade, several works have addressed the task of automatic related work generation.
Hoang et al. (2010) introduced the problem of automated related work summarization and proposed
a prototype system, ReWoS, which laid the foundation for subsequent works in the field. Hu et al.
(2014) built upon this work by proposing a novel system for automatic related work generation
using an optimization approach. Chen et al. (2019) further explored the idea of generating related
work sections by summarizing citations, while Wang et al. (2019) proposed a new framework,
ToC-RWG, that incorporates topic model and citation information for related work generation. Deng
et al. (2021) introduced a novel and effective system for generating related work sections based
on sentence extraction and reordering using a BERT-based ensemble model. In contrast to these
approaches, our work proposes a workflow for generating a full related work section by prompting
large language models (LLMs) with key support features, aiming to produce a related work section
that is comparable to a human first draft.
In recent years, several studies have focused on automatic related work generation. Abura’ed et
al. (2020) proposed a method for generating related work sections in scientific documents using
neural sequence learning. Xing et al. (2020) introduced a task of automatic citation text generation
in scholarly papers and developed a multi-source pointer-generator network with cross attention
mechanism to address it. Ge et al. (2021) proposed a framework for citing sentence generation that
considers both background knowledge and content information. Luu et al. (2021) developed a dataset
and model for explaining relationships between scientific documents using natural language text.
Chen et al. (2021) proposed a relation-aware multi-document encoder for abstractive related work
section generation. Li et al. (2022) developed a dataset for citation-oriented related work annotation
and proposed a framework for automatic related work generation. These works have employed
various techniques, such as Transformer models (Vaswani et al., 2017), pointer-generator networks
(See et al., 2017), and large language models (Radford et al., 2019; Beltagy et al., 2020). Our work
builds upon these studies by proposing a workflow for generating a related work section that is
comparable to a human draft by extracting and integrating key support features into informative
prompts for an LLM.
Figure 7: Variant B (main idea ablated).
The problem of automated related work summarization was first introduced by Hoang et al. (2010),
who proposed a prototype system, ReWoS, for generating related work sections. Subsequent works
have built upon this foundation, such as Hu et al. (2014), who proposed an optimization approach
for automatic related work generation using a PLSA model and regression models. Chen et al.
(2019) introduced an approach for generating related work sections by summarizing citations, while
Wang et al. (2019) proposed the ToC-RWG framework, which incorporates topic models and
citation information. More recently, Deng et al. (2021) developed a BERT-based ensemble model for
sentence extraction and reordering in related work sections. However, these extractive approaches
often result in outputs lacking coherence and stylistic variation, motivating our work on generating a
full related work section by prompting large language models and identifying key support features.
Recent abstractive approaches to citation text generation have focused on generating single citation
sentences or spans, given the cited paper(s) and assuming the availability of the rest of the related
work section and other sections of the target paper. Abura’ed et al. (2020) proposed a method
for generating related work sections in scientific documents using neural sequence learning, while
Xing et al. (2020) introduced a task of automatic citation text generation in scholarly papers and
developed a multi-source pointer-generator network with cross attention mechanism to address it.
Ge et al. (2021) proposed a framework for citing sentence generation that considers both background
knowledge and content information, and Luu et al. (2021) developed a dataset and model for
explaining relationships between scientific documents using natural language text. Chen et al. (2021)
proposed a relation-aware multi-document encoder for abstractive related work section generation,
and Li et al. (2022) developed a dataset for citation-oriented related work annotation and proposed
a framework for automatic related work generation. However, there is no standard benchmark
evaluation approach to compare methods from different prior works, and most of these approaches
rely on cited paper abstracts rather than full texts.
Figure 8: Variant C (target TAIC ablated).
In the last decade, several works have addressed the task of automatic related work generation.
Hoang et al. (2010) introduced the problem of automated related work summarization and proposed
a prototype system for it. Subsequent works, such as Hu et al. (2014), proposed a system for
automatic related work generation using an optimization approach, while Chen et al. (2019) focused
on generating related work sections through summarizing citations. Wang et al. (2019) proposed
a framework for automatic related work generation by incorporating topic model and citation
information. However, these extractive approaches often result in outputs lacking coherence and
stylistic variation. Deng et al. (2021) addressed this issue by proposing a novel system for generating
related work sections based on sentence extraction and reordering using a BERT-based ensemble
model. In contrast, our work explores generating a full related work section using an abstractive
approach by prompting large language models with key support features, aiming to produce a related
work section that is comparable to a human first draft.
Recent abstractive approaches have focused on citation text generation, which involves generating a
single citation sentence or span given the cited paper(s) and assuming the rest of the related work
section and other sections of the target paper are available. Xing et al. (2020) proposed a task of
automatic citation text generation in scholarly papers and developed a multi-source pointer-generator
network with cross attention mechanism to address it. Ge et al. (2021) proposed a framework
for citing sentence generation that considers both background knowledge and content information.
Luu et al. (2021) developed a dataset and model for explaining relationships between scientific
documents using natural language text, using citing sentences as a proxy for the task. Abura’ed et
al. (2020) proposed a method for generating related work sections in scientific documents using
neural sequence learning. Chen et al. (2021) proposed a relation-aware multi-document encoder for
abstractive related work section generation. These approaches mostly rely on cited paper abstracts
rather than full texts and use various architectures, such as Transformer models (Vaswani et al.,
2017) and Longformer (Beltagy et al., 2020). However, there is no standard benchmark evaluation
approach to compare methods from different prior works, as highlighted by Li et al. (2022), who
conducted a meta-study on automatic related work generation.
Figure 9: Variant D (cited paper abstracts instead of faceted summaries).
In the last decade, several works have addressed the task of automatic related work generation.
Hoang et al. (2010) introduced the problem and proposed a prototype system, ReWoS, for automated
related work summarization. Later, extractive approaches emerged, such as Hu et al. (2014), who
proposed an optimization approach for automatic related work generation using a PLSA model,
and Chen et al. (2019), who focused on summarizing citations for related work generation. Wang
et al. (2019) proposed the ToC-RWG framework, which combined topic modeling and citation
information for related work generation. Deng et al. (2021) introduced a BERT-based ensemble
model for sentence extraction and reordering to generate related work sections. However, these
extractive approaches often result in outputs lacking coherence and stylistic variation, motivating our
work on a fully abstractive related work generation system using large language models.
Recent abstractive approaches have focused on citation text generation, which involves generating a
single citation sentence or span given the cited paper(s) and assuming the rest of the related work
section and other sections of the target paper are available. Xing et al. (2020) proposed a new task of
automatic citation text generation in scholarly papers and developed a multi-source pointer-generator
network with cross attention mechanism to address it. Ge et al. (2021) proposed a framework for
citing sentence generation that considers both background knowledge and content information, while
Abura’ed et al. (2020) designed and evaluated an abstractive related work section generation system.
Luu et al. (2021) focused on explaining relationships between scientific documents using natural
language text, using citing sentences as a proxy for the task. Chen et al. (2021) addressed the
abstractive related work generation task and proposed a relation-aware multi-document encoder.
Li et al. (2022) developed a dataset for citation-oriented related work annotation and proposed
a framework for automatic related work generation. However, there is no standard benchmark
evaluation approach to compare methods from different prior works.
Figure 10: Variant E (citation intent/usage ablated).
The field of automatic related work generation has evolved significantly since Hoang et al. (2010)
introduced the problem and proposed a prototype system, ReWoS, for automated related work
summarization. Subsequent works have explored various approaches to tackle this challenge. Hu et
al. (2014) proposed an optimization-based system, ARWG, which leverages a PLSA model and
regression models to generate related work sections. Chen et al. (2019) introduced an approach that
generates related work sections by summarizing citations, while Wang et al. (2019) presented a
framework, ToC-RWG, that incorporates topic models and citation information for related work
generation. More recently, Deng et al. (2021) proposed SERGE, a BERT-based ensemble model
for sentence extraction and reordering to generate descriptive related work sections. Despite these
advancements, existing extractive approaches often result in outputs lacking coherence and stylistic
variation, motivating the need for more advanced abstractive methods, such as those based on BERT
(Devlin et al., 2019), to further improve the quality of automatically generated related work sections.
Recent abstractive approaches have focused on citation text generation, which involves generating
a single citation sentence or span given the cited paper(s) and assuming the rest of the related
work section and other sections of the target paper are available. These approaches use various
architectures and mostly rely on cited paper abstracts rather than full texts. For instance, Abura’ed et
al. (2020) proposed a method for generating related work sections using neural sequence learning,
while Xing et al. (2020) introduced a task of automatic citation text generation and developed a
multi-source pointer-generator network with cross attention mechanism. Ge et al. (2021) proposed a
framework for citing sentence generation that considers both background knowledge and content
information. Luu et al. (2021) developed a dataset and model for explaining relationships between
scientific documents using natural language text. Chen et al. (2021) proposed a relation-aware
multi-document encoder for abstractive related work section generation. However, there is no
standard benchmark evaluation approach to compare methods from different prior works. Some
studies, such as Li et al. (2022), have conducted meta-studies on automatic related work generation,
comparing existing literature and identifying potential areas for future research.
Figure 11: Variant F (relationship between papers ablated).
In the last decade, several works have addressed the task of automatic related work generation.
Hoang et al.
(2010) introduced the problem of automated related work summarization and
proposed a prototype system, ReWoS, which generates extractive summaries using keywords
arranged in a hierarchical fashion. Hu et al. (2014) proposed an optimization approach, ARWG,
which uses a PLSA model to split the sentence set of given papers into different topic-biased
parts and employs regression models to learn the importance of sentences. Chen et al. (2019)
presented an approach for generating related work sections by summarizing citations, while
Wang et al.
(2019) proposed a framework, ToC-RWG, that incorporates topic models and
citation information for related work generation. More recently, Deng et al. (2021) developed
SERGE, a BERT-based ensemble model for sentence extraction and reordering to generate
descriptive related work sections. However, these extractive approaches often result in outputs
lacking coherence and stylistic variation, motivating the need for more advanced abstractive methods.
Recent abstractive approaches have focused on citation text generation, which involves generating
a single citation sentence or span given the cited paper(s) and assuming the rest of the related
work section and other sections of the target paper are available. These approaches use various
architectures and mostly rely on cited paper abstracts rather than full texts (Abura’ed et al., 2020;
Xing et al., 2020; Ge et al., 2021; Luu et al., 2021; Chen et al., 2021). For instance, Abura’ed et al.
(2020) designed and evaluated an abstractive related work section generation system, while Xing
et al. (2020) proposed a multi-source pointer-generator network with a cross-attention mechanism
for citation text generation. Ge et al. (2021) introduced a framework called BACO that considers
both background knowledge and content information, and Luu et al. (2021) used citing sentences as
a proxy for explaining relationships between scientific documents. Chen et al. (2021) proposed a
Relation-aware Related work Generator (RRG) for abstractive related work section generation from
multiple scientific papers. Li et al. (2022) developed a dataset for citation-oriented related work
annotation and proposed a framework for automatic related work generation. However, there is no
standard benchmark evaluation approach to compare methods from different prior works.
Figure 12: Variant G (citation intent/usage and relationship between papers ablated).
The task of automatic related work generation has been explored in various ways over the past
decade. Hoang et al. (2010) introduced the problem and proposed a prototype system, ReWoS,
which laid the foundation for subsequent works. Hu et al. (2014) built upon this by proposing an
optimization approach for related work generation, while Chen et al. (2019) focused on summarizing
citations to generate related work sections. Wang et al. (2019) proposed the ToC-RWG framework,
which incorporated topic models and citation information for related work generation. Deng et al.
(2021) developed a BERT-based ensemble model for sentence extraction and reordering to generate
related work sections. However, these approaches often result in outputs lacking coherence and
stylistic variation, motivating our work on generating a full related work section using an abstractive
approach with large language models.
In recent years, several abstractive approaches have focused on citation text generation, which
involves generating a single citation sentence or span given the cited paper(s) and assuming the rest
of the related work section and other sections of the target paper are available. For instance, Abura’ed
et al. (2020) proposed a method for generating related work sections in scientific documents using
neural sequence learning, while Xing et al. (2020) introduced a task of automatic citation text
generation in scholarly papers and developed a multi-source pointer-generator network with cross
attention mechanism to address it. Ge et al. (2021) proposed a framework for citing sentence
generation that considers both background knowledge and content information, and Luu et al. (2021)
developed a dataset and model for explaining relationships between scientific documents using
natural language text. Chen et al. (2021) addressed the abstractive related work generation task
and proposed a relation-aware multi-document encoder. However, there is no standard benchmark
evaluation approach to compare methods from different prior works, and most of these approaches
rely on cited paper abstracts rather than full texts.
Figure 13: Variant H (baseline with CTS enhancement).
