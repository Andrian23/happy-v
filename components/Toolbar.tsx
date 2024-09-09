"use client"

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react"

import { type Editor } from "@tiptap/core"

import "./TipTap/index.css"

type ToolbarProps = {
  editor: Editor | null
  content: string
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        editor.chain().focus().setImage({ src: base64 }).run()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center gap-2 p-1">
      <button
        className={editor.isActive("italic") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleItalic().run()
        }}
      >
        <Italic width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("bold") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBold().run()
        }}
      >
        <Bold width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("underline") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleUnderline().run()
        }}
      >
        <Underline width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("strike") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleStrike().run()
        }}
      >
        <Strikethrough width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("link") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          const url = prompt("Enter the URL")
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run()
          }
        }}
      >
        <LinkIcon width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive({ textAlign: "left" }) ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign("left").run()
        }}
      >
        <AlignLeft width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive({ textAlign: "center" }) ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign("center").run()
        }}
      >
        <AlignCenter width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive({ textAlign: "right" }) ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().setTextAlign("right").run()
        }}
      >
        <AlignRight width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("bulletList") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBulletList().run()
        }}
      >
        <List width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("blockquote") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          editor.chain().focus().toggleBlockquote().run()
        }}
      >
        <Quote width={12} height={12} color="#25425D" />
      </button>
      <button
        className={editor.isActive("image") ? "rounded-md bg-primary-500 p-1" : "p-1"}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById("image-upload")?.click()
        }}
      >
        <ImageIcon width={12} height={12} color="#25425D" />
      </button>
      <input type="file" id="image-upload" style={{ display: "none" }} accept="image/*" onChange={handleImageUpload} />
    </div>
  )
}

export default Toolbar
