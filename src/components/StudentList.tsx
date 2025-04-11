import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/react';

import { trashOutline } from 'ionicons/icons';

const StudentList = ({ students, isTeacher, onDeleteStudent }) => {
  return (
    <IonCard className="mt-6">
      <IonCardHeader>
        <IonCardTitle className="text-xl font-semibold">
          Class Students
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList className="space-y-3" lines="none">
          {students.map((student) => (
            <IonItem key={student.UserID} className="muted-item p-3">
              <span className="font-medium">{student.FirstName} {student.LastName}</span>
              <span slot="end" className="text-muted-foreground">
                {student.email}
              </span>
              {isTeacher && (
                <IonIcon
                  slot="end"
                  icon={trashOutline}
                  color="danger"
                  className="cursor-pointer"
                  onClick={() => onDeleteStudent(student.UserID)}
                />
              )}
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default StudentList;
