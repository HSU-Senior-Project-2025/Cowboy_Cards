import { useState } from 'react';
import StudentList from '@/components/StudentList';
import { IonAlert } from '@ionic/react';

const StudentTab = (props) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState({
    isOpen: false,
    studentId: null,
  });

  const handleShowDeleteAlert = (studentId: number) => {
    setShowDeleteAlert({ isOpen: true, studentId: studentId });
  };

  return (
    <>
      <div className="flex flex-col">
        <StudentList
          isTeacher={props.isTeacher}
          students={props.students}
          onDeleteStudent={handleShowDeleteAlert}
        />
      </div>

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
            },
          },
          {
            text: 'Delete',
            handler: () => {
              if (showDeleteAlert.studentId !== null) {
                props.handleActualDelete(showDeleteAlert.studentId);
                console.log(
                  `Student deletion initiated for ID: ${showDeleteAlert.studentId}`
                );
              }
            },
          },
        ]}
      />
    </>
  );
};

export default StudentTab;
