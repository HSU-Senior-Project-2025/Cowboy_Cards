import type {
  Class,
  FlashcardSet,
  GetClassScoresRow,
  ListClassesOfAUserRow,
  ListMembersOfAClassRow,
  ListSetsOfAUserRow,
} from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Class details hook
export function useClassDetails(id: string) {
  return useQuery<Class, Error>({
    queryKey: ['class', id],
    queryFn: () =>
      makeHttpCall<Class>(`/api/classes/`, {
        method: 'GET',
        headers: { id },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Class flashcard sets hook
export function useClassSets(id: string) {
  return useQuery<FlashcardSet[], Error>({
    queryKey: ['classSets', id],
    queryFn: () =>
      makeHttpCall<FlashcardSet[]>(`/api/class_set/list_sets`, {
        method: 'GET',
        headers: { id },
      }),
    staleTime: 5 * 60 * 1000,
  });
}

// Class members hook
export function useClassMembers(id: string) {
  return useQuery<ListMembersOfAClassRow[], Error>({
    queryKey: ['classMembers', id],
    queryFn: () =>
      makeHttpCall<ListMembersOfAClassRow[]>(`/api/class_user/members`, {
        method: 'GET',
        headers: { class_id: id },
      }),
    staleTime: 5 * 60 * 1000,
  });
}

// Class leaderboard hook
export function useClassLeaderboard(id: string) {
  return useQuery<GetClassScoresRow[], Error>({
    queryKey: ['classLeaderboard', id],
    queryFn: () =>
      makeHttpCall<GetClassScoresRow[]>(`/api/classes/leaderboard`, {
        method: 'GET',
        headers: { id },
      }),
    staleTime: 5 * 60 * 1000,
  });
}

// User's available sets hook
export function useUserSets() {
  return useQuery<ListSetsOfAUserRow[], Error>({
    queryKey: ['userSets'],
    queryFn: () => makeHttpCall<ListSetsOfAUserRow[]>(`/api/set_user/list`),
    staleTime: 5 * 60 * 1000,
  });
}

// User's classes hook
export function useUserClasses() {
  return useQuery<ListClassesOfAUserRow[], Error>({
    queryKey: ['userClasses'],
    queryFn: () =>
      makeHttpCall<ListClassesOfAUserRow[]>('/api/class_user/classes'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Class update mutation
type UpdateClassArgs = { id: string; field: string; value: string };

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation<Class, Error, UpdateClassArgs>({
    mutationFn: ({ id, field, value }) =>
      makeHttpCall<Class>(`/api/classes/${field}`, {
        method: 'PUT',
        headers: { id, [field]: value },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['class', variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['userClasses'],
      });
    },
  });
}

// Delete student from class mutation
export function useDeleteStudent(class_id: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (studentId) =>
      makeHttpCall(`/api/class_user/`, {
        method: 'DELETE',
        headers: { student_id: studentId, class_id },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classMembers', class_id] });
      queryClient.invalidateQueries({
        queryKey: ['classLeaderboard', class_id],
      });
      queryClient.invalidateQueries({ queryKey: ['userClasses'] });
    },
  });
}

// Add set to class mutation
type AddSetToClassArgs = { classId: string; setId: number };

export function useAddSetToClass() {
  const queryClient = useQueryClient();

  return useMutation<string, Error, AddSetToClassArgs>({
    mutationFn: ({ classId, setId }) =>
      makeHttpCall<string>(`/api/class_set/`, {
        method: 'POST',
        headers: {
          class_id: classId,
          set_id: setId.toString(),
        },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['classSets', variables.classId],
      });
    },
  });
}
