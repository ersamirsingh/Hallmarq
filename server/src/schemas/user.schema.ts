import { z } from 'zod';
import { Role } from '@prisma/client';
import { nameSchema, emailSchema, addressSchema, passwordSchema } from './auth.schema.js';

export const adminCreateUserSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      email: emailSchema,
      address: addressSchema,
      password: passwordSchema,
      role: z
        .enum(['ADMIN', 'USER', 'OWNER', 'STORE_OWNER'])
        .transform((val) => (val === 'STORE_OWNER' ? Role.OWNER : (val as Role)))
    })
    .strict()
});
