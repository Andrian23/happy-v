import { z } from "zod"

export const replySchema = z.object({
  content: z.string().min(1, { message: "You should type something" }),
})

export type ReplyData = z.infer<typeof replySchema>
