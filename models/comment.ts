export interface Comment {
  id: string
  comment: string
  createdAt: Date
  parentId: string | null
  topicId: string
  likes: number
  userId: string
  replies?: Comment[]
  parent?: Comment | null
}
