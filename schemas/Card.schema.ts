import { z } from "zod";

export default z.object({
  title: z.string(),
  description: z.string(),
  list: z.string(),
});
