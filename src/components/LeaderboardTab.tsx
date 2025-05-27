import { IonSpinner } from '@ionic/react';
import Leaderboard from '@/components/Leaderboard';

const LeaderboardTab = (props) => {
  return (
    <>
      {props.loadingScores ? (
        <div className="flex justify-center items-center p-8">
          <IonSpinner name="circular" />
          <span className="ml-2">Calculating scores...</span>
        </div>
      ) : (
        <Leaderboard leaderboard={props.leaderboardData} />
      )}
    </>
  );
};

export default LeaderboardTab;
