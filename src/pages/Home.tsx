import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText,
  IonHeader,
  IonTitle,
} from '@ionic/react';
import { addOutline, listOutline, bookOutline } from 'ionicons/icons';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/contexts/ThemeContext';

const Home = () => {
  const [tab, setTab] = useState('classes');

  const classes = [
    { id: 1, name: 'Biology 101', teacher: 'Dr. Smith', sets: 5 },
    { id: 2, name: 'Spanish Basics', teacher: 'Mrs. Garcia', sets: 3 },
    { id: 3, name: 'World History', teacher: 'Mr. Johnson', sets: 7 },
    { id: 4, name: 'Algebra 2', teacher: 'Ms. Lee', sets: 4 },
    { id: 5, name: 'Physics', teacher: 'Dr. Smith', sets: 6 },
    { id: 6, name: 'English Literature', teacher: 'Mrs. Garcia', sets: 3 },
  ];

  const personalFlashcardSets = [
    { id: 1, name: 'Chemistry Fundamentals', cards: 12 },
    { id: 2, name: 'French Vocabulary', cards: 20 },
    { id: 3, name: 'Geography Facts', cards: 8 },
    { id: 4, name: 'Math Formulas', cards: 15 },
    { id: 5, name: 'Literature Quotes', cards: 10 },
    { id: 6, name: 'Historical Events', cards: 5 },
  ];

  const suggestedFlashcardSets = [
    { id: 1, name: 'Physics Essentials', cards: 18 },
    { id: 2, name: 'Spanish Phrases', cards: 22 },
    { id: 3, name: 'World Capitals', cards: 12 },
    { id: 4, name: 'Algebraic Equations', cards: 20 },
    { id: 5, name: 'Shakespearean Plays', cards: 14 },
    { id: 6, name: 'Ancient Civilizations', cards: 9 },
  ];

  return (
    <IonContent className="ion-padding">
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold">
            {tab === 'classes' ? 'My Classes' : 'Personal Flashcard Sets'}
          </h1>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <IonButton
              color="primary"
              className="rounded-lg"
              style={{ '--border-radius': '0.5rem' }}
              href="/class/create"
            >
              <IonIcon slot="start" icon={addOutline} /> Add Class
            </IonButton>
          </div>
        </div>

        <div className="mb-8">
          <IonSegment
            value={tab}
            onIonChange={(e) => setTab((e.detail.value as string) || 'classes')}
            style={{
              '--background': 'var(--ion-color-light)',
            }}
          >
            <IonSegmentButton value="classes">
              <IonIcon icon={listOutline} className="mr-2" />
              <IonLabel>My Classes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="flashcards">
              <IonIcon icon={bookOutline} className="mr-2" />
              <IonLabel>My Cards</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {tab === 'classes' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Link key={cls.id} to={`/class/${cls.id}`}>
                <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                  <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                    <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                      {cls.name}
                    </IonCardTitle>
                    <IonCardSubtitle className="text-sm text-muted-foreground">
                      {cls.teacher}
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText className="text-sm text-gray-600">
                      {cls.sets} sets
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </Link>
            ))}
          </div>
        )}

        {tab === 'flashcards' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personalFlashcardSets.map((set) => (
              <Link key={set.id} to={`/class/${set.id}`}>
                <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                  <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                    <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                      {set.name}
                    </IonCardTitle>
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
        )}
        <div className="mb-8">
          <IonHeader className="p-4">
            <IonTitle className="text-2xl font-bold">Suggested Sets</IonTitle>
          </IonHeader>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suggestedFlashcardSets.map((set) => (
            <Link key={set.id} to={`/class/${set.id}`}>
              <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                  <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    {set.name}
                  </IonCardTitle>
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

export default Home;
