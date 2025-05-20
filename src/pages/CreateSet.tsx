import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import type { FlashcardSet } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonPage,
  IonText,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const CreateSet = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const saveSet = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

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
      const setResponse = await makeHttpCall<FlashcardSet>(
        `/api/flashcards/sets`,
        {
          method: 'POST',
          headers: {
            set_name: title,
            set_description: description,
          },
        }
      );

      setTitle('');
      setDescription('');

      setShowSuccess(true);

      // history.push(`/set-overview/${setResponse.ID}`);
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      setError(`Failed to save flashcard set: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div
          id="main-content"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <h1 className="text-4xl tracking-wide font-bold font-smokum mb-6">
            Create New Flashcard Set
          </h1>

          <IonCard className="mb-6 rounded-lg border shadow-sm">
            <IonCardContent>
              <IonTextarea
                placeholder="Enter Set Title"
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
                placeholder="Enter Set Description"
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

          <div className="flex justify-center">
            <IonButton
              color="primary"
              className="rounded-lg shadow-sm w-full md:w-auto"
              onClick={saveSet}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Set'}
            </IonButton>
          </div>

          {showSuccess && (
            <IonToast
              isOpen={showSuccess}
              color="success"
              onDidDismiss={() => setShowSuccess(false)}
              message="Set created successfully!"
              duration={2000}
            />
          )}
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateSet;
