import { EditableField } from '@/utils/EditableField';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';

const SetOverviewHeader = (props) => {
  return (
    <div className="gap-4 flex-1 sm:pr-4">
      <div className="flex flex-col">
        {props.loading || !props.flashcardSetData ? (
          <IonSpinner name="dots" />
        ) : props.isEditing && props.isOwner ? (
          <>
            <EditableField
              type="text"
              label="Set Name"
              name="set_name"
              value={props.updatedInfo.set_name}
              onChange={props.onMetadataChange}
              error={props.metadataErrors.setName}
            />
            <EditableField
              type="text"
              label="Set Description"
              name="set_description"
              value={props.updatedInfo.set_description}
              onChange={props.onMetadataChange}
              error={props.metadataErrors.setDescription}
            />
            {props.metadataErrors.general && (
              <p className="text-red-500 text-sm mt-1">
                {props.metadataErrors.general}
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              {props.flashcardSetData.SetName || 'Untitled Set'}
            </h1>
            <p className="text-base mt-1 text-gray-700 dark:text-gray-400">
              {props.flashcardSetData.SetDescription ||
                'No description available'}
            </p>
            <IonButton
              className="rounded-lg mt-4 max-w-[200px]"
              style={{ '--border-radius': '0.5rem' }}
              onClick={props.onBackClick}
              disabled={props.isEditing}
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

export default SetOverviewHeader;
