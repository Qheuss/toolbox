import { z } from 'zod';

export const optimisationSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  age: z.number().min(18, { message: 'You must be at least 18 years old' }),
  email: z.string().email({ message: 'Invalid email address' }),
});
