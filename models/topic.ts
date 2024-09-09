export interface Topic {
  id: string
  title: string
  userId: string
  likes: number
  description: string
  createdAt: Date
  parentId: string | null
  selected: string
}
