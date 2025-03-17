import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonText,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarTitle, NavbarButton } from '@/components/navbar';

const PublicFlashcards = () => {
  const flashcardSets = [
    {
      id: 1,
      title: 'Basic Spanish Vocabulary',
      creator: 'John Doe',
      cards: 50,
    },
    { id: 2, title: 'World Capitals', creator: 'Jane Smith', cards: 30 },
    { id: 3, title: 'Biology Terms', creator: 'Dr. Emily Brown', cards: 40 },
  ];

  return (
    <IonContent>
      <Navbar>
        <NavbarTitle>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">
            Public Flashcards
          </div>
        </NavbarTitle>
      </Navbar>
      <div id="main-content" className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flashcardSets.map((set) => (
            <Link key={set.id} to={`/flashcards/${set.id}`}>
              <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                  <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    {set.title}
                  </IonCardTitle>
                  <IonCardSubtitle className="text-sm text-gray-600">
                    Created by {set.creator}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonText className="text-sm text-gray-600">
                    {set.cards} cards
                  </IonText>
                </IonCardContent>
              </IonCard>
            </Link>
          ))}
        </div>
      </div>
    </IonContent>
  );
};

export default PublicFlashcards;
