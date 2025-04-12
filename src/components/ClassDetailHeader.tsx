/**
 * @file ClassDetailHeader.tsx
 * Purpose: Defines the header component for the Class Detail page.
 * This component is responsible for displaying the class name, description,
 * and handling the editing functionality for these fields. It contains both
 * the display view (when not editing) and the editing form (when editing).
 */

import React from 'react';
import {
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import { pencil } from 'ionicons/icons';
import { EditableField } from '@/utils/EditableField';

// Define the structure for Class data, mirroring the one in ClassDetail.tsx
// TODO: Consider moving this type to a shared types file (e.g., src/types/index.ts)
//       to avoid duplication and maintain consistency.
type Class = {
  ID: number;
  ClassName: string;
  ClassDescription: string;
  JoinCode?: string; // Optional as it might not always be present/needed here
  CreatedAt: string; // Keep for potential future use
  UpdatedAt: string; // Keep for potential future use
  Role: string; // Keep for potential future use (though isTeacher prop is derived from this)
};

/**
 * Props for the ClassDetailHeader component.
 */
interface ClassDetailHeaderProps {
  /** The class data object containing name, description, etc. Optional during loading. */
  classData?: Class;
  /** Flag indicating if the current user is a teacher for this class. */
  isTeacher: boolean;
  /** Flag indicating if the class data is currently being loaded. */
  loading: boolean;
  /** Callback function to trigger the editing mode. */
  handleEdit: () => void;
  /** Flag indicating if the header is currently in editing mode. */
  isEditing: boolean;
  /** State object containing the updated class name and description during editing. */
  updatedInfo: { class_name: string; class_description: string };
  /** State object containing validation errors for the editing form. */
  errors: { className?: string; classDescription?: string; general?: string };
  /** Callback function to handle changes in the input fields during editing. */
  handleChange: (e: CustomEvent) => void;
  /** Callback function to save the edited class information. */
  handleSave: () => void;
  /** Callback function to cancel the editing mode. */
  handleCancel: () => void;
}

/**
 * ClassDetailHeader Component
 *
 * Renders the header section of the Class Detail page.
 * It displays the class name and description, or an editing form if `isEditing` is true.
 * Shows skeleton loaders while data is loading (only in display mode).
 * Provides controls for saving or canceling edits.
 *
 * @param {ClassDetailHeaderProps} props - Component properties.
 * @returns {JSX.Element} The rendered header component.
 */
const ClassDetailHeader: React.FC<ClassDetailHeaderProps> = ({
  classData,
  isTeacher,
  loading,
  handleEdit,
  isEditing,
  updatedInfo,
  errors,
  handleChange,
  handleSave,
  handleCancel,
}) => {
  return (
    <IonCardHeader>
      {isEditing ? (
        // Editing Mode Form
        <>
          <EditableField
            label="Class Name"
            name="class_name"
            value={updatedInfo.class_name}
            onChange={handleChange}
            error={errors.className}
          />
          <EditableField
            label="Class Description"
            name="class_description"
            value={updatedInfo.class_description}
            onChange={handleChange}
            error={errors.classDescription}
          />
          {errors.general && (
            <p className="text-red-500 text-sm mt-1">{errors.general}</p>
          )}
          {/* Save and Cancel Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <IonButton onClick={handleSave} color="primary" size="small">
              Save
            </IonButton>
            <IonButton onClick={handleCancel} color="medium" size="small">
              Cancel
            </IonButton>
          </div>
        </>
      ) : loading ? (
        // Loading State (Display Mode)
        <>
          <IonCardTitle>
            <IonSkeletonText animated style={{ width: '60%' }} />
          </IonCardTitle>
          <IonCardSubtitle>
            <IonSkeletonText animated style={{ width: '80%' }} />
          </IonCardSubtitle>
        </>
      ) : classData ? (
        // Display Mode (Data Loaded)
        <>
          <div className="flex items-center">
            {' '}
            {/* Flex container for title and icon */}
            <IonCardTitle>{classData.ClassName}</IonCardTitle>
            {isTeacher && !isEditing && (
              <IonIcon
                icon={pencil}
                onClick={handleEdit}
                className="ml-2 cursor-pointer text-lg text-blue-500 hover:text-blue-700"
                aria-label="Edit Class Name and Description"
              />
            )}
          </div>
          <IonCardSubtitle>{classData.ClassDescription}</IonCardSubtitle>
        </>
      ) : (
        // Fallback if not loading and no data (Display Mode)
        <IonCardTitle>Class details unavailable</IonCardTitle>
      )}
    </IonCardHeader>
  );
};

export default ClassDetailHeader;
