import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";
import axios from "axios";

type DocumentInput = {
  url: string;
  title: string;
  introduction: string;
  abstract: string;
  conclusion: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const document: DocumentInput = body.document;

    if (!document || !document.title || !document.abstract) {
      return new Response(JSON.stringify({ error: "Missing required document fields" }), {
        status: 400,
      });
    }

    const agent = new https.Agent({
      cert: fs.readFileSync(path.resolve("src/app/api/vespa/load/ingest.pem")),
      key: fs.readFileSync(path.resolve("src/app/api/vespa/load/ingest_key.pem")),
    });

    const baseUrl = "https://fcad28f7.c3df2a2d.z.vespa-app.cloud/";

    const payload = {
      fields: {
        document_id: document.url,
        title: document.title,
        abstract: document.abstract,
        introduction: document.introduction,
        conclusion: document.conclusion,
      },
    };

    const response = await axios.post(
      `${baseUrl}/document/v1/msmarco/passage/docid/${document.url || 0}`,
      payload,
      {
        httpsAgent: agent,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ message: "✅ Document indexed", data: response.data }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("❌ Error indexing document:", error);
    return new Response(
      JSON.stringify({
        error: error.response?.data || error.message || "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
