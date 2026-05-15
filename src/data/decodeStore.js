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

  window.dispatchEvent(new CustomEvent("kala:decode-start", { detail: { title: doc.title, id: doc.id } }))

  if (_handler) {
    _handler(doc, promise)
  } else {
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
