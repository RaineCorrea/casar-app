import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "../../services/supabase/client";
import { guestSchema, type GuestFormData } from "../../schemas/guestSchema";
import { toastError, totastSuccess } from "../../utils/toast";
import { Element } from "react-scroll";

export default function InputForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  async function handleForm(data: GuestFormData) {
    const guestData = {
      name: data.name,
      telefone: data.telefone,
      email: data.email,
    };

    const { data: responseData, error } = await supabase
      .from("GuestList")
      .insert([guestData])
      .select();

    if (error) {
      console.error("Erro ao enviar dados:", error);

      if (error.code === "23505") {
        toastError("Este e-mail já está cadastrado!");
      } else {
        toastError("Erro ao confirmar presença. Tente novamente.");
      }
    } else {
      console.log("Dados enviados com sucesso:", responseData);
      totastSuccess("Presença confirmada com sucesso!");
    }
  }

  return (
    <Element name="rsvp" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Confirme sua presença</h1>
      <form onSubmit={handleSubmit(handleForm)}>
        <div>
          <input
            type="text"
            {...register("name")}
            placeholder="Digite seu nome completo"
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.name.message}
            </span>
          )}
        </div>
        <hr />

        <div>
          <input
            type="text"
            {...register("telefone")}
            placeholder="Digite seu telefone"
          />
          {errors.telefone && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.telefone.message}
            </span>
          )}
        </div>
        <hr />

        <div>
          <input
            type="text"
            {...register("email")}
            placeholder="Digite seu e-mail"
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.email.message}
            </span>
          )}
        </div>
        <hr />

        <button type="submit">Confirmar</button>
      </form>
    </Element>
  );
}
