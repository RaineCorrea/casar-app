import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z
    .string()
    .min(1, { message: 'VITE_SUPABASE_URL é obrigatório e não pode estar vazio' })
    .url({ message: 'VITE_SUPABASE_URL deve ser uma URL válida' }),
  VITE_SUPABASE_KEY: z
    .string()
    .min(1, { message: 'VITE_SUPABASE_KEY é obrigatório e não pode estar vazio' }),
  VITE_MERCADO_PAGO_PUBLIC_KEY: z
    .string()
    .min(1, { message: 'VITE_MERCADO_PAGO_PUBLIC_KEY é obrigatório para checkout' })
    .optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    const env = envSchema.parse({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
      VITE_MERCADO_PAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `- ${issue.path.join('.')}: ${issue.message}`;
      });

      console.error(
        '\n❌ Erro de validação das variáveis de ambiente:\n',
        errorMessages.join('\n')
      );
      console.error(
        '\n💡 Certifique-se de que o arquivo .env está configurado corretamente.\n'
      );

      throw new Error(
        'Variáveis de ambiente inválidas. Verifique o console para mais detalhes.'
      );
    }

    throw error;
  }
}

export const env = validateEnv();
