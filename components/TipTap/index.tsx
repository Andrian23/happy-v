"use client"

import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import Image from "@tiptap/extension-image"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Strike from "@tiptap/extension-strike"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import Toolbar from "../Toolbar"

import "./index.css"

interface TiptapProps {
  onChange: (content: string) => void
  content: string
}

const TipTap = ({ onChange, content }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type here, drag or paste image",
      }),
      Italic,
      Strike,
      Underline,
      Link.configure({
        protocols: ["ftp", "mailto", "tel"],
        autolink: true,
        openOnClick: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "my-custom-class",
          rel: "noopener noreferrer",
          target: "_blank",
          style: "color: #6CB4DA; text-decoration: underline;",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList,
      Blockquote.configure({
        HTMLAttributes: {
          class: "blockquote-class",
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "my-image-class",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      if (typeof onChange === "function") {
        onChange(newContent)
      }
    },
  })

  return (
    <div className="rounded-[12px] border border-[#CFD1DA] bg-white">
      <div className="border-b border-[#CFD1DA]">
        <Toolbar editor={editor} content={content} />
      </div>
      <div className="px-[12px] py-[8px]">
        <EditorContent editor={editor} style={{ height: "222px" }} />
      </div>
    </div>
  )
}

export default TipTap
