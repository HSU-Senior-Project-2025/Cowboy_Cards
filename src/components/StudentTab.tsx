/**
 * @file StudentTab.tsx
 * Purpose: Defines the content component for the 'Students' tab in ClassDetail.
 * This component receives student data and user role, rendering the StudentList.
 * It now also manages the confirmation alert for student deletion.
 */

import React, { useState } from 'react';
import StudentList from '@/components/StudentList'; // Assuming StudentList component path
import { IonAlert } from '@ionic/react'; // Import IonAlert

// TODO: Move this type to a shared types file (e.g., src/types/index.ts)
//       to avoid duplication and maintain consistency across the application.
type ClassUser = {
  UserID: number;
  ClassID: number; // Might be useful context, keep for now
  Role: string;
  FirstName: string;
  LastName: string;
};

/**
 * Props for the StudentTab component.
 */
interface StudentTabProps {
  /** Flag indicating if the current user is a teacher. */
  isTeacher: boolean;
  /** Array of student data (ClassUser objects). */
  students: ClassUser[];
  /** Callback function to execute the actual student deletion logic. Takes student ID. */
  handleActualDelete: (studentId: number) => void; // Renamed from onDeleteStudent
}

/**
 * StudentTab Component
 *
 * Renders the content for the Students tab. Displays the list of students
 * using the `StudentList` component and passes down necessary props for
 * display and interaction (like deletion confirmation).
 * This component isolates the presentation logic for the students tab, including the delete confirmation flow.
 *
 * @param {StudentTabProps} props - Component properties.
 * @returns {JSX.Element} The rendered student list content and alert.
 *
 * @example
 * ```tsx
 * <StudentTab
 *   isTeacher={isCurrentUserTeacher}
 *   students={classStudentsData}
 *   onDeleteStudent={handleShowDeleteAlert} // OLD example, prop is now handleActualDelete
 *   handleActualDelete={handleDeleteStudentLogic} // NEW example
 * />
 * ```
 */
const StudentTab: React.FC<StudentTabProps> = ({
  isTeacher,
  students,
  handleActualDelete, // Use the new prop name
}) => {
  // State to manage the delete confirmation alert
  const [showDeleteAlert, setShowDeleteAlert] = useState<{
    isOpen: boolean;
    studentId: number | null; // Store the ID of the student to delete
  }>({
    isOpen: false,
    studentId: null,
  });

  // Function to show the delete confirmation alert
  // This will be passed to the StudentList component
  const handleShowDeleteAlert = (studentId: number) => {
    setShowDeleteAlert({ isOpen: true, studentId: studentId });
  };

  return (
    <>
      {/* The wrapping div is maintained here as it was in ClassDetail.tsx */}
      <div className="flex flex-col">
        <StudentList
          isTeacher={isTeacher}
          students={students}
          onDeleteStudent={handleShowDeleteAlert} // Pass the local alert trigger function
        />
      </div>

      {/* Student Deletion Confirmation Alert - Moved from ClassDetail.tsx */}
      <IonAlert
        isOpen={showDeleteAlert.isOpen}
        onDidDismiss={
          () => setShowDeleteAlert({ isOpen: false, studentId: null }) // Reset state on dismiss
        }
        header="Confirm Deletion"
        message="Are you sure you want to remove this student from the class? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              // State is reset by onDidDismiss
            },
          },
          {
            text: 'Delete',
            handler: () => {
              // Call the actual delete function passed from the parent
              if (showDeleteAlert.studentId !== null) {
                handleActualDelete(showDeleteAlert.studentId);
                console.log(
                  `Student deletion initiated for ID: ${showDeleteAlert.studentId}`
                );
              }
              // State is reset by onDidDismiss
            },
          },
        ]}
      />
    </>
  );
};

export default StudentTab;
