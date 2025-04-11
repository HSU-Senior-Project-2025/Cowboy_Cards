import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/react';

type LeaderboardEntry = {
  name: string;
  totalScore: number;
};

// type LeaderboardProps = {
//   leaderboard: LeaderboardEntry[];
//   classUsers: any[];
// };

const Leaderboard = ({ leaderboard }) => {
  return (
    <IonCard className='rounded-lg border shadow-sm'>
      <IonCardHeader>
        <IonCardTitle className='text-xl font-semibold'>
          Class Leaderboard
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList className='space-y-3' lines='none'>
          {leaderboard.map((entry) => (
            <IonItem key={entry.UserID} className='muted-item p-3'>
              <div className='flex items-center gap-3'>
                <span className='font-medium text-lg'>{entry.Username}</span>
              </div>
              <span slot='end' className='text-primary font-semibold'>
                {entry.ClassScore} points
              </span>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default Leaderboard;
