import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/react';

const Leaderboard = (props) => {
  return (
    <IonCard className="rounded-lg border shadow-sm">
      <IonCardHeader>
        <IonCardTitle className="text-xl font-semibold">
          Class Leaderboard
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList className="space-y-3" lines="none">
          {props.leaderboard.map((entry, index) => (
            <IonItem key={index} className="muted-item p-3">
              <div className="flex items-center gap-3">
                <span className="font-medium text-lg">{index + 1}</span>
                <span className="font-medium">{entry.name}</span>
              </div>
              <span slot="end" className="text-primary font-semibold">
                {entry.cardsMastered} cards
              </span>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default Leaderboard;
