import { makeHttpCall } from '@/utils/makeHttpCall';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../ui/carousel';
import { FlashCard } from './FlashCard';

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
            {selectedSet === null ? (
                <IonGrid>
                    <IonRow>
                        {props.flashcardSets
                            .sort((a, b) => a.ID - b.ID)
                            .map((set) => (
                                <IonCol
                                    size="12"
                                    sizeMd="6"
                                    sizeLg="4"
                                    key={set.ID}
                                >
                                    <IonCard
                                        className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-lg border shadow-sm"
                                        onClick={() => setSelectedSet(set.ID)}
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
                                        </IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))}
                    </IonRow>
                </IonGrid>
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
                                        <FlashCard
                                            front={card.Front}
                                            back={card.Back}
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
