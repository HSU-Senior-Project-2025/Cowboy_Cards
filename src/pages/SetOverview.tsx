import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import SetCardList from '@/components/SetCardList';
import SetOverviewControls from '@/components/SetOverviewControls';
import SetOverviewHeader from '@/components/SetOverviewHeader';
import {
  useAddCard,
  useDeleteCard,
  useDeleteSet,
  useSetCards,
  useSetDetails,
  useUpdateCard,
  useUpdateSet,
} from '@/hooks/useSetQueries';
import type { Flashcard } from '@/types/globalTypes';
import {
  IonAlert,
  IonContent,
  IonPage,
  IonSpinner,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

const SetOverview = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  const location = useLocation<{ fromClassId?: string }>();
  const fromClassId = location.state?.fromClassId;

  // React Query hooks
  const {
    data: flashcardSetData,
    isLoading: isLoadingSet,
    error: setError,
  } = useSetDetails(id);

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    error: cardsError,
  } = useSetCards(id);

  // Mutations
  const updateSetMutation = useUpdateSet();
  const updateCardMutation = useUpdateCard();
  const addCardMutation = useAddCard();
  const deleteCardMutation = useDeleteCard();
  const deleteSetMutation = useDeleteSet();

  // UI state
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCards, setEditedCards] = useState<Flashcard[]>([]);
  const [updatedInfo, setUpdatedInfo] = useState({
    set_name: '',
    set_description: '',
  });
  const [metadataErrors, setMetadataErrors] = useState<{
    setName?: string;
    setDescription?: string;
    general?: string;
  }>({});
  const [cardErrors, setCardErrors] = useState<{
    [key: number]: { front?: string; back?: string };
  }>({});

  // Check if user is the owner of the set
  const isOwner = flashcardSetData?.Role === 'owner';

  // Loading state derived from React Query
  const isLoading = isLoadingSet || isLoadingCards;

  // Error handling
  const error = setError || cardsError;
  if (error) {
    console.error('Query error:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    presentToast({
      message: `Error loading data: ${message}`,
      duration: 3000,
      color: 'danger',
    });
  }

  const handleEdit = () => {
    if (!flashcardSetData) return;
    setUpdatedInfo({
      set_name: flashcardSetData.SetName || '',
      set_description: flashcardSetData.SetDescription || '',
    });
    setEditedCards(cards?.map((card) => ({ ...card })));
    setIsEditing(true);
    setMetadataErrors({});
    setCardErrors({});
  };

  const handleMetadataChange = (e: CustomEvent) => {
    const { name } = e.target as HTMLInputElement;
    const value = e.detail.value ?? '';
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardChange = (
    index: number,
    field: 'Front' | 'Back',
    value: string | null | undefined
  ) => {
    const newValue = value ?? '';
    setEditedCards((prevCards) =>
      prevCards?.map((card, i) =>
        i === index ? { ...card, [field]: newValue } : card
      )
    );
  };

  const handleAddCard = () => {
    if (!flashcardSetData) return;
    const newCard: Flashcard = {
      ID: 0 - (editedCards || []).filter((c) => c.ID <= 0).length - 1,
      Front: '',
      Back: '',
      SetID: flashcardSetData.ID,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };
    setEditedCards((prevCards) => [...(prevCards || []), newCard]);
  };

  const handleRemoveCard = (index: number) => {
    setEditedCards((prevCards) => prevCards.filter((_, i) => i !== index));
  };

  const validateMetadata = () => {
    const newErrors: { setName?: string; setDescription?: string } = {};
    let isValid = true;

    const trimmedName = updatedInfo.set_name.trim();
    const trimmedDescription = updatedInfo.set_description.trim();

    if (!trimmedName) {
      newErrors.setName = 'Set name is required';
      isValid = false;
    }
    if (!trimmedDescription) {
      newErrors.setDescription = 'Set description is required';
      isValid = false;
    }

    setMetadataErrors(newErrors);
    setUpdatedInfo({
      set_name: trimmedName,
      set_description: trimmedDescription,
    });
    return isValid;
  };

  const validateCards = () => {
    const newCardErrors: { [key: number]: { front?: string; back?: string } } =
      {};
    let isValid = true;
    editedCards.forEach((card, index) => {
      const errors: { front?: string; back?: string } = {};
      const trimmedFront = card.Front.trim();
      const trimmedBack = card.Back.trim();

      if (!trimmedFront) {
        errors.front = 'Front cannot be empty';
        isValid = false;
      }
      if (!trimmedBack) {
        errors.back = 'Back cannot be empty';
        isValid = false;
      }
      if (Object.keys(errors).length > 0) {
        newCardErrors[index] = errors;
      }
      if (trimmedFront !== card.Front || trimmedBack !== card.Back) {
        setEditedCards((prev) =>
          prev?.map((c, i) =>
            i === index ? { ...c, Front: trimmedFront, Back: trimmedBack } : c
          )
        );
      }
    });
    setCardErrors(newCardErrors);
    return isValid;
  };

  const handleSave = async () => {
    const isMetadataValid = validateMetadata();
    const areCardsValid = validateCards();

    if (!isMetadataValid || !areCardsValid || !flashcardSetData) {
      console.log('Form validation failed:', metadataErrors, cardErrors);
      presentToast({
        message: 'Please fix validation errors before saving.',
        duration: 3000,
        color: 'warning',
      });
      return;
    }

    try {
      // Update set metadata if changed
      if (updatedInfo.set_name !== (flashcardSetData.SetName || '').trim()) {
        await updateSetMutation.mutateAsync({
          id: id,
          field: 'set_name',
          value: updatedInfo.set_name,
        });
      }

      if (
        updatedInfo.set_description !==
        (flashcardSetData.SetDescription || '').trim()
      ) {
        await updateSetMutation.mutateAsync({
          id: id,
          field: 'set_description',
          value: updatedInfo.set_description,
        });
      }

      // Process card changes
      const originalCardMap = new Map(
        (cards || []).map((card) => [card.ID, card])
      );

      // Delete removed cards
      for (const originalCard of cards || []) {
        if (
          !editedCards.some((c) => c.ID === originalCard.ID) &&
          originalCard.ID > 0
        ) {
          await deleteCardMutation.mutateAsync(originalCard.ID);
        }
      }

      // Add/update cards
      for (const editedCard of editedCards) {
        if (editedCard.ID <= 0) {
          // New card
          await addCardMutation.mutateAsync({
            setId: flashcardSetData.ID,
            front: editedCard.Front,
            back: editedCard.Back,
          });
        } else {
          // Existing card
          const originalCard = originalCardMap.get(editedCard.ID);
          if (originalCard) {
            // Update front if changed
            if (editedCard.Front !== (originalCard.Front || '').trim()) {
              await updateCardMutation.mutateAsync({
                id: editedCard.ID,
                field: 'front',
                value: editedCard.Front,
              });
            }

            // Update back if changed
            if (editedCard.Back !== (originalCard.Back || '').trim()) {
              await updateCardMutation.mutateAsync({
                id: editedCard.ID,
                field: 'back',
                value: editedCard.Back,
              });
            }
          }
        }
      }

      presentToast({
        message: 'Set details and cards updated successfully!',
        duration: 2000,
        color: 'success',
      });

      setIsEditing(false);
      setMetadataErrors({});
      setCardErrors({});
    } catch (error) {
      console.error('Failed to update set:', error);
      let message = 'Unknown error during save';
      if (error instanceof Error) message = error.message;
      setMetadataErrors((prev) => ({
        ...prev,
        general: `Failed to save: ${message}`,
      }));
      presentToast({
        message: `Failed to save changes: ${message}`,
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMetadataErrors({});
    setCardErrors({});
  };

  const handleDeleteSet = async () => {
    if (!id) {
      console.error('Cannot delete set: ID is missing.');
      presentToast({
        message: 'Cannot delete: Set ID missing.',
        duration: 3000,
        color: 'danger',
      });
      return;
    }

    try {
      await deleteSetMutation.mutateAsync(id);
      presentToast({
        message: 'Set deleted successfully.',
        duration: 2000,
        color: 'success',
      });
      history.push('/student-dashboard');
    } catch (error) {
      console.error('Failed to delete set:', error);
      let message = 'Unknown error during deletion';
      if (error instanceof Error) message = error.message;
      presentToast({
        message: `Failed to delete set: ${message}`,
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const handleBackClick = () => {
    if (!isEditing) {
      if (fromClassId) {
        history.push(`/class/${fromClassId}`);
      } else {
        history.push('/home');
      }
    }
  };

  const cardsToDisplay = isEditing ? editedCards : cards;

  if (isLoading && !isEditing) {
    return (
      <IonPage>
        <IonContent className=''>
          <Navbar />
          <div className='flex items-center justify-center h-64'>
            <IonSpinner name='circular' />
          </div>
        </IonContent>
        <Footer />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div className='container max-w-4xl mx-auto px-4 py-8'>
          <div className='flex flex-col md:flex-row justify-between items-start gap-4 mb-6'>
            <SetOverviewHeader
              loading={isLoading}
              flashcardSetData={flashcardSetData}
              isEditing={isEditing}
              isOwner={isOwner}
              updatedInfo={updatedInfo}
              metadataErrors={metadataErrors}
              onMetadataChange={handleMetadataChange}
              onBackClick={handleBackClick}
            />

            <SetOverviewControls
              isOwner={isOwner}
              isEditing={isEditing}
              onBackClick={handleBackClick}
              onEditClick={handleEdit}
              onSaveClick={handleSave}
              onCancelClick={handleCancel}
              onDeleteClick={() => setShowDeleteAlert(true)}
              studyLink={`/flashcards/${id}`}
            />
          </div>

          <SetCardList
            loading={isLoading}
            cardsToDisplay={cardsToDisplay}
            isEditing={isEditing}
            isOwner={isOwner}
            cardErrors={cardErrors}
            onCardChange={handleCardChange}
            onAddCard={handleAddCard}
            onRemoveCard={handleRemoveCard}
            onAddCardClick={handleEdit}
          />
        </div>

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
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: handleDeleteSet,
            },
          ]}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default SetOverview;
