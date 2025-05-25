import { getVespaClient } from "./client"

export async function indexDocumentInVespa(document: {
  title: string,
  abstract: string,
  introduction: string,
  conclusion: string,
  url: string
}) {
  try {
    const vespaClient = getVespaClient()


    // Index the main document
    await vespaClient.indexDocument(document.url, {
      title: document.title,
      abstract: document.abstract,
      introduction: document.introduction,
      conclusion: document.conclusion,
      url: document.url
    })


    return {
      success: true,
      documentId: document.url,
    }
  } catch (error) {
    console.error("❌ Error indexing document in Vespa:", error)
    throw error
  }
}
