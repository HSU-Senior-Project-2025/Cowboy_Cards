// SetOverview.tsx
import {
    IonContent,
    IonCard,
    IonCardContent,
    IonText,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { useHistory } from 'react-router-dom';
import { IonButton } from '@ionic/react';
  
const SetOverview = () => {
    const { id } = useParams<{ id: string }>();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cards, setCards] = useState<{ front: string; back: string }[]>([]);
  
    useEffect(() => {
        const fetchSetDetails = async () => {
            try {
            const setRes = await fetch(`${API_BASE}/api/flashcards/sets/`, {
                method: 'GET',
                headers: { id },
            });
            const setData = await setRes.json();
            setTitle(setData.SetName);
            setDescription(setData.SetDescription);
            } catch (error) {
            console.error('Failed to fetch set info', error);
            }
        };
  
        const fetchCards = async () => {
            try {
            const res = await fetch(`${API_BASE}/api/flashcards/list`, {
                method: 'GET',
                headers: { set_id: id },
            });
            const data = await res.json();
            setCards(Array.isArray(data)
                ? data.map((card: any) => ({
                    front: card.Front,
                    back: card.Back,
                }))
                : []
            );
            } catch (error) {
            console.error('Failed to fetch cards', error);
            }
        };
  
      if (id) {
        fetchSetDetails();
        fetchCards();
      }
    }, [id]);
  
    return (
      <IonContent className="ion-padding">
        <Navbar />
        <div id="main-content" className="container max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                {/* Left: Back Button + Title & Description aligned */}
                <div className="flex items-center gap-4 flex-1 pr-4">
                    {/* Back Button */}
                    <IonButton
                        className="rounded-lg"
                        fill="outline"
                        style={{ '--border-radius': '0.5rem' }}
                        routerLink="/public-cards"
                    >
                        Back
                    </IonButton>

                    {/* Title + Description (stacked) */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-base mt-1 text-gray-700">{description}</p>
                    </div>
                </div>

                {/* Right: Study Set Button */}
                <div className="self-start md:self-center flex gap-2 md:mt-0 mt-4 w-full md:w-auto">
                    <IonButton
                        className="rounded-lg w-1/2 md:w-auto"
                        fill="outline"
                        style={{ '--border-radius': '0.5rem' }}
                        routerLink={`/edit-set/${id}`}
                    >
                        Edit Set
                    </IonButton>
                    <IonButton
                        className="rounded-lg w-1/2 md:w-auto"
                        color={'primary'}
                        style={{ '--border-radius': '0.5rem' }}
                        routerLink={`/flashcards/${id}`}
                    >
                        Study Set
                    </IonButton>
                </div>
            </div>

  
            {cards.length === 0 ? (
                <div className="text-center mt-8 text-lg text-gray-900 dark:text-gray-400">
                    This set has no cards yet.
                </div>
                ) : (
                cards.map((card, index) => (
                    <IonCard key={index} className="mb-4 rounded-lg border shadow-sm">
                    <IonCardContent>
                        {/* Card number label */}
                        <div className="border-b border-gray-300 mb-3 pb-1 m-4">
                            <IonText className="text-md font-semibold text-gray-900 dark:text-gray-300">
                                Card {index + 1}
                            </IonText>
                        </div>

                        {/* Front / Back layout */}
                        <div className="flex flex-row justify-between items-start">
                        {/* Front (30%) */}
                        <div className="w-3/12 pr-4 border-r border-gray-300 m-4">
                            <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                                {card.front}
                            </IonText>
                        </div>

                        {/* Back (70%) */}
                        <div className="w-9/12 pl-4 m-4">
                            <IonText className="block whitespace-pre-wrap text-lg text-gray-900 dark:text-gray-200">
                                {card.back}
                            </IonText>
                        </div>
                        </div>
                    </IonCardContent>
                    </IonCard>
                ))
            )}

        </div>
      </IonContent>
    );
  };
  
  export default SetOverview;
  