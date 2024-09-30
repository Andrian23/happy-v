import { create } from "zustand"

import { Template } from "@/models/recommendation"

type State = {
  templates: Template[]
  selectedTemplate: Template | null
}

type Action = {
  setTemplates: (templates: Template[]) => void
  setTemplate: (template: Template) => void
  clearTemplate: () => void
}

export const useTemplateStore = create<State & Action>((set) => ({
  templates: [],
  selectedTemplate: null,
  setTemplates: (templates) => set({ templates }),
  setTemplate: (template) => set({ selectedTemplate: template }),
  clearTemplate: () => set({ selectedTemplate: null }),
}))
