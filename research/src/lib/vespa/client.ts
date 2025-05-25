import axios from "axios"

export class VespaClient {

  async indexDocument(documentId: string, fields: Record<string, any>) {
    try {
      const response = await axios.post("/api/vespa/load", {
        document: {
          title: fields.title,
          abstract: fields.abstract,
          introduction: fields.introduction,
          conclusion: fields.conclusion,
          url: fields.url
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to call /api/vespa/load:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to index document via backend route");
    }
  }


}

// Singleton accessor
let vespaClient: VespaClient | null = null

export function getVespaClient() {
  if (!vespaClient) {
    vespaClient = new VespaClient()
  }
  return vespaClient
}
