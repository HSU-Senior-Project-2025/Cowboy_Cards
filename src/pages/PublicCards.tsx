import { Navbar } from '@/components/Navbar';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonSearchbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type FlashcardSet = {
  ID: number;
  SetName: string;
  SetDescription: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const PublicFlashcards = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [searchText, setSearchText] = useState('');
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
          `${API_BASE}/api/flashcards/sets/list`
        );
        setFlashcardSets(res);
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
        setError(`Error fetching flashcard sets: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchSets();
  }, []);

  return (
    <IonContent>
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8 w-1/2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold pb-8">Public Flashcard Sets</h1>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <IonSearchbar
            value={searchText}
            onIonInput={(e: any) => setSearchText(e.target.value)} // Use onIonInput for real-time updates
            placeholder="Search flashcard sets"
            className="mb-4 w-1/2"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFlashcardSets.map((set) => (
            <Link key={set.ID} to={`/flashcards/${set.ID}`}>
              <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                  <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    {set.SetName}
                  </IonCardTitle>
                  <IonCardSubtitle className="text-sm text-gray-600">
                    {set.SetDescription || 'No description'}
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </Link>
          ))}
        </div>
      </div>
    </IonContent>
  );
};

export default PublicFlashcards;
