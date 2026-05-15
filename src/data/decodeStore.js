// Module-level store: fires fetch immediately on button click, before AIDecoder mounts
export const decodeStore = { doc: null, promise: null }

export function startDecode(doc) {
  decodeStore.doc = doc
  decodeStore.promise = fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: doc.filename, docId: doc.id, docMeta: doc, fileType: "metadata" }),
  }).then(r => r.json())
}

export function consumeDecode() {
  const { doc, promise } = decodeStore
  decodeStore.doc = null
  decodeStore.promise = null
  return { doc, promise }
}
