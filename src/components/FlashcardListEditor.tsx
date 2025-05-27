import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonTextarea,
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';

const FlashcardListEditor = (props) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Edit Cards</h2>
      {props.cards?.map((card, index) => (
        <IonCard key={card.ID} className="mb-4 rounded-lg border shadow-sm">
          <IonCardContent>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Card {index + 1} {card.ID > 0 ? '(Existing)' : '(New)'}
              </span>
              <IonButton
                fill="clear"
                color="danger"
                size="small"
                onClick={() => props.onRemoveCard(index)}
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
              onIonChange={(e) =>
                props.onUpdateCard(index, 'Front', e.detail.value)
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
              onIonChange={(e) =>
                props.onUpdateCard(index, 'Back', e.detail.value)
              }
              rows={2}
              autoGrow
              style={{ resize: 'none' }}
            />
          </IonCardContent>
        </IonCard>
      ))}

      <div className="flex justify-center mt-4 mb-6">
        <IonButton onClick={props.onAddCard}>
          <IonIcon slot="start" icon={addOutline} /> Add Card
        </IonButton>
      </div>
    </>
  );
};

export default FlashcardListEditor;
