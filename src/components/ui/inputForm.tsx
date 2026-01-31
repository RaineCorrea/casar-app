import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supabase from "../../services/supabase/client";
import { guestSchema, type GuestFormData } from "../../schemas/guestSchema";
import { toastError, totastSuccess } from "../../utils/toast";
import { Element } from "react-scroll";
import { useState } from "react";
import {
  WaveTopDecoration,
  LeafDecoration,
  CircleDecoration,
  HeartIcon,
  UserIcon,
  ErrorIcon,
  PhoneIcon,
  EmailIcon,
  SpinnerIcon,
  CheckIcon,
  StarIcon,
} from "../icons";

export default function InputForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  async function handleForm(data: GuestFormData) {
    setIsSubmitting(true);

    const guestData = {
      name: data.name,
      telefone: data.telefone,
      email: data.email,
    };

    const { data: responseData, error } = await supabase
      .from("GuestList")
      .insert([guestData])
      .select();

    setIsSubmitting(false);

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
      reset();
    }
  }

  return (
    <Element
      name="rsvp"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, var(--color-sage) 0%, var(--color-forest) 100%)`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-32 opacity-10">
        <WaveTopDecoration />
      </div>

      <div className="absolute top-20 right-20 w-48 h-48 opacity-10 animate-sway">
        <LeafDecoration />
      </div>

      <div className="absolute bottom-20 left-20 w-32 h-32 opacity-10 animate-float">
        <CircleDecoration />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="w-16 h-px bg-cream/30" />
            <HeartIcon />
            <span className="w-16 h-px bg-cream/30" />
          </div>

          <h2 className="font-display text-cream text-4xl md:text-5xl mb-4 font-medium">
            Confirme sua Presença
          </h2>

          <p className="font-body text-cream/80 text-lg max-w-md mx-auto leading-relaxed">
            Será uma alegria imensa ter você conosco nesse dia especial. Por
            favor, confirme sua presença até{" "}
            <strong className="text-terracotta-light">
              01 de Outubro de 2026
            </strong>
            .
          </p>
        </div>

        <div className="bg-cream/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lifted">
          <form onSubmit={handleSubmit(handleForm)} className="space-y-6">
            <div className="group">
              <label
                htmlFor="name"
                className="block font-body text-forest text-sm uppercase tracking-wider mb-2"
              >
                Nome Completo
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="Digite seu nome completo"
                  className="w-full px-5 py-4 bg-wheat/50 border-2 border-sage-light/30 rounded-xl font-body text-forest-dark placeholder-forest/50 transition-all duration-300 focus:border-terracotta focus:bg-cream focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <UserIcon />
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-terracotta-dark text-sm font-body flex items-center gap-1">
                  <ErrorIcon />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="telefone"
                className="block font-body text-forest text-sm uppercase tracking-wider mb-2"
              >
                Telefone
              </label>
              <div className="relative">
                <input
                  id="telefone"
                  type="tel"
                  {...register("telefone")}
                  placeholder="(00) 00000-0000"
                  className="w-full px-5 py-4 bg-wheat/50 border-2 border-sage-light/30 rounded-xl font-body text-forest-dark placeholder-forest/50 transition-all duration-300 focus:border-terracotta focus:bg-cream focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <PhoneIcon />
                </div>
              </div>
              {errors.telefone && (
                <p className="mt-2 text-terracotta-dark text-sm font-body flex items-center gap-1">
                  <ErrorIcon />
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="group">
              <label
                htmlFor="email"
                className="block font-body text-forest text-sm uppercase tracking-wider mb-2"
              >
                E-mail
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="seu@email.com"
                  className="w-full px-5 py-4 bg-wheat/50 border-2 border-sage-light/30 rounded-xl font-body text-forest-dark placeholder-forest/50 transition-all duration-300 focus:border-terracotta focus:bg-cream focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                  <EmailIcon />
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-terracotta-dark text-sm font-body flex items-center gap-1">
                  <ErrorIcon />
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group cursor-pointer relative w-full mt-8 py-4 px-8 bg-forest text-cream font-display text-lg tracking-wide rounded-xl overflow-hidden transition-all duration-300 hover:bg-forest-dark hover:shadow-lifted disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-terracotta to-terracotta-dark transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <SpinnerIcon />
                    Confirmando...
                  </>
                ) : (
                  <>
                    Confirmar Presença
                    <CheckIcon />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-forest/20 text-center">
            <p className="text-forest/70 text-sm font-body font-medium">
              Sua confirmação é muito importante para nós
            </p>
            <div className="mt-4 flex justify-center">
              <StarIcon />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-20 text-center">
        <p className="font-accent text-cream/80 text-4xl mb-2">
          Matheus & Nicolly
        </p>
        <p className="text-cream/50 text-sm tracking-widest uppercase">
          18.11.2026
        </p>
      </div>
    </Element>
  );
}
