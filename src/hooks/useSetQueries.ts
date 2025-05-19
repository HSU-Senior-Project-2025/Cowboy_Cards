import type { Flashcard, FlashcardSet } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Set details hook - Get a specific flashcard set
export function useSetDetails(id: string, enabled: boolean = true) {
  return useQuery<FlashcardSet, Error>({
    queryKey: ['set', id],
    queryFn: () =>
      makeHttpCall<FlashcardSet>(`/api/flashcards/sets/`, {
        method: 'GET',
        headers: { id },
      }),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Set cards hook - Get all cards in a set
export function useSetCards(id: string, enabled: boolean = true) {
  return useQuery<Flashcard[], Error>({
    queryKey: ['setCards', id],
    queryFn: () =>
      makeHttpCall<Flashcard[]>(`/api/flashcards/list`, {
        method: 'GET',
        headers: { set_id: id },
      }),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update set mutation - Update set name or description
type UpdateSetArgs = {
  id: string;
  field: 'set_name' | 'set_description';
  value: string;
};

export function useUpdateSet() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateSetArgs>({
    mutationFn: ({ id, field, value }) =>
      makeHttpCall(`/api/flashcards/sets/${field}`, {
        method: 'PUT',
        headers: { id, [field]: value },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['set', variables.id] });
    },
  });
}

// Update card mutation - Update card front or back
type UpdateCardArgs = {
  id: number;
  field: 'front' | 'back';
  value: string;
};

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateCardArgs>({
    mutationFn: ({ id, field, value }) =>
      makeHttpCall(`/api/flashcards/${field}`, {
        method: 'PUT',
        headers: { id, [field]: value },
      }),
    onSuccess: (_, variables) => {
      // We need to invalidate the setCards query that contains this card
      // First find the card to get its setId
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ['setCards'] });

      const setId = queries
        .map((query) => query.queryKey[1])
        .find((querySetId) => {
          const setCards = queryClient.getQueryData<Flashcard[]>([
            'setCards',
            querySetId,
          ]);
          return setCards?.some((card) => card.ID === variables.id);
        });

      if (setId) {
        queryClient.invalidateQueries({ queryKey: ['setCards', setId] });
      }
    },
  });
}

// Add card mutation - Add a new card to a set
type AddCardArgs = {
  setId: number;
  front: string;
  back: string;
};

export function useAddCard() {
  const queryClient = useQueryClient();

  return useMutation<Flashcard, Error, AddCardArgs>({
    mutationFn: ({ setId, front, back }) =>
      makeHttpCall<Flashcard>(`/api/flashcards`, {
        method: 'POST',
        headers: {
          front,
          back,
          set_id: setId,
        },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['setCards', variables.setId.toString()],
      });
    },
  });
}

// Delete card mutation - Remove a card from a set
export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (cardId) =>
      makeHttpCall(`/api/flashcards`, {
        method: 'DELETE',
        headers: { id: cardId },
      }),
    onSuccess: (_, cardId) => {
      // Similar to update, find the set that contains this card
      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ['setCards'] });

      const setId = queries
        .map((query) => query.queryKey[1])
        .find((querySetId) => {
          const setCards = queryClient.getQueryData<Flashcard[]>([
            'setCards',
            querySetId,
          ]);
          return setCards?.some((card) => card.ID === cardId);
        });

      if (setId) {
        queryClient.invalidateQueries({ queryKey: ['setCards', setId] });
      }
    },
  });
}

// Delete set mutation - Remove a flashcard set
export function useDeleteSet() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (setId) =>
      makeHttpCall<void>(`/api/flashcards/sets/`, {
        method: 'DELETE',
        headers: { id: setId },
      }),
    onSuccess: (_, setId) => {
      // Also invalidate any user sets queries that might contain this set
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
    },
  });
}
