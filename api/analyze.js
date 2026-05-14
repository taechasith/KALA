import Anthropic from "@anthropic-ai/sdk"

export const config = { maxDuration: 60 }

const JSON_SCHEMA = `{
  "summary": "2-3 sentence executive summary",
  "visual_description": "for images/video: what is visually depicted",
  "classification_era": "WWII|POSTWAR|COLDWAR|MODERN1|MODERN2|CURRENT",
  "document_type": "single word type",
  "key_entities": {
    "locations": ["places mentioned or visible"],
    "dates": ["dates/times"],
    "objects": ["UAP descriptions: shape, size, behavior, visual characteristics"],
    "witnesses": ["witness roles/titles"],
    "agencies": ["agencies mentioned or marked"],
    "classifications": ["classification markings found"]
  },
  "incident_details": {
    "description": "what was observed or depicted",
    "behavior": "UAP behavior characteristics",
    "duration": "observation duration",
    "sensor_data": "radar/optical/thermal/IR data if visible"
  },
  "significance": "LOW|MEDIUM|HIGH|CRITICAL",
  "significance_reason": "one sentence why",
  "related_topics": ["3-5 keywords for cross-referencing"],
  "redaction_level": "NONE|PARTIAL|HEAVY",
  "confidence_score": 0.0
}`

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { content, filename, docId, docMeta, imageData, fileType } = req.body

  if (!content && !docMeta && !imageData) {
    return res.status(400).json({ error: "content, docMeta, or imageData required" })
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const systemPrompt = `You are KALA — a classified intelligence analysis system specializing in UAP (Unidentified Anomalous Phenomena) analysis. Analyze all inputs: documents, images, and video frames with precision and objectivity. Return structured JSON.`

  let messageContent

  if (imageData && !imageData.isVideo) {
    // Single image — vision analysis
    const { base64, mediaType } = imageData
    messageContent = [
      {
        type: "image",
        source: { type: "base64", media_type: mediaType || "image/jpeg", data: base64 },
      },
      {
        type: "text",
        text: `Analyze this UAP-related image: ${filename || docId || "unknown"}

Describe what you see visually, identify any UAP objects, aircraft, phenomena, text, markings, timestamps, or relevant details.

Return JSON:
${JSON_SCHEMA}`,
      },
    ]

  } else if (imageData && imageData.isVideo) {
    // Multiple video frames — vision analysis
    const { frames, duration, resolution, mediaType } = imageData
    const frameContent = frames.map((frame, i) => ({
      type: "image",
      source: { type: "base64", media_type: mediaType || "image/jpeg", data: frame },
    }))

    messageContent = [
      ...frameContent,
      {
        type: "text",
        text: `These are ${frames.length} frames extracted from UAP video: ${filename || docId || "unknown"}
Video duration: ${duration ? duration.toFixed(1) + "s" : "unknown"} · Resolution: ${resolution || "unknown"}
Frames captured at: beginning, middle, and end of video.

Analyze what you see in these frames. Identify any UAP objects, aircraft, anomalies, behaviors, visual characteristics, and context clues.

Return JSON:
${JSON_SCHEMA}`,
      },
    ]

  } else if (content && content !== "[IMAGE_VISION]" && content !== "[VIDEO_VISION]") {
    // Text / PDF content
    const cleanContent = content.startsWith("[BASE64_PDF]:")
      ? "[Note: Binary PDF — analyze based on filename and structure clues]\n\nFilename: " + (filename || docId)
      : content.substring(0, 40000)

    messageContent = `Analyze this UAP document: ${filename || docId || "unknown"}

DOCUMENT CONTENT:
${cleanContent}

Return JSON:
${JSON_SCHEMA}`

  } else if (docMeta) {
    // Metadata-only assessment
    messageContent = `Preliminary intelligence assessment from metadata only:

Document ID: ${docMeta.id}
Title: ${docMeta.title}
Agency: ${docMeta.agency}
Type: ${docMeta.type}
Year: ${docMeta.year || "Unknown"}
Location: ${docMeta.location}
File size: ${(docMeta.size / 1024).toFixed(0)} KB
Is Redacted: ${docMeta.redacted}

Return JSON with confidence_score below 0.4, mark incident_details as "Pending document decode":
${JSON_SCHEMA}`

  } else {
    return res.status(400).json({ error: "No analyzable content provided" })
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: messageContent,
      }],
    })

    const raw = message.content[0].text
    let parsed
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
    } catch {
      parsed = { raw }
    }

    res.json({ success: true, analysis: parsed, docId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Analysis failed", detail: err.message })
  }
}
