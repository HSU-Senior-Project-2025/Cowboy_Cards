// SetOverview.tsx
import { Navbar } from '@/components/Navbar';
import { Flashcard, FlashcardSet } from '@/types/flashcards';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SetOverview = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  /**
   * State to hold the list of flashcards for the current set.
   * @type {[Flashcard[], React.Dispatch<React.SetStateAction<Flashcard[]>>]}
   */
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);

  /**
   * State to control the visibility of the delete confirmation alert.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchSetDetails = async () => {
      try {
        const setRes = await makeHttpCall<FlashcardSet>(
          `${API_BASE}/api/flashcards/sets/`,
          {
            method: 'GET',
            headers: { id: id },
          }
        );
        setTitle(setRes.SetName);
        setDescription(setRes.SetDescription);
      } catch (error) {
        console.error('Failed to fetch set info', error);
      }
    };

    const fetchCards = async () => {
      setLoadingCards(true);
      try {
        const res = await makeHttpCall<Flashcard[]>(
          `${API_BASE}/api/flashcards/list`,
          {
            method: 'GET',
            headers: { set_id: id },
          }
        );
        // Store the full Flashcard objects, assuming the API returns Flashcard[]
        setCards(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Failed to fetch cards', error);
        setCards([]);
      } finally {
        setLoadingCards(false);
      }
    };

    if (id) {
      fetchSetDetails();
      fetchCards();
    }
  }, [id]);

  /**
   * Handles the deletion of the current flashcard set.
   * Sends a DELETE request to the API and navigates to the dashboard on success.
   */
  const handleDeleteSet = async () => {
    if (!id) {
      console.error('Cannot delete set: ID is missing.');
      return; // Prevent API call if id is somehow missing
    }
    try {
      // Send DELETE request to the backend API
      await makeHttpCall<void>( // Expecting no content on successful delete
        `${API_BASE}/api/flashcards/sets/`,
        {
          method: 'DELETE',
          headers: {
            id: id, // Pass the set ID in the header
          },
        }
      );
      // Navigate back to the student dashboard or a relevant page after deletion
      history.push('/student-dashboard');
      // Optional: Show a success toast message here
    } catch (error) {
      console.error('Failed to delete set:', error);
      // Optional: Show an error toast message here
      // Consider more specific error handling based on API responses if available
    }
  };

  return (
    <IonContent className="ion-padding">
      <Navbar />
      <div id="main-content" className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          {/* Left: Back Button + Title & Description aligned */}
          <div className="flex items-center gap-4 flex-1 pr-4">
            {/* Back Button */}
            <IonButton
              className="rounded-lg"
              fill="outline"
              style={{ '--border-radius': '0.5rem' }}
              onClick={() => window.history.back()}
            >
              Back
            </IonButton>

            {/* Title + Description (stacked) */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-base mt-1 text-gray-700">{description}</p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="self-start md:self-center flex gap-2 md:mt-0 mt-4 w-full md:w-auto">
            {/* Edit Set Button */}
            <IonButton
              className="rounded-lg w-1/3 md:w-auto"
              fill="outline"
              style={{ '--border-radius': '0.5rem' }}
              routerLink={`/edit-set/${id}`}
            >
              Edit Set
            </IonButton>
            {/* Study Set Button */}
            <IonButton
              className="rounded-lg w-1/3 md:w-auto"
              color={'primary'}
              style={{ '--border-radius': '0.5rem' }}
              routerLink={`/flashcards/${id}`}
            >
              Study Set
            </IonButton>
            {/* Delete Set Button */}
            <IonButton
              className="rounded-lg w-1/3 md:w-auto"
              color={'danger'}
              style={{ '--border-radius': '0.5rem' }}
              onClick={() => setShowDeleteAlert(true)}
            >
              Delete Set
            </IonButton>
          </div>
        </div>

        <div className="mt-8 min-h-[200px] flex items-center justify-center">
          {loadingCards ? (
            <IonSpinner name="circular" />
          ) : cards.length === 0 ? (
            <div className="text-center">
              <p className="text-lg text-gray-900 dark:text-gray-400 mb-4">
                This set has no cards yet.
              </p>
              <IonButton
                color="primary"
                className="rounded-lg"
                style={{ '--border-radius': '0.5rem' }}
                routerLink={`/edit-set/${id}`}
              >
                Add Cards
              </IonButton>
            </div>
          ) : (
            <div className="w-full">
              {cards.map((card, index) => (
                <IonCard
                  key={index}
                  className="mb-4 rounded-lg border shadow-sm"
                >
                  <IonCardContent>
                    {/* Card number label */}
                    <div className="border-b border-gray-300 mb-3 pb-1 m-4">
                      <IonText className="text-md font-semibold text-gray-900 dark:text-gray-300">
                        Card {index + 1}
                      </IonText>
                    </div>

                    {/* Front / Back layout */}
                    <div className="flex flex-row justify-between items-start">
                      {/* Front (30%) */}
                      <div className="w-3/12 pr-4 border-r border-gray-300 m-4">
                        <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                          {card.Front}
                        </IonText>
                      </div>

                      {/* Back (70%) */}
                      <div className="w-9/12 pl-4 m-4">
                        <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                          {card.Back}
                        </IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header={'Confirm Deletion'}
        message={
          'Are you sure you want to delete this set? This action cannot be undone.'
        }
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Delete canceled');
            },
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              handleDeleteSet();
            },
          },
        ]}
      />
    </IonContent>
  );
};

export default SetOverview;
