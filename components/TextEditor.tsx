"use client"

import React, { useCallback, useEffect } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ItalicIcon,
  LinkIcon,
  List,
  type LucideIcon,
  Quote,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react"

import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { type Editor, EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup"

const extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-inside list-disc [&>li>p]:inline",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-2  border-primary-500 my-4 pl-4",
      },
    },
  }),
  Placeholder.configure({
    placeholder: "Type here, drag or paste image",
  }),
  Underline,
  TextAlign.configure({
    defaultAlignment: "left",
    types: ["heading", "paragraph"],
  }),

  Link.configure({
    protocols: ["ftp", "mailto", "tel"],
    autolink: true,
    openOnClick: true,
    linkOnPaste: true,
    defaultProtocol: "https",
    HTMLAttributes: {
      class: "text-primary-500 hover:underline cursor-pointer",
      rel: "noopener noreferrer",
      target: "_blank",
    },
    validate: (href) => /^https?:\/\//.test(href),
  }),
]

type Formats = "Bold" | "Italic" | "Strike" | "Underline" | "BulletList" | "Blockquote"
type Alignments = "left" | "center" | "right"

const formatting: { value: string; icon: LucideIcon; ariaLabel: string; tooltip: Formats }[] = [
  { value: "bold", icon: Bold, ariaLabel: "Bold", tooltip: "Bold" },
  { value: "italic", icon: ItalicIcon, ariaLabel: "Italic", tooltip: "Italic" },
  { value: "underline", icon: UnderlineIcon, ariaLabel: "Underline", tooltip: "Underline" },
  { value: "strike", icon: Strikethrough, ariaLabel: "Strike", tooltip: "Strike" },
]

const alignment: { value: Alignments; icon: LucideIcon; ariaLabel: string }[] = [
  { value: "left", icon: AlignLeft, ariaLabel: "Align Left" },
  { value: "center", icon: AlignCenter, ariaLabel: "Align Center" },
  { value: "right", icon: AlignRight, ariaLabel: "Align Right" },
]

type ToolbarProps = {
  editor: Editor | null
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const toggleFormatting = useCallback(
    (format: Formats) => {
      if (!editor) return
      editor.chain().focus()[`toggle${format}`]().run()
    },
    [editor]
  )

  const toggleAlignment = useCallback(
    (alignment: Alignments) => {
      if (!editor) return
      editor.chain().focus().setTextAlign(alignment).run()
    },
    [editor]
  )

  const toggleLink = useCallback(() => {
    if (!editor) return

    const url = prompt("URL")

    if (url === null) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()

      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="border-grey-400 text-primary-900 flex border-b py-1">
      <ToggleGroup size="xs" type="multiple" className="px-1">
        {formatting.map(({ value, icon: Icon, ariaLabel, tooltip }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            data-state={editor?.isActive(value) ? "on" : "off"}
            aria-label={ariaLabel}
            onClick={() => toggleFormatting(tooltip)}
          >
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ToggleGroup size="xs" type="single" className="border-grey-400 border-l px-1">
        {alignment.map(({ value, icon: Icon, ariaLabel }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            data-state={editor?.isActive({ textAlign: value }) ? "on" : "off"}
            aria-label={ariaLabel}
            onClick={() => toggleAlignment(value)}
          >
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
        <ToggleGroupItem
          value="bullet-list"
          data-state={editor?.isActive("bulletList") ? "on" : "off"}
          aria-label="Bullet List"
          onClick={() => toggleFormatting("BulletList")}
        >
          <List className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup size="xs" type="single" className="border-grey-400 border-l px-1">
        <ToggleGroupItem
          value="quote"
          data-state={editor?.isActive("blockquote") ? "on" : "off"}
          aria-label="Blockquote"
          onClick={() => toggleFormatting("Blockquote")}
        >
          <Quote className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="link"
          data-state={editor?.isActive("link") ? "on" : "off"}
          aria-label="Link"
          onClick={toggleLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

type TextEditorProps = {
  onChange: (content: string) => void
  value?: string
}

export const TextEditor: React.FC<TextEditorProps> = ({ onChange, value }) => {
  const editor = useEditor({
    extensions,
    immediatelyRender: true,
    onUpdate: (props) => onChange(props.editor.getHTML()),
  })

  useEffect(() => {
    if (value === "") {
      editor?.commands.clearContent()
    }
  }, [value, editor])

  return (
    <div className="border-grey-400 rounded-xl border bg-white">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        onChange={(e) => {
          console.log(e.target)
        }}
        className="[&>div]:ring-ring [&>div]:ring-offset-background [&>div]:max-h-56 [&>div]:min-h-56 [&>div]:overflow-y-auto [&>div]:rounded-b-xl [&>div]:p-2 [&>div:focus-visible]:ring-2 [&>div:focus-visible]:ring-offset-2 [&>div:focus-visible]:outline-hidden"
      />
    </div>
  )
}
