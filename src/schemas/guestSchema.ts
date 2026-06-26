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
      .regex(
        /^[a-zA-ZÀ-ÿ\s]+$/,
        "O nome deve conter apenas letras e espaços"
      )
      .refine(
        (name) => {
          const names = name.trim().split(/\s+/);
          return names.length >= 2;
        },
        { message: "Digite nome completo (nome e sobrenome)" }
      )
      .refine(
        (name) => {
          const names = name.trim().split(/\s+/);
          return names.every((n) => n.length >= 2);
        },
        { message: "Cada nome deve ter no mínimo 2 letras" }
      ),

    telefone: z
      .string()
      .min(1, "O telefone é obrigatório")
      .trim()
      .transform((val) => val.replace(/\D/g, ""))
      .refine(
        (val) => val.length >= 10 && val.length <= 11,
        "O telefone deve ter 10 ou 11 dígitos"
      )
      .refine(
        (val) => {
          const ddd = parseInt(val.substring(0, 2));
          return VALID_DDDS.includes(ddd);
        },
        { message: "DDD inválido" }
      )
      .refine(
        (val) => {
          return !/^(.)\1+$/.test(val);
        },
        { message: "Telefone inválido" }
      ),

    email: z
      .string()
      .min(1, "O e-mail é obrigatório")
      .trim()
      .toLowerCase()
      .email("Formato de e-mail inválido")
      .max(254, "O e-mail deve ter no máximo 254 caracteres")
      .refine(
        (email) => {
          return !/\s/.test(email);
        },
        { message: "O e-mail não pode conter espaços" }
      )
      .refine(
        (email) => {
          const parts = email.split("@");
          return parts.length === 2 && parts[1].includes(".");
        },
        { message: "E-mail inválido" }
      )
      .refine(
        (email) => {
          const domain = email.split("@")[1];
          return domain && domain.length >= 2 && domain.includes(".");
        },
        { message: "Domínio de e-mail inválido" }
      )
      .refine(
        (email) => {
          return !/[<>|,;"'\\]/.test(email);
        },
        { message: "O e-mail contém caracteres inválidos" }
      ),
  })
  .refine(
    (data) => {
      return data.name.length > 0 && data.telefone.length > 0 && data.email.length > 0;
    },
    {
      message: "Todos os campos são obrigatórios",
      path: ["name"],
    }
  );

export type GuestFormData = z.infer<typeof guestSchema>;
