import { z } from 'zod';

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'form_item:required')
    .email('sign_up_form:email_looks_incomplete'),
  password: z
    .string()
    .min(1, 'form_item:required')
    .min(6, 'sign_up_form:password_at_least_characters')
    .refine(value => !value.includes(' '), 'sign_up_form:password_no_spaces'),
  firstName: z.string().trim().min(1, 'form_item:required'),
  lastName: z.string().trim().min(1, 'form_item:required'),
  terms: z
    .boolean()
    .refine(value => !!value, 'sign_up_form:please_accept_terms'),
});

export default schema;

export type TSignUpForm = z.infer<typeof schema>;
