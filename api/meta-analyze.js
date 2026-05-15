import Anthropic from "@anthropic-ai/sdk"

export const config = { maxDuration: 30 }

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { docIds, question } = req.body

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const { DOCUMENTS, AGENCIES, TYPES } = await import("../src/data/manifest.js")
  const docs = DOCUMENTS.filter(d => docIds?.includes(d.id) || !docIds)

  const agencyList = Object.entries(AGENCIES)
    .map(([k, v]) => `${k}=${v.label}`)
    .join(", ")

  const typeList = Object.entries(TYPES)
    .map(([k, v]) => `${k}=${v.label}`)
    .join(", ")

  const docList = docs.map(d =>
    `[${d.id}] ${d.title} | ${d.agency} | ${d.type} | ${d.year||"?"} | ${d.location}${d.redacted?" | REDACTED":""}`
  ).join("\n")

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: `You are KALA, a UAP intelligence analysis system. Answer questions about the document collection using metadata. Be precise, analytical, and cite document IDs when referencing specific records.

AGENCIES: ${agencyList}
DOCUMENT TYPES: ${typeList}`,
    messages: [{
      role: "user",
      content: `Complete archive (${docs.length} records):\n${docList}\n\nQuestion: ${question || "What patterns do you see in this collection? Which documents are most likely related?"}`
    }]
  })

  const clean = message.content[0].text
    .replace(/\*+/g, "")
    .replace(/#{1,6} /g, "")
    .replace(/`/g, "")
    .trim()
  res.json({ success: true, response: clean })
}
