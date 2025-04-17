/**
 * @file src/pages/EditSet.tsx
 * Purpose: Provides a page for editing the details of a flashcard set
 * and managing the flashcards within that set (add, edit, delete).
 */

//TODO: Add a back button to the page

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { Flashcard, FlashcardSet } from '@/types/flashcards';
import {
  IonContent,
  IonLoading,
  IonText,
  IonPage,
  IonButton,
  useIonToast,
} from '@ionic/react';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// Import the extracted components
import SetMetadataEditor from '@/components/edit-set/SetMetadataEditor';
import FlashcardListEditor from '@/components/edit-set/FlashcardListEditor';

// Base URL for the API, likely from environment variables
const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * EditSet Component
 *
 * Allows users to edit the metadata (title, description) of a flashcard set
 * and manage its associated cards (add, edit, delete).
 * Fetches initial set and card data based on the ID in the URL.
 * Provides UI elements for editing and persists changes via API calls.
 * Uses child components SetMetadataEditor and FlashcardListEditor for UI structure.
 *
 * @returns {JSX.Element} The EditSet page component.
 */
const EditSet = () => {
  /** @type {{ id: string }} Extracts the set ID from the URL route parameters. */
  const { id } = useParams<{ id: string }>();
  /** @type {Function} Hook to display toast notifications for feedback. */
  const [presentToast] = useIonToast();

  // --- State Variables ---
  /** @type {FlashcardSet | null} Stores the original set details fetched from the API. Used for comparison. */
  const [originalSetDetails, setOriginalSetDetails] =
    useState<FlashcardSet | null>(null);
  /** @type {Flashcard[]} Stores the original list of cards fetched from the API. Used for comparison. */
  const [originalCards, setOriginalCards] = useState<Flashcard[]>([]);

  /** @type {string} Holds the current edited value for the set's name in the input field. */
  const [editedSetName, setEditedSetName] = useState<string>('');
  /** @type {string} Holds the current edited value for the set's description in the input field. */
  const [editedSetDescription, setEditedSetDescription] = useState<string>('');
  /** @type {Flashcard[]} Holds the current, potentially modified, list of cards being edited in the UI. */
  const [cards, setCards] = useState<Flashcard[]>([]);

  /** @type {boolean} Tracks the loading state during the initial data fetch. */
  const [loading, setLoading] = useState<boolean>(true);
  /** @type {string | null} Stores any error message encountered during the initial data fetch. */
  const [error, setError] = useState<string | null>(null);
  /** @type {boolean} Tracks the loading state during the save operation (API calls). */
  const [isSaving, setIsSaving] = useState<boolean>(false);
  /** @type {string | null} Stores any error message encountered during the save operation. */
  const [saveError, setSaveError] = useState<string | null>(null);

  /**
   * Fetches initial set details and card list from the backend.
   * Uses `useCallback` to memoize the function, preventing unnecessary re-creation.
   * Called on component mount and when the `id` parameter changes.
   * Updates original state and initializes editable state.
   * @async
   */
  const fetchData = useCallback(async () => {
    if (!id) {
      setError('Set ID is missing from URL.');
      setLoading(false);
      return;
    }
    // Reset states before fetching
    setLoading(true);
    setError(null);
    setSaveError(null);
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
      setOriginalSetDetails(fetchedSetDetails);
      setOriginalCards(fetchedCards);
      setEditedSetName(fetchedSetDetails.SetName);
      setEditedSetDescription(fetchedSetDetails.SetDescription);
      // Ensure fetched cards have positive IDs if backend guarantees it
      if (fetchedCards) {
        setCards(fetchedCards.map((card) => ({ ...card, ID: card.ID || 0 })));
      } else {
        setCards([]);
      }
    } catch (err) {
      console.error('Error fetching data for EditSet:', err);
      let message = 'Unknown error';
      if (err instanceof Error) message = err.message;
      setError(`Failed to load set data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Effect hook to run `fetchData` on mount and when `fetchData` (dependency: id) changes.
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- State Handlers ---

  /**
   * Updates the state for the edited set name or description based on input changes.
   * @param {'SetName' | 'SetDescription'} field - The specific field being changed.
   * @param {string | null | undefined} value - The new value from the input event.
   */
  const handleSetDetailChange = (
    field: 'SetName' | 'SetDescription',
    value: string | null | undefined
  ) => {
    const newValue = value ?? '';
    if (field === 'SetName') {
      setEditedSetName(newValue);
    } else {
      setEditedSetDescription(newValue);
    }
  };

  /**
   * Appends a new, empty flashcard object to the `cards` state array.
   * New cards are initialized with ID = 0 to differentiate them from existing cards.
   */
  const addCard = () => {
    if (!originalSetDetails) return;
    const newCard: Flashcard = {
      ID: 0, // Use 0 to indicate a new card, backend assigns real ID
      Front: '',
      Back: '',
      SetID: originalSetDetails.ID,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };
    setCards([...cards, newCard]);
  };

  /**
   * Removes a flashcard from the `cards` state array at the specified index.
   * @param {number} index - The index of the card to remove.
   */
  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  /**
   * Updates the `Front` or `Back` field of a specific card in the `cards` state array.
   * @param {number} index - The index of the card to update.
   * @param {'Front' | 'Back'} field - The specific field (`Front` or `Back`) to update.
   * @param {string | null | undefined} value - The new value from the input event.
   */
  const updateCard = (
    index: number,
    field: 'Front' | 'Back',
    value: string | null | undefined
  ) => {
    const newValue = value ?? '';
    setCards(
      cards.map((card, i) =>
        i === index ? { ...card, [field]: newValue } : card
      )
    );
  };

  // --- Save Logic ---

  /**
   * Orchestrates saving all changes (set details, card adds/updates/deletes) to the backend.
   * 1. Compares edited set details with original and queues PUT requests if changed.
   * 2. Compares original card list with current list and queues DELETE requests for removed cards.
   * 3. Iterates through current cards:
   *    - Queues POST requests for new cards (ID <= 0).
   *    - Compares existing cards (ID > 0) with originals and queues PUT requests if changed.
   * 4. Executes all queued API calls concurrently using `Promise.all`.
   * 5. Provides user feedback (loading state, toasts) and re-fetches data on success.
   * @async
   */
  const handleSaveChanges = async () => {
    if (!originalSetDetails || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    const apiPromises: Promise<any>[] = [];

    // Step 1: Check for Set Detail Updates
    if (editedSetName !== originalSetDetails.SetName) {
      apiPromises.push(
        makeHttpCall(`${API_BASE}/api/flashcards/sets/set_name`, {
          method: 'PUT',
          headers: { id: originalSetDetails.ID, set_name: editedSetName },
        })
      );
    }
    if (editedSetDescription !== originalSetDetails.SetDescription) {
      apiPromises.push(
        makeHttpCall(`${API_BASE}/api/flashcards/sets/set_description`, {
          method: 'PUT',
          headers: {
            id: originalSetDetails.ID,
            set_description: editedSetDescription,
          },
        })
      );
    }

    // Step 2: Check for Card Deletions
    const currentCardIds = new Set(
      cards.map((card) => card.ID).filter((id) => id > 0)
    );
    if (originalCards) {
      originalCards.forEach((originalCard) => {
        if (!currentCardIds.has(originalCard.ID)) {
          apiPromises.push(
            makeHttpCall(`${API_BASE}/api/flashcards`, {
              method: 'DELETE',
              headers: { id: originalCard.ID },
            })
          );
        }
      });
    }
    // Step 3: Check for Card Updates and Creations
    cards.forEach((card) => {
      if (card.ID <= 0) {
        // Case: New Card - Queue POST request
        apiPromises.push(
          makeHttpCall<Flashcard>(`${API_BASE}/api/flashcards`, {
            method: 'POST',
            headers: {
              front: card.Front,
              back: card.Back,
              id: originalSetDetails.ID,
            },
          })
        );
      } else {
        // Case: Existing Card - Check for updates
        const originalCard = originalCards.find((oc) => oc.ID === card.ID);
        if (originalCard) {
          // Subcase: Front updated - Queue PUT request
          if (card.Front !== originalCard.Front) {
            apiPromises.push(
              makeHttpCall(`${API_BASE}/api/flashcards/front`, {
                method: 'PUT',
                headers: { id: card.ID, front: card.Front },
              })
            );
          }
          // Subcase: Back updated - Queue PUT request
          if (card.Back !== originalCard.Back) {
            apiPromises.push(
              makeHttpCall(`${API_BASE}/api/flashcards/back`, {
                method: 'PUT',
                headers: { id: card.ID, back: card.Back },
              })
            );
          }
        }
      }
    });

    // Step 4: Execute all API Calls
    try {
      await Promise.all(apiPromises);
      presentToast({
        message: 'Changes saved successfully!',
        duration: 2000,
        color: 'success',
      });
      await fetchData();
    } catch (err) {
      console.error('Error saving changes:', err);
      let message = 'Unknown error during save';
      if (err instanceof Error) message = err.message;
      setSaveError(`Failed to save changes: ${message}`);
      presentToast({
        message: `Save failed: ${message}`,
        duration: 3000,
        color: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
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
          <IonLoading isOpen={isSaving} message={'Saving changes...'} />

          {error && !loading && (
            <IonText color="danger" className="block mb-4">
              <p>Error loading data: {error}</p>
            </IonText>
          )}
          {saveError && !isSaving && (
            <IonText color="danger" className="block mb-4">
              <p>Error saving: {saveError}</p>
            </IonText>
          )}

          {!loading && !error && originalSetDetails && (
            <>
              {/* Use SetMetadataEditor Component */}
              <SetMetadataEditor
                setName={editedSetName}
                setDescription={editedSetDescription}
                onNameChange={(value) =>
                  handleSetDetailChange('SetName', value)
                }
                onDescriptionChange={(value) =>
                  handleSetDetailChange('SetDescription', value)
                }
              />

              {/* Use FlashcardListEditor Component */}
              <FlashcardListEditor
                cards={cards}
                onAddCard={addCard}
                onRemoveCard={removeCard}
                onUpdateCard={updateCard}
              />

              {/* Save Changes Button remains here */}
              <div className="flex justify-end">
                <IonButton
                  onClick={handleSaveChanges}
                  color="primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
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
