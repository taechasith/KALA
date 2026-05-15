// Module-level store: fires fetch immediately on button click, before AIDecoder mounts
export const decodeStore = { doc: null, promise: null }
let _handler = null

export function setDecodeHandler(fn) { _handler = fn }

export function startDecode(doc) {
  const promise = fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: doc.filename, docId: doc.id, docMeta: doc, fileType: "metadata" }),
  }).then(r => r.json())

  if (_handler) {
    // AIDecoder already mounted — push directly
    _handler(doc, promise)
  } else {
    // AIDecoder not yet mounted — stash for consumeDecode on mount
    decodeStore.doc = doc
    decodeStore.promise = promise
  }
}

export function consumeDecode() {
  const { doc, promise } = decodeStore
  decodeStore.doc = null
  decodeStore.promise = null
  return { doc, promise }
}
