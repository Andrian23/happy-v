import { z } from "zod"

import { TopicType } from "@prisma/client"

export const topicSchema = z.object({
  type: z.enum([TopicType.ASK, TopicType.SUGGESTION]),
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Description is required" }),
})

export type TopicData = z.infer<typeof topicSchema>
