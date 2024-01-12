import { z } from "zod";

export default z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255).optional(),
  coverImage: z.string().min(1).max(255).optional().nullable(),
  list: z.array(z.string()).optional(),
});
