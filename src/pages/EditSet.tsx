/**
 * @file src/pages/EditSet.tsx
 * Purpose: Provides a page for editing the details of a flashcard set
 * and managing the flashcards within that set.
 */

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { Flashcard, FlashcardSet } from '@/types/flashcards';
import {
  IonContent,
  IonLoading,
  IonText,
  IonPage,
  IonCard,
  IonCardContent,
  IonTextarea,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addOutline, trashOutline } from 'ionicons/icons'; // Import icons

// Base URL for the API, likely from environment variables
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * EditSet Component
 *
 * Fetches and displays the details of a specific flashcard set and its cards.
 * Allows editing of set title and description, and adding, removing, and editing cards.
 */
const EditSet = () => {
  // Get the set ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  // State for storing original fetched data
  const [originalSetDetails, setOriginalSetDetails] =
    useState<FlashcardSet | null>(null);
  const [originalCards, setOriginalCards] = useState<Flashcard[]>([]); // Keep original cards for comparison later

  // State for editable data
  const [editedSetName, setEditedSetName] = useState<string>('');
  const [editedSetDescription, setEditedSetDescription] = useState<string>('');
  const [cards, setCards] = useState<Flashcard[]>([]); // This holds the current editable list of cards

  // State for managing loading and error status
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Set ID is missing from URL.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [fetchedSetDetails, fetchedCards] = await Promise.all([
          makeHttpCall<FlashcardSet>(`${API_BASE}/api/flashcards/sets/`, {
            method: 'GET',
            headers: { id: id },
          }),
          makeHttpCall<Flashcard[]>(`${API_BASE}/api/flashcards/list`, {
            method: 'GET',
            headers: { set_id: id },
          }),
        ]);

        // Store original data
        setOriginalSetDetails(fetchedSetDetails);
        setOriginalCards(fetchedCards);

        // Initialize editable state
        setEditedSetName(fetchedSetDetails.SetName);
        setEditedSetDescription(fetchedSetDetails.SetDescription);
        setCards(fetchedCards); // Initialize editable cards with fetched cards
      } catch (err) {
        console.error('Error fetching data for EditSet:', err);
        let message = 'Unknown error';
        if (err instanceof Error) message = err.message;
        setError(`Failed to load set data: ${message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- State Handlers ---

  /**
   * Handles changes to the set's title or description inputs.
   */
  const handleSetDetailChange = (
    field: 'SetName' | 'SetDescription',
    value: string | null | undefined
  ) => {
    const newValue = value ?? ''; // Ensure value is a string
    if (field === 'SetName') {
      setEditedSetName(newValue);
    } else {
      setEditedSetDescription(newValue);
    }
  };

  /**
   * Adds a new, empty flashcard template to the editable cards list.
   * Uses Date.now() as a temporary unique key for React rendering before saving.
   * The actual ID will be assigned by the backend.
   */
  const addCard = () => {
    if (!originalSetDetails) return; // Should not happen if data loaded

    const newCard: Flashcard = {
      ID: Date.now(), // Temporary ID for React key - ensure this doesn't conflict with real IDs
      Front: '',
      Back: '',
      SetID: originalSetDetails.ID, // Assign the correct SetID
      CreatedAt: new Date().toISOString(), // Placeholder, backend will set real dates
      UpdatedAt: new Date().toISOString(), // Placeholder
    };
    setCards([...cards, newCard]);
  };

  /**
   * Removes a card from the editable cards list at the specified index.
   */
  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  /**
   * Updates the Front or Back content of a card in the editable list.
   */
  const updateCard = (
    index: number,
    field: 'Front' | 'Back',
    value: string | null | undefined
  ) => {
    const newValue = value ?? ''; // Ensure value is a string
    setCards(
      cards.map((card, i) =>
        i === index ? { ...card, [field]: newValue } : card
      )
    );
  };

  // --- Render --- //

  return (
    <IonPage>
      <Navbar />
      <IonContent className="ion-padding">
        <div
          id="main-content"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          <h1 className="text-3xl font-bold mb-6">Edit Flashcard Set</h1>

          <IonLoading isOpen={loading} message={'Loading set data...'} />

          {error && !loading && (
            <IonText color="danger">
              <p>Error: {error}</p>
            </IonText>
          )}

          {!loading && !error && originalSetDetails && (
            <>
              {/* Set Details Inputs */}
              <IonCard className="mb-6 rounded-lg border shadow-sm">
                <IonCardContent>
                  <IonTextarea
                    label="Set Title" // Added label for clarity
                    labelPlacement="stacked"
                    placeholder="Enter set title"
                    value={editedSetName}
                    onIonChange={(e) =>
                      handleSetDetailChange('SetName', e.detail.value)
                    }
                    rows={1}
                    autoGrow
                    className="w-full text-xl font-bold mb-2"
                    style={{ resize: 'none' }}
                  />
                  {/* TODO: Add validation error display if needed */}

                  <IonTextarea
                    label="Set Description" // Added label for clarity
                    labelPlacement="stacked"
                    placeholder="Enter set description"
                    value={editedSetDescription}
                    onIonChange={(e) =>
                      handleSetDetailChange('SetDescription', e.detail.value)
                    }
                    rows={2} // Allow a bit more space for description
                    autoGrow
                    className="w-full text-base mt-4"
                    style={{ resize: 'none' }}
                  />
                  {/* TODO: Add validation error display if needed */}
                </IonCardContent>
              </IonCard>

              {/* Cards List Editor */}
              <h2 className="text-xl font-semibold mb-2">Edit Cards</h2>
              {cards.map((card, index) => (
                <IonCard
                  key={card.ID} // Use card ID as key (or temporary ID for new cards)
                  className="mb-4 rounded-lg border shadow-sm"
                >
                  <IonCardContent>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Card {index + 1} {card.ID > 0 ? '(Existing)' : '(New)'}{' '}
                        {/* Indicate if card is new */}
                      </span>
                      <IonButton
                        fill="clear"
                        color="danger"
                        size="small"
                        onClick={() => removeCard(index)}
                        className="-mt-2 -mr-2" // Adjust position slightly
                      >
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </div>
                    <IonTextarea
                      label={`Front (Card ${index + 1})`} // Unique label
                      labelPlacement="stacked"
                      placeholder="Front of card"
                      value={card.Front}
                      onIonChange={(e) =>
                        updateCard(index, 'Front', e.detail.value)
                      }
                      rows={2}
                      autoGrow
                      className="mb-3"
                      style={{ resize: 'none' }}
                    />
                    <IonTextarea
                      label={`Back (Card ${index + 1})`} // Unique label
                      labelPlacement="stacked"
                      placeholder="Back of card"
                      value={card.Back}
                      onIonChange={(e) =>
                        updateCard(index, 'Back', e.detail.value)
                      }
                      rows={2}
                      autoGrow
                      style={{ resize: 'none' }}
                    />
                  </IonCardContent>
                </IonCard>
              ))}

              {/* Add Card Button */}
              <div className="flex justify-center mt-4 mb-6">
                <IonButton onClick={addCard} fill="outline">
                  <IonIcon slot="start" icon={addOutline} /> Add Card
                </IonButton>
              </div>

              {/* Save Changes Button (Placeholder for Step 3.3) */}
              <div className="flex justify-end">
                <IonButton
                  onClick={() => console.log('Save changes clicked')} // Placeholder action
                  color="primary"
                >
                  Save Changes
                </IonButton>
              </div>
            </>
          )}
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default EditSet;
