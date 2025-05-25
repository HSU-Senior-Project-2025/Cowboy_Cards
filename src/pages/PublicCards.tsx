import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useUserSets } from '@/hooks/useClassQueries';
import type { FlashcardSet } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonSearchbar,
  useIonToast,
} from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PublicFlashcards = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [searchText, setSearchText] = useState('');
  const [presentToast] = useIonToast();
  const { data: userSets, isLoading: isLoadingUserSets } = useUserSets();

  const filteredFlashcardSets = flashcardSets.filter(
    (set) =>
      set.SetName.toLowerCase().includes(searchText.toLowerCase()) ||
      (set.SetDescription &&
        set.SetDescription.toLowerCase().includes(searchText.toLowerCase()))
  );

  useEffect(() => {
    async function fetchSets() {
      setLoading(true);
      setError(null);
      try {
        const res = await makeHttpCall<FlashcardSet[]>(
          `/api/flashcards/sets/list`
        );
        setFlashcardSets(res);
      } catch (error) {
        setError(`Error fetching flashcard sets: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, []);

  const isUserMember = (setId: number): boolean => {
    if (!userSets) return false;
    return userSets.some((userSet) => userSet.SetID === setId);
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div id="main-content" className="container mx-auto px-0 py-8 w-4/5">
          <div className="flex items-center flex-col justify-between mb-4">
            <h1 className="text-4xl tracking-wide font-bold font-smokum pb-8">
              Public Flashcard Sets
            </h1>
            {loading || (isLoadingUserSets && <div>Loading...</div>)}
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <IonSearchbar
              value={searchText} // eslint-disable-next-line
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="Search flashcard sets"
              className="mb-4 max-w-lg"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFlashcardSets?.map(
              (set) =>
                !isUserMember(set.ID) && (
                  <Link key={set.ID} to={`/set-overview/${set.ID}`}>
                    <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                      <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                        <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                          {set.SetName}
                        </IonCardTitle>
                        <IonCardSubtitle className="text-sm ">
                          {set.SetDescription || 'No description'}
                        </IonCardSubtitle>
                        <IonButton
                          expand="block"
                          color="primary"
                          className="mt-4"
                          onClick={async (e) => {
                            try {
                              const response = await makeHttpCall(
                                `/api/set_user`,
                                {
                                  method: 'POST',
                                  headers: {
                                    set_id: set.ID,
                                    role: 'user',
                                  },
                                }
                              );
                              presentToast({
                                message: 'Successfully joined set',
                                duration: 2000,
                                color: 'success',
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['userSets'],
                              });
                            } catch (error) {
                              setError(`Error joining set: ${error.message}`);
                            }
                          }}
                        >
                          Join Set
                        </IonButton>
                      </IonCardHeader>
                    </IonCard>
                  </Link>
                )
            )}
          </div>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default PublicFlashcards;
