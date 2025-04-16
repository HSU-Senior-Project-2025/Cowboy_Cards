/**
 * @file src/components/edit-set/SetMetadataEditor.tsx
 * Purpose: Component for editing the metadata (name and description) of a flashcard set.
 */
import React from 'react';
import { IonCard, IonCardContent, IonTextarea } from '@ionic/react';

/**
 * Props for the SetMetadataEditor component.
 */
interface SetMetadataEditorProps {
  /** Current value for the set name. */
  setName: string;
  /** Current value for the set description. */
  setDescription: string;
  /** Callback function when the set name changes. */
  onNameChange: (value: string | null | undefined) => void;
  /** Callback function when the set description changes. */
  onDescriptionChange: (value: string | null | undefined) => void;
}

/**
 * SetMetadataEditor Component
 *
 * Renders input fields (IonTextarea) for editing the name and description
 * of a flashcard set.
 *
 * @param {SetMetadataEditorProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const SetMetadataEditor: React.FC<SetMetadataEditorProps> = ({
  setName,
  setDescription,
  onNameChange,
  onDescriptionChange,
}) => {
  return (
    <IonCard className="mb-6 rounded-lg border shadow-sm">
      <IonCardContent>
        <IonTextarea
          label="Set Title"
          labelPlacement="stacked"
          placeholder="Enter set title"
          value={setName}
          onIonChange={(e) => onNameChange(e.detail.value)}
          rows={1}
          autoGrow
          className="w-full text-xl font-bold mb-2"
          style={{ resize: 'none' }}
        />
        {/* TODO: Add validation error display if needed */}

        <IonTextarea
          label="Set Description"
          labelPlacement="stacked"
          placeholder="Enter set description"
          value={setDescription}
          onIonChange={(e) => onDescriptionChange(e.detail.value)}
          rows={2} // Allow a bit more space for description
          autoGrow
          className="w-full text-base mt-4"
          style={{ resize: 'none' }}
        />
        {/* TODO: Add validation error display if needed */}
      </IonCardContent>
    </IonCard>
  );
};

export default SetMetadataEditor;
