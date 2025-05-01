import { EditableField } from '@/utils/EditableField';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBackOutline, createOutline } from 'ionicons/icons';

const ClassDetailHeader = (props) => {
  return (
    <>
      {props.isEditing ? (
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
          <div className="mt-4 flex justify-end space-x-2">
            <IonButton onClick={props.handleSave} color="primary" size="small">
              Save
            </IonButton>
            <IonButton onClick={props.handleCancel} color="medium" size="small">
              Cancel
            </IonButton>
          </div>
        </>
      ) : props.loading ? (
        <div>Loading...</div>
      ) : props.classData ? (
        <>
          <div className="flex flex-col">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">
                {props.loading ? 'Loading...' : props.classData.ClassName}
              </h1>
              {props.isTeacher && !props.isEditing && (
                <IonIcon
                  icon={createOutline}
                  size="large"
                  color="primary"
                  className="hover:transform hover:scale-110 cursor-pointer p-2"
                  onClick={props.handleEdit}
                ></IonIcon>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {props.loading ? 'Loading...' : props.classData.ClassDescription}
            </p>
            <IonButton
              className="rounded-lg flex-grow md:flex-grow-0 mt-4"
              style={{ '--border-radius': '0.5rem' }}
              routerLink="/home"
              color="primary"
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Back
            </IonButton>
          </div>
        </>
      ) : (
        <h1>Class details unavailable</h1>
      )}
    </>
  );
};

export default ClassDetailHeader;
