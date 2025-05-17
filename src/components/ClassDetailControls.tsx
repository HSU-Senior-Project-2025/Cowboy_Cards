import { IonButton, IonIcon } from '@ionic/react';
import { addOutline, createOutline } from 'ionicons/icons';

const ClassDetailControls = (props) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {props.isTeacher && !props.isEditing && (
        <div className="gap-2 mt-8">
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
        </div>
      )}
    </div>
  );
};

export default ClassDetailControls;
