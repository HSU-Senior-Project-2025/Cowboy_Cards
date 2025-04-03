import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/react';

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
          {props.students.map((student) => (
            <IonItem key={student.id} className="muted-item p-3">
              <span className="font-medium">{student.name}</span>
              <span slot="end" className="text-muted-foreground">
                {student.email}
              </span>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default StudentList;
