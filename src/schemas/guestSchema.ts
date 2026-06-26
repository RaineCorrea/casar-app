import { z } from "zod";

const VALID_DDDS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24,
  27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46,
  47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77,
  79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
];

export const guestSchema = z
  .object({
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .trim()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Apenas letras e espaços")
      .refine((val) => val.trim().split(/\s+/).length >= 2, {
        message: "Digite nome completo (nome e sobrenome)",
        abort: true,
      }),

    telefone: z
      .string()
      .min(1, "O telefone é obrigatório")
      .transform((val) => val.replace(/\D/g, ""))
      .refine((val) => val.length >= 10 && val.length <= 11, {
        message: "O telefone deve ter 10 ou 11 dígitos",
        abort: true,
      })
      .refine((val) => {
        const ddd = parseInt(val.substring(0, 2));
        return VALID_DDDS.includes(ddd);
      }, { message: "DDD inválido", abort: true })
      .refine((val) => !/^(.)\1+$/.test(val), {
        message: "Telefone inválido",
        abort: true,
      }),

    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .trim()
      .toLowerCase()
      .email("E-mail inválido")
      .max(254, "E-mail muito longo")
      .refine((val) => !/[<>|,;"'\\]/.test(val), {
        message: "E-mail contém caracteres inválidos",
        abort: true,
      }),
  })
  .refine((data) => data.name && data.telefone && data.email, {
    message: "Todos os campos são obrigatórios",
    path: ["name"],
  });

export type GuestFormData = z.infer<typeof guestSchema>;
