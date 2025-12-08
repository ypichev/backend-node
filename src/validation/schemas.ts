import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
});

export const CreateRecordSchema = z.object({
  user_id: z.string().uuid(),
  category_id: z.string().uuid(),
  amount: z.number().positive(),
});

export const RecordFilterQuerySchema = z
  .object({
    user_id: z.string().uuid().optional(),
    category_id: z.string().uuid().optional(),
  })
  .refine((q) => q.user_id || q.category_id, {
    message: "user_id and/or category_id query params are required",
  });

export const CategoryDeleteQuerySchema = z.object({
  category_id: z.string().uuid(),
});

export const TopUpSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number().positive(),
});
