import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/react';
import { motion } from 'framer-motion';

const Leaderboard = (props) => {
  return (
    <IonCard className="rounded-lg border shadow-sm">
      <IonCardHeader>
        <IonCardTitle className="text-xl font-semibold">
          Class Leaderboard
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* Add a scrollable container */}
        <IonList className="max-h-96 overflow-y-auto space-y-3" lines="none">
          {props.leaderboard === null ? (
            <h1 className="text-center text-gray-500">No scores available</h1>
          ) : (
            props.leaderboard?.map((entry, index) => (
              // Wrap each item with a motion.div for animation
              <motion.div
                key={entry.UserID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <IonItem className="muted-item py-3">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-yellow-500 text-xl">🥇</span>
                    )}
                    {index === 1 && (
                      <span className="text-gray-400 text-xl">🥈</span>
                    )}
                    {index === 2 && (
                      <span className="text-orange-500 text-xl">🥉</span>
                    )}
                    <span className="font-medium text-lg">
                      {entry.Username}
                    </span>
                  </div>
                  <span slot="end" className="text-primary font-semibold ml-2">
                    {entry.ClassScore} points
                  </span>
                </IonItem>
              </motion.div>
            ))
          )}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default Leaderboard;
