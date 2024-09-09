import React, { useState } from "react"
import Modal from "react-modal"

type UrlModalProps = {
  isOpen: boolean
  onRequestClose: () => void
  onSubmit: (url: string) => void
}

const UrlModal = ({ isOpen, onRequestClose, onSubmit }: UrlModalProps) => {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(url)
    setUrl("")
    onRequestClose()
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Enter URL">
      <h2>Enter the URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  )
}

export default UrlModal
