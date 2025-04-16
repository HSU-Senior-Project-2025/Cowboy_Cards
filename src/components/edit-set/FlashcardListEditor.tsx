/**
 * @file src/components/edit-set/FlashcardListEditor.tsx
 * Purpose: Component for managing the list of flashcards being edited within a set.
 */
import React from 'react';
import { Flashcard } from '@/types/flashcards';
import {
  IonCard,
  IonCardContent,
  IonTextarea,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';

/**
 * Props for the FlashcardListEditor component.
 */
interface FlashcardListEditorProps {
  /** The current array of flashcards being edited. */
  cards: Flashcard[];
  /** Callback function to add a new empty card. */
  onAddCard: () => void;
  /** Callback function to remove a card at a specific index. */
  onRemoveCard: (index: number) => void;
  /** Callback function to update a card's field at a specific index. */
  onUpdateCard: (
    index: number,
    field: 'Front' | 'Back',
    value: string | null | undefined
  ) => void;
}

/**
 * FlashcardListEditor Component
 *
 * Renders a list of editable flashcards, each within an IonCard.
 * Provides inputs for Front and Back content, a delete button for each card,
 * and an "Add Card" button for the entire list.
 *
 * @param {FlashcardListEditorProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const FlashcardListEditor: React.FC<FlashcardListEditorProps> = ({
  cards,
  onAddCard,
  onRemoveCard,
  onUpdateCard,
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Edit Cards</h2>
      {cards.map((card, index) => (
        <IonCard
          key={card.ID} // Use card ID as key (or 0 for new cards)
          className="mb-4 rounded-lg border shadow-sm"
        >
          <IonCardContent>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Card {index + 1} {card.ID > 0 ? '(Existing)' : '(New)'}
              </span>
              <IonButton
                fill="clear"
                color="danger"
                size="small"
                onClick={() => onRemoveCard(index)} // Use prop function
                className="-mt-2 -mr-2"
              >
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </div>
            <IonTextarea
              label={`Front (Card ${index + 1})`}
              labelPlacement="stacked"
              placeholder="Front of card"
              value={card.Front}
              onIonChange={
                (e) => onUpdateCard(index, 'Front', e.detail.value) // Use prop function
              }
              rows={2}
              autoGrow
              className="mb-3"
              style={{ resize: 'none' }}
            />
            <IonTextarea
              label={`Back (Card ${index + 1})`}
              labelPlacement="stacked"
              placeholder="Back of card"
              value={card.Back}
              onIonChange={
                (e) => onUpdateCard(index, 'Back', e.detail.value) // Use prop function
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
        <IonButton onClick={onAddCard} fill="outline">
          {' '}
          {/* Use prop function */}
          <IonIcon slot="start" icon={addOutline} /> Add Card
        </IonButton>
      </div>
    </>
  );
};

export default FlashcardListEditor;
