import { z } from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name Is Required! "}),
    instructions: z.string().min(1, { message: "Instructions Is Required! "})
})

export const agentsUpdateSchema = agentsInsertSchema.extend({
    id: z.string().min(1, { message: "ID Is Required!" })
})