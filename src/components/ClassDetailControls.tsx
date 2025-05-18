import { IonButton, IonIcon } from '@ionic/react';
import { addOutline, createOutline } from 'ionicons/icons';

const ClassDetailControls = (props) => {
  return (
    <div className="flex flex-col items-center sm:items-end justify-end mt-4">
      {props.isTeacher && !props.isEditing && (
        <>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.handleEdit}
          >
            Edit Class
          </IonButton>
          <IonButton
            className="rounded-lg sm:ml-0 w-full sm:w-auto max-w-80"
            style={{ '--border-radius': '0.5rem' }}
            onClick={props.onAddSetClick}
            color="primary"
            disabled={!props.classId}
          >
            <IonIcon slot="start" icon={addOutline} />
            Add Existing Set
          </IonButton>
          <IonButton
            className="rounded-lg sm:ml-0 w-full sm:w-auto max-w-80"
            style={{ '--border-radius': '0.5rem' }}
            routerLink={`/create-set?classId=${props.classId}`}
            color="primary"
            disabled={!props.classId}
          >
            <IonIcon slot="start" icon={createOutline} />
            Create New Set
          </IonButton>
        </>
      )}
      {props.isTeacher && props.isEditing && (
        <>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            color="primary"
            size="small"
            onClick={props.handleSave}
          >
            Save All Changes
          </IonButton>
          <IonButton
            className="rounded-lg mt-2 sm:mt-2 sm:ml-2 w-full sm:w-auto max-w-80"
            color="medium"
            size="small"
            onClick={props.handleCancel}
          >
            Cancel
          </IonButton>
        </>
      )}
    </div>
  );
};

export default ClassDetailControls;
