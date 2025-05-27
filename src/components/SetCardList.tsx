import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonSpinner,
  IonText,
  IonTextarea,
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';

const SetCardList = (props) => {
  // Check if we have cards to display
  const hasCards =
    Array.isArray(props.cardsToDisplay) && props.cardsToDisplay.length > 0;

  return (
    <div className="mt-8 min-h-[200px]">
      {props.loading ? (
        <div className="flex items-center justify-center">
          <IonSpinner name="circular" />
        </div>
      ) : !hasCards && !props.isEditing ? (
        <div className="text-center">
          <p className="text-lg text-gray-900 dark:text-gray-400 mb-4">
            This set has no cards.
          </p>
          {props.isOwner && (
            <IonButton
              color="primary"
              className="rounded-lg"
              style={{ '--border-radius': '0.5rem' }}
              onClick={props.onAddCardClick}
            >
              Add Cards
            </IonButton>
          )}
        </div>
      ) : (
        <div className="w-full">
          {props.cardsToDisplay?.map((card, index) =>
            props.isEditing && props.isOwner ? (
              // --- Edit Mode Card --- //
              <IonCard
                key={card.ID <= 0 ? `new-${index}` : card.ID}
                className="mb-4 rounded-lg border shadow-sm p-4"
              >
                <IonItem lines="none">
                  <IonText className="text-md font-semibold text-gray-900 dark:text-gray-300 mr-auto">
                    Card {index + 1}
                  </IonText>
                  <IonButton
                    fill="clear"
                    color="danger"
                    size="small"
                    onClick={() => props.onRemoveCard(index)}
                  >
                    <IonIcon slot="icon-only" icon={trashOutline} />
                  </IonButton>
                </IonItem>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-1">
                    <IonTextarea
                      label="Front"
                      labelPlacement="stacked"
                      value={card.Front}
                      onIonInput={(e) =>
                        props.onCardChange(index, 'Front', e.detail.value)
                      }
                      className={`w-full border rounded-md p-2 ${
                        props.cardErrors[index]?.front
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      autoGrow={true}
                      rows={3}
                    />
                    {props.cardErrors[index]?.front && (
                      <p className="text-red-500 text-xs mt-1">
                        {props.cardErrors[index].front}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <IonTextarea
                      label="Back"
                      labelPlacement="stacked"
                      value={card.Back}
                      onIonInput={(e) =>
                        props.onCardChange(index, 'Back', e.detail.value)
                      }
                      className={`w-full border rounded-md p-2 ${
                        props.cardErrors[index]?.back
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      autoGrow={true}
                      rows={3}
                    />
                    {props.cardErrors[index]?.back && (
                      <p className="text-red-500 text-xs mt-1">
                        {props.cardErrors[index].back}
                      </p>
                    )}
                  </div>
                </div>
              </IonCard>
            ) : (
              // --- Display Mode Card --- //
              <IonCard
                key={card.ID}
                className="mb-4 rounded-lg border shadow-sm"
              >
                <IonCardContent>
                  <div className="border-b border-gray-300 mb-3 pb-1 m-4">
                    <IonText className="text-md font-semibold text-gray-900 dark:text-gray-300">
                      Card {index + 1}
                    </IonText>
                  </div>
                  <div className="flex flex-row justify-between items-start">
                    <div className="w-3/12 pr-4 border-r border-gray-300 m-4">
                      <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                        {card.Front}
                      </IonText>
                    </div>
                    <div className="w-9/12 pl-4 m-4">
                      <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                        {card.Back}
                      </IonText>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            )
          )}
          {props.isEditing && props.isOwner && (
            <IonButton
              expand="block"
              onClick={props.onAddCard}
              className="mt-4 rounded-lg"
            >
              <IonIcon slot="start" icon={addOutline} />
              Add New Card
            </IonButton>
          )}
        </div>
      )}
    </div>
  );
};

export default SetCardList;
