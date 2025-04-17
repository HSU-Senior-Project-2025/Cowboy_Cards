/**
 * @file ClassDetailControls.tsx
 * Purpose: Defines the control buttons component for the Class Detail page.
 * This component will house actions like navigating back or creating related items (e.g., flashcard sets).
 */

import React from 'react';
import { IonButton, IonIcon, IonCardContent } from '@ionic/react';
import { arrowBackOutline, createOutline, addOutline } from 'ionicons/icons';

/**
 * Props for the ClassDetailControls component.
 * Props will be added in subsequent steps as needed (e.g., isTeacher, handlers).
 */
interface ClassDetailControlsProps {
  /** Flag indicating if the current user is a teacher. */
  isTeacher: boolean;
  /** The ID of the current class, needed for the create set link. */
  classId: string | undefined;
  /** Callback function to open the Add Set dialog. */
  onAddSetClick: () => void;
}

/**
 * ClassDetailControls Component
 *
 * Renders the main control buttons for the Class Detail page, such as the
 * 'Back' button and conditional buttons like 'Create Flashcard Set'.
 * The actual buttons and logic will be moved here from ClassDetail.tsx in Step 7.
 *
 * @param {ClassDetailControlsProps} props - Component properties.
 * @returns {JSX.Element} The rendered control buttons component.
 */
const ClassDetailControls: React.FC<ClassDetailControlsProps> = ({
  isTeacher,
  classId,
  onAddSetClick,
}) => {
  // Render the Back button and, conditionally, the Create Set button.
  // Using IonCardContent for consistent padding/margin with other sections.
  return (
    <IonCardContent>
      {' '}
      {/* Wrapper for padding */}
      <div className="flex justify-between items-center mb-4">
        {' '}
        {/* Flex container for alignment */}
        {/* Back Button */}
        <IonButton onClick={() => window.history.back()} fill="outline">
          <IonIcon slot="start" icon={arrowBackOutline} />
          Back
        </IonButton>
        {/* Create Set Button (Only for Teachers) */}
        {isTeacher && (
          <div className="flex gap-2">
            {/* Add Existing Set Button */}
            <IonButton
              onClick={onAddSetClick}
              color="secondary"
              disabled={!classId} // Disable if classId isn't available yet
            >
              <IonIcon slot="start" icon={addOutline} />
              Add Existing Set
            </IonButton>

            {/* Create New Set Button */}
            {/* TODO: Confirm create-set route and query param handling */}
            <IonButton
              routerLink={`/create-set?classId=${classId}`}
              color="primary"
              disabled={!classId} // Disable if classId isn't available yet
            >
              <IonIcon slot="start" icon={createOutline} />
              Create New Set
            </IonButton>
          </div>
        )}
      </div>
    </IonCardContent>
  );
};

export default ClassDetailControls;
