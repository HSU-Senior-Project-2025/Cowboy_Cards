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

const StudentList = (props) => {
  return (
    <IonCard className="mt-6">
      <IonCardHeader>
        <IonCardTitle className="text-xl font-semibold">
          Class Students
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList className="space-y-3" lines="none">
          {props.students?.map((student) => (
            <IonItem key={student.UserID} className="muted-item py-3">
              <span className="font-medium">{student.Username}</span>
              {props.isTeacher && (
                <IonIcon
                  slot="end"
                  icon={trashOutline}
                  color="danger"
                  className="cursor-pointer"
                  onClick={() => props.onDeleteStudent(student.UserID)}
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
