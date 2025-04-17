import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRouterLink,
  IonRow,
} from '@ionic/react';
import {
  arrowBackOutline,
  createOutline,
  trashBin,
  trashBinOutline,
  trashOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { FlashCard } from '@/components/FlashCard';
import { useHistory } from 'react-router-dom';
import { Link } from 'lucide-react';

type Flashcards = {
  ID: number;
  Front: string;
  Back: string;
  SetID: number;
  CreatedAt: string;
  UpdatedAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// We probably should make the flashcards have an independent page, so we can show loading states and errors
const FlashcardCarousel = (props) => {
  const history = useHistory();
  const [flashcards, setFlashcards] = useState<Flashcards[]>([]);
  const [selectedSet, setSelectedSet] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFlashcards() {
      console.log('selectedSet', selectedSet);
      const cards = await makeHttpCall<Flashcards[]>(
        `${API_BASE}/api/flashcards/list`,
        {
          method: 'GET',
          headers: {
            set_id: selectedSet,
          },
        }
      );
      console.log('cards', cards);
      setFlashcards(cards);
    }
    if (selectedSet) {
      fetchFlashcards();
    }
  }, [selectedSet]);

  return (
    <div className="mt-6">
      {props.loading ? (
        <div>Loading...</div>
      ) : selectedSet === null ? (
        props.flashcardSets?.length ? (
          <IonGrid>
            <IonRow>
              {props.flashcardSets
                .sort((a, b) => a.ID - b.ID)
                .map((set) => (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={set.ID}>
                    <IonCard
                      className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-lg border shadow-sm"
                      onClick={() => history.push(`/set-overview/${set.ID}`)}
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
                        {/* <p className="text-muted-foreground">
                                            {set.cards.length} cards
                                        </p> */}
                        {props.isTeacher && (
                          <IonButtons slot="end" className="flex justify-end">
                            <IonButton
                              onClick={(e) => {
                                history.push(`/edit-set/${set.ID}`);
                                e.bubbles = false;
                                e.stopPropagation();
                              }}
                            >
                              <IonIcon icon={createOutline} />
                            </IonButton>
                            <IonButton
                              onClick={(e) => {
                                e.bubbles = false;
                                e.stopPropagation();
                                props.onDeleteSet(set.ID);
                              }}
                            >
                              <IonIcon
                                slot="end"
                                icon={trashOutline}
                                color="danger"
                                className="cursor-pointer"
                              />
                            </IonButton>
                          </IonButtons>
                        )}
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
            </IonRow>
          </IonGrid>
        ) : (
          <p>No flashcard sets available.</p>
        )
      ) : (
        <>
          <IonButton
            fill="outline"
            onClick={() => setSelectedSet(null)}
            className="mb-6"
          >
            <IonIcon slot="start" icon={arrowBackOutline} />
            Back to Sets
          </IonButton>
          <div className="w-full max-w-2xl mx-auto relative">
            <Carousel
              orientation="vertical"
              className="w-full"
              setApi={props.setApi}
            >
              <CarouselContent className="-mt-1 h-[400px]">
                {flashcards.map((card) => (
                  <CarouselItem key={card.ID}>
                    {/* TODO: user_id should be from context */}
                    <FlashCard
                      front={card.Front}
                      back={card.Back}
                      cardId={card.ID}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              {flashcards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === props.currentCardIndex
                      ? 'bg-primary'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardCarousel;
