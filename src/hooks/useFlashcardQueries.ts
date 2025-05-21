import type { Flashcard, FlashcardSet } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Flashcard set details hook - Get a specific flashcard set
export function useFlashcardSetDetails(id: string) {
  return useQuery<FlashcardSet, Error>({
    queryKey: ['flashcardSet', id],
    queryFn: () =>
      makeHttpCall<FlashcardSet>(`/api/flashcards/sets/`, {
        method: 'GET',
        headers: { id },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Flashcard cards hook - Get all cards in a set
export function useFlashcardCards(id: string) {
  return useQuery<Flashcard[], Error>({
    queryKey: ['flashcardCards', id],
    queryFn: () =>
      makeHttpCall<Flashcard[]>(`/api/flashcards/list`, {
        method: 'GET',
        headers: { set_id: id },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Update card study status mutation - Mark card as correct/incorrect
export function useUpdateCardStudyStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { cardId: number; isCorrect: boolean }>({
    mutationFn: ({ cardId, isCorrect }) => {
      const endpoint = isCorrect
        ? '/api/card_history/correct'
        : '/api/card_history/incorrect';

      return makeHttpCall(endpoint, {
        method: 'POST',
        headers: {
          card_id: cardId.toString(),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
    },
  });
}
