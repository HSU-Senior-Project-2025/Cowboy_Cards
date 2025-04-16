import { Navbar } from '@/components/Navbar';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { FlashcardSet } from '@/types/flashcards';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonText,
  IonTextarea,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * CreateSet Component
 *
 * This component handles the creation of new flashcard set metadata (title and description).
 * It provides a form for entering these details and submitting them to the backend.
 * After successful creation, it navigates the user to the overview page for the new set.
 * Card creation is handled separately, likely on an edit/overview page.
 */
const CreateSet = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Saves the flashcard set metadata (title, description) to the database
   * using a POST request to `/api/flashcards/sets/`.
   * On successful creation, navigates the user to the overview page
   * for the newly created set (`/set-overview/:id`).
   */
  const saveSet = async () => {
    setLoading(true);
    setError(null);

    // Validate inputs
    const newErrors = { title: '', description: '' };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      // 1. Create the set
      const setResponse = await makeHttpCall<FlashcardSet>(
        `${API_BASE}/api/flashcards/sets`,
        {
          method: 'POST',
          headers: {
            set_name: title,
            set_description: description,
          },
        }
      );

      // Navigate to the set overview page
      history.push(`/set-overview/${setResponse.ID}`);
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      setError(`Failed to save flashcard set: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonContent className="ion-padding">
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8 max-w-4xl">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <h1 className="text-3xl font-bold mb-6">Create New Flashcard Set</h1>

        {/* Title & Description inputs */}
        <IonCard className="mb-6 rounded-lg border shadow-sm">
          <IonCardContent>
            <IonTextarea
              placeholder="Enter set title"
              value={title}
              onIonChange={(e) => setTitle(e.detail.value!)}
              rows={1}
              autoGrow
              className="w-full text-xl font-bold mb-2"
              style={{ resize: 'none' }}
            />
            {errors.title && (
              <IonText color="danger">
                <p className="text-sm mt-1">{errors.title}</p>
              </IonText>
            )}

            <IonTextarea
              placeholder="Enter set description"
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
              rows={1}
              autoGrow
              className="w-full text-base mt-4"
              style={{ resize: 'none' }}
            />
            {errors.description && (
              <IonText color="danger">
                <p className="text-sm mt-1">{errors.description}</p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* Create button */}
        <div className="flex justify-center">
          <IonButton
            color="success"
            className="rounded-lg shadow-sm w-full md:w-auto"
            onClick={saveSet}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Set'}
          </IonButton>
        </div>
      </div>
    </IonContent>
  );
};

export default CreateSet;
