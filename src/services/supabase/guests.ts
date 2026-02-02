import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "./client";
import { useEffect } from "react";

interface Guest {
  id: string;
  name: string;
  email?: string;
  telefone?: string;
  created_at: string;
}

export function useGuests() {
  return useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("GuestList").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Guest[];
    },
  });
}

export function useAddGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guest: Omit<Guest, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("GuestList")
        .insert([guest])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as Guest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
}

export function useGuestsWithRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("guestlist-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "GuestList",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["guests"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useGuests();
}
