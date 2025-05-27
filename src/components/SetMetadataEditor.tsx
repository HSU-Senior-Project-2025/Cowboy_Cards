import { IonCard, IonCardContent, IonTextarea } from '@ionic/react';

const SetMetadataEditor = (props) => {
  return (
    <IonCard className="mb-6 rounded-lg border shadow-sm">
      <IonCardContent>
        <IonTextarea
          label="Set Title"
          labelPlacement="stacked"
          placeholder="Enter set title"
          value={props.setName}
          onIonChange={(e) => props.onNameChange(e.detail.value)}
          rows={1}
          autoGrow
          className="w-full text-xl font-bold mb-2"
          style={{ resize: 'none' }}
        />

        <IonTextarea
          label="Set Description"
          labelPlacement="stacked"
          placeholder="Enter set description"
          value={props.setDescription}
          onIonChange={(e) => props.onDescriptionChange(e.detail.value)}
          rows={2}
          autoGrow
          className="w-full text-base mt-4"
          style={{ resize: 'none' }}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default SetMetadataEditor;
