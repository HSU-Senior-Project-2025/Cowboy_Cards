import { IonButton } from '@ionic/react';

const SetOverviewControls = (props) => {
  const hasCards =
    Array.isArray(props.cardsToDisplay) && props.cardsToDisplay.length > 0;

  return (
    <div className="flex flex-col items-center sm:items-end justify-end mt-4">
      {hasCards && (
        <IonButton
          className="rounded-lg sm:ml-0 w-full sm:w-auto max-w-80"
          color={'primary'}
          style={{ '--border-radius': '0.5rem' }}
          routerLink={props.studyLink}
          disabled={props.isEditing}
        >
          Study Set
        </IonButton>
      )}
      {props.isOwner && !props.isEditing && (
        <>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.onEditClick}
          >
            Edit Set & Cards
          </IonButton>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            color={'danger'}
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.onDeleteClick}
          >
            Delete Set
          </IonButton>
        </>
      )}
      {props.isOwner && props.isEditing && (
        <>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            color="primary"
            size="small"
            onClick={props.onSaveClick}
          >
            Save All Changes
          </IonButton>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            color="medium"
            size="small"
            onClick={props.onCancelClick}
          >
            Cancel
          </IonButton>
        </>
      )}
    </div>
  );
};

export default SetOverviewControls;
