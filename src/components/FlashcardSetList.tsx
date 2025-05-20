import type { Flashcard } from '@/types/globalTypes';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const FlashcardCarousel = (props) => {
  const history = useHistory();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  return (
    <div className="mt-6">
      {props.loading ? (
        <div>Loading...</div>
      ) : props.flashcardSets?.length ? (
        <IonGrid>
          <IonRow>
            {props.flashcardSets
              .sort((a, b) => a.ID - b.ID)
              ?.map((set) => (
                <IonCol size="12" sizeMd="6" sizeLg="4" key={set.ID}>
                  <IonCard
                    className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-lg border shadow-sm"
                    onClick={() =>
                      history.push(`/set-overview/${set.ID}`, {
                        fromClassID: props.classID,
                      })
                    }
                  >
                    <IonCardHeader>
                      <IonCardTitle className="text-lg font-semibold">
                        {set.SetName}
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <p className="text-muted-foreground mb-2">
                        {set.SetDescription}
                      </p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>
      ) : (
        <p>
          No flashcard sets available. Create one or add an existing set to your
          class.
        </p>
      )}
    </div>
  );
};

export default FlashcardCarousel;
