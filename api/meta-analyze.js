import Anthropic from "@anthropic-ai/sdk"

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { docIds, question } = req.body

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const { DOCUMENTS } = await import("../src/data/manifest.js")
  const docs = DOCUMENTS.filter(d => docIds?.includes(d.id) || !docIds)
  const docList = docs.slice(0, 50).map(d =>
    `- [${d.id}] ${d.title} | ${d.agency} | ${d.type} | ${d.year||"?"} | ${d.location}`
  ).join("\n")

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: "You are KALA, a UAP intelligence analysis system. Answer questions about document collections using metadata. Be precise, analytical, and cite document IDs.",
    messages: [{
      role: "user",
      content: `Document collection metadata:\n${docList}\n\nQuestion: ${question || "What patterns do you see in this collection? Which documents are most likely related?"}`
    }]
  })

  res.json({ success: true, response: message.content[0].text })
}
