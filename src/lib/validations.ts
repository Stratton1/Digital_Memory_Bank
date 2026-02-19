import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const memorySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(50000, "Content must be less than 50,000 characters"),
  memoryDate: z.string().optional(),
  location: z.string().max(200).optional(),
  isPrivate: z.boolean().default(true),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export const promptResponseSchema = z.object({
  responseText: z
    .string()
    .min(1, "Response is required")
    .max(50000, "Response must be less than 50,000 characters"),
  convertToMemory: z.boolean().default(false),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type MemoryInput = z.infer<typeof memorySchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PromptResponseInput = z.infer<typeof promptResponseSchema>;
