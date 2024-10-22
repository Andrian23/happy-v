"use client"
import React, { useCallback } from "react"
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

import Blockquote from "@tiptap/extension-blockquote"
import BulletList from "@tiptap/extension-bullet-list"
import Italic from "@tiptap/extension-italic"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Strike from "@tiptap/extension-strike"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { type EditorEvents, EditorProvider, useCurrentEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { ToggleGroup, ToggleGroupItem } from "./ui/ToggleGroup"

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Type here, drag or paste image",
  }),
  Italic,
  Underline,
  Strike,
  TextAlign.configure({
    defaultAlignment: "left",
    types: ["heading", "paragraph"],
  }),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-inside list-disc [&>li>p]:inline",
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: "border-l-2  border-primary-500 my-4 pl-4",
    },
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

const Toolbar: React.FC = () => {
  const { editor } = useCurrentEditor()

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
    <div className="flex gap-1 border-b border-grey-400 p-1 text-primary-900">
      <ToggleGroup size="xs" type="multiple">
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

      <ToggleGroup size="xs" type="single">
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

      <ToggleGroup size="xs" type="single">
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
}

export const TextEditor: React.FC<TextEditorProps> = ({ onChange }) => {
  const handleChange = useCallback(
    (props: EditorEvents["update"]) => {
      onChange(props.editor.getHTML())
    },
    [onChange]
  )

  return (
    <div className="rounded-xl border border-grey-400 bg-white">
      <EditorProvider
        extensions={extensions}
        slotBefore={<Toolbar />}
        onUpdate={handleChange}
        editorContainerProps={{
          className:
            "[&>div]:min-h-56 [&>div]:max-h-56 [&>div]:overflow-y-auto [&>div]:ring-ring [&>div]:ring-offset-background [&>div:focus-visible]:outline-none [&>div:focus-visible]:ring-2 [&>div:focus-visible]:ring-offset-2 [&>div]:rounded-b-xl [&>div]:p-2",
        }}
      />
    </div>
  )
}
