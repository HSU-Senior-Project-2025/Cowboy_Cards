import { IonButton } from '@ionic/react';

const SetOverviewControls = (props) => {
  return (
    <div className='flex flex-col sm:flex-row items-end justify-end mt-4'>
      <IonButton
        className='rounded-lg sm:ml-0 w-full sm:w-auto'
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
            className='rounded-lg mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto'
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.onEditClick}
          >
            Edit Set & Cards
          </IonButton>
          <IonButton
            className='rounded-lg mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto'
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
            className='rounded-lg mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto'
            color='primary'
            size='small'
            onClick={props.onSaveClick}
          >
            Save All Changes
          </IonButton>
          <IonButton
            className='rounded-lg mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto'
            color='medium'
            size='small'
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
