import { Context } from "hono";
import { v7 as uuidv7 } from "uuid";
import z from "zod";

export const dbId = () => uuidv7();

export const validateReqBody =
  <T, TData>(
    schema: z.ZodSchema<TData>,
    next: (c: Context, data: TData) => Promise<T>
  ) =>
  async (c: Context) => {
    const json = await c.req.json().catch(() => ({}));
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    return next(c, parsed.data);
};
