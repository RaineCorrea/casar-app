import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGuests, addGuest as addGuestServer, type Guest } from "./server";
import supabase from "./client";
import { useEffect } from "react";

export type { Guest };

export const guestsQueryOptions = queryOptions({
  queryKey: ["guests"],
  queryFn: () => fetchGuests(),
});

export function useGuests() {
  return useQuery(guestsQueryOptions);
}

export function useAddGuest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guest: Omit<Guest, "id" | "created_at">) => {
      return addGuestServer({ data: guest });
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
  }, [queryClient]);

  return useGuests();
}
