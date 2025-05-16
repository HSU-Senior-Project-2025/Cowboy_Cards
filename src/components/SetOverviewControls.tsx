import { IonButton } from '@ionic/react';

const SetOverviewControls = (props) => {
  return (
    <>
      <IonButton
        className="rounded-lg flex-grow md:flex-grow-0"
        color={'primary'}
        style={{ '--border-radius': '0.5rem' }}
        routerLink={props.studyLink}
        disabled={props.isEditing}
      >
        Study Set
      </IonButton>
      {props.isOwner && !props.isEditing && (
        <>
          <IonButton
            className="rounded-lg flex-grow md:flex-grow-0"
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.onEditClick}
          >
            Edit Set & Cards
          </IonButton>
          <IonButton
            className="rounded-lg flex-grow md:flex-grow-0"
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
            className="rounded-lg flex-grow md:flex-grow-0"
            color="primary"
            size="small"
            onClick={props.onSaveClick}
          >
            Save All Changes
          </IonButton>
          <IonButton
            className="rounded-lg flex-grow md:flex-grow-0"
            color="medium"
            size="small"
            onClick={props.onCancelClick}
          >
            Cancel
          </IonButton>
        </>
      )}
    </>
  );
};

export default SetOverviewControls;
