import { create } from "zustand"

interface State {
  selectedTitles: string[]
  addTitle: (title: string) => void
  removeTitle: (title: string) => void
  clearTitles: () => void
}

type Action = {
  addTitle: (title: string) => void
  removeTitle: (title: string) => void
  clearTitles: () => void
}

export const useCooperationStore = create<State & Action>((set) => ({
  selectedTitles: [],
  addTitle: (title) =>
    set((state) => ({
      selectedTitles: [...state.selectedTitles, title],
    })),
  removeTitle: (title) =>
    set((state) => ({
      selectedTitles: state.selectedTitles.filter((t) => t !== title),
    })),
  clearTitles: () => set({ selectedTitles: [] }),
}))
