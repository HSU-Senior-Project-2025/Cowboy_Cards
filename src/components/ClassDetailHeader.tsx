import { EditableField } from '@/utils/EditableField';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

const ClassDetailHeader = (props) => {
  return (
    <div className="gap-4 flex-1 sm:pr-4">
      <div className="flex flex-col">
        {props.loading || !props.classData ? (
          <IonSpinner name="dots" />
        ) : props.isEditing && props.isTeacher ? (
          <>
            <EditableField
              type="text"
              label="Class Name"
              name="class_name"
              value={props.updatedInfo.class_name}
              onChange={props.handleChange}
              error={props.formErrors.className}
            />
            <EditableField
              type="text"
              label="Class Description"
              name="class_description"
              value={props.updatedInfo.class_description}
              onChange={props.handleChange}
              error={props.formErrors.classDescription}
            />
            {props.formErrors.general && (
              <p className="text-red-500 text-sm mt-1">
                {props.formErrors.general}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              {props.classData.ClassName || 'Untitled Class'}
            </h1>
            <p className="text-base mt-1 text-gray-700">
              {props.classData.ClassDescription || 'No description available'}
            </p>
            <IonButton
              className="rounded-lg mt-4 max-w-[200px]"
              style={{ '--border-radius': '0.5rem' }}
              routerLink="/home"
              color="primary"
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Back
            </IonButton>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassDetailHeader;
