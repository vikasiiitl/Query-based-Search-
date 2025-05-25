// app/api/search/route.ts
import { NextResponse } from "next/server"
import axios from "axios"
import https from "https"
import fs from "fs"
import path from "path"
import { generateGeminiAnswer } from "@/lib/gemini"

const VESPA_ENDPOINT = "https://a0b0770e.e336405d.z.vespa-app.cloud/search"

const httpsAgent = new https.Agent({
  cert: fs.readFileSync(path.resolve("src/app/api/vespa/search/serve.pem")),
  key: fs.readFileSync(path.resolve("src/app/api/vespa/search/serve_key.pem")),
})

export async function POST(req: Request) {
  try {
    const { query, topK = 10 } = await req.json()

    if (!query) {
      return NextResponse.json({ message: "Missing query" }, { status: 400 })
    }

    // Split query into words and build OR-based search
    const words = query.trim().split(/\s+/)
    const queryParts = words.map((word: string) =>
      `(title contains "${word}" OR abstract contains "${word}" OR introduction contains "${word}" OR conclusion contains "${word}")`
    )
    const combinedQuery = queryParts.join(" OR ")

    const vespaQuery = {
      yql: `select * from sources * where ${combinedQuery};`,
      ranking: "default",
      hits: topK,
    }

    const vespaResponse = await axios.post(VESPA_ENDPOINT, vespaQuery, {
      headers: { "Content-Type": "application/json" },
      httpsAgent,
    })

    const hits = vespaResponse.data.root.children ?? []

    if (hits.length === 0) {
      return NextResponse.json({ message: "No results found" }, { status: 404 })
    }

    // Extract fields correctly
    const context = hits
      .map((hit: any) => {
        const { title = "", abstract = "", introduction = "", conclusion = "" } = hit.fields
        return `Title: ${title}\nAbstract: ${abstract}\nIntroduction: ${introduction}\nConclusion: ${conclusion}`
      })
      .join("\n\n")

    // Ask Gemini
    const prompt = `Answer the following question based on the context below:\n\nQuestion: ${query}\n\nContext:\n${context}`
    const geminiResponse = await generateGeminiAnswer(prompt)

    return NextResponse.json({
      answer: geminiResponse,
      query,
      vespaHits: hits,
    })
  } catch (error: any) {
    console.error("Vespa query failed:", error.response?.data || error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
