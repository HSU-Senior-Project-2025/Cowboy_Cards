import { FlashCard } from '@/components/FlashCard';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  useFlashcardCards,
  useFlashcardSetDetails,
} from '@/hooks/useFlashcardQueries';
import type { Flashcard } from '@/types/globalTypes';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  useIonToast,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Flashcard = () => {
  const { id } = useParams<{ id: string }>();
  const [presentToast] = useIonToast();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // React Query hooks
  const {
    data: flashcardSetData,
    isLoading: isLoadingSet,
    error: setError,
  } = useFlashcardSetDetails(id);

  const {
    data: cards = [],
    isLoading: isLoadingCards,
    error: cardsError,
  } = useFlashcardCards(id);

  // Loading state derived from React Query
  const isLoading = isLoadingSet || isLoadingCards;

  // Error handling
  const error = setError || cardsError;
  if (error) {
    console.error('Query error:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    presentToast({
      message: `Error loading data: ${message}`,
      duration: 3000,
      color: 'danger',
    });
  }

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCurrentCardIndex(carouselApi.selectedScrollSnap());
    };

    onSelect();

    carouselApi.on('select', onSelect);
    carouselApi.on('reInit', onSelect);

    return () => {
      carouselApi.off('select', onSelect);
      carouselApi.off('reInit', onSelect);
    };
  }, [carouselApi]);

  const handleAdvance = () => {
    // Check if carousel exists and there are cards
    if (carouselApi && cards.length > 0) {
      // Check if currently on the last card
      if (currentCardIndex === cards.length - 1) {
        // Show success toast
        presentToast({
          message: 'Congratulations! You have completed the set.',
          duration: 3000,
          color: 'success',
        });
        // Optional: Add actions like navigating back or resetting
      } else {
        // Not the last card, advance to the next one
        carouselApi.scrollNext();
      }
    }
  };

  // Calculate progress percentage
  const progressPercentage = cards.length
    ? Math.round(((currentCardIndex + 1) / cards.length) * 100)
    : 0;

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div
          id="main-content"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          {/* Flashcards */}
          <div className="flex items-center gap-4 mb-6">
            <IonButton
              className="rounded-lg"
              style={{ '--border-radius': '0.5rem' }}
              routerLink={`/set-overview/${id}`}
            >
              <IonIcon slot="start" icon={arrowBackOutline} />
              Back
            </IonButton>
            <div>
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  <IonSpinner name="dots" />
                  <IonSpinner name="dots" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">
                    {flashcardSetData?.SetName}
                  </h1>
                  <p className="text-gray-500">
                    {flashcardSetData?.SetDescription}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="w-full max-w-xl mx-auto relative py-8 min-h-[400px] flex flex-col items-center justify-center">
            {isLoading ? (
              <IonSpinner name="circular" />
            ) : cards.length === 0 ? (
              <div className="text-center text-gray-500 text-lg py-20">
                This set has no cards yet.
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="w-full mb-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {/* Card Counter */}
                <div className="text-sm text-gray-500 mb-4">
                  Card {currentCardIndex + 1} of {cards.length}
                </div>

                <Carousel
                  orientation="vertical"
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="-mt-1 h-[400px]">
                    {cards?.map((card, index) => (
                      <CarouselItem key={index}>
                        <FlashCard
                          front={card.Front}
                          back={card.Back}
                          onAdvance={handleAdvance}
                          cardId={card.ID}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </>
            )}
          </div>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Flashcard;
