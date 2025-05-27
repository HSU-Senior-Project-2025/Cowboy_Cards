import { IonIcon, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import { bookOutline, trophyOutline, peopleOutline } from 'ionicons/icons';

const ClassDetailTabs = (props) => {
  return (
    <IonSegment
      value={props.selectedTab}
      onIonChange={(e) => props.onTabChange(e.detail.value as string)}
      className="w-full mb-6"
    >
      <IonSegmentButton value="flashcards">
        <IonIcon icon={bookOutline} className="mr-2" />
        <IonLabel>Flashcard Sets</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="leaderboard">
        <IonIcon icon={trophyOutline} className="mr-2" />
        <IonLabel>Leaderboard</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="students">
        <IonIcon icon={peopleOutline} className="mr-2" />
        <IonLabel>Students</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default ClassDetailTabs;
