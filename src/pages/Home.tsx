import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useUserClasses, useUserSets } from '@/hooks/useClassQueries';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/react';
import { addOutline, bookOutline, listOutline } from 'ionicons/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [tab, setTab] = useState('classes');
  const {
    data: userClasses = [],
    isLoading: isLoadingUserClasses,
    error: classesError,
  } = useUserClasses();
  const {
    data: userSets,
    isLoading: isLoadingUserSets,
    error: setsError,
  } = useUserSets();

  const error = classesError || setsError;

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div
          id="main-content"
          className="container mx-auto px-4 py-8 flex-grow"
        >
          {error && <div className="text-red-500 mt-2">{error.message}</div>}
          <div className="flex flex-col me:flex-row me:justify-between me:items-center mb-8">
            <h1 className="text-4xl font-smokum font-bold">
              {tab === 'classes' ? 'My Classes' : 'My Flashcard Sets'}
            </h1>
            <div className="flex items-center gap-2 mt-4 me:mt-0">
              <IonButton
                color="primary"
                className="rounded-lg"
                style={{ '--border-radius': '0.5rem' }}
                routerLink={
                  tab === 'classes' ? '/public-classes' : '/public-cards'
                }
              >
                <IonIcon slot="start" icon={addOutline} />{' '}
                {tab === 'classes' ? 'Join Class' : 'Join Set'}
              </IonButton>
            </div>
          </div>

          <div className="mb-8">
            <IonSegment
              value={tab}
              onIonChange={(e) =>
                setTab((e.detail.value as string) || 'classes')
              }
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
            <>
              {isLoadingUserClasses ? (
                <div className="flex justify-center items-center p-8">
                  <IonSpinner name="circular" />
                  <span className="ml-2">Loading classes...</span>
                </div>
              ) : userClasses === null ? (
                <div className="text-center p-8 text-gray-600">
                  You are not part of any classes. Join a class to get started.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userClasses?.map((cls) => (
                    <Link key={cls.ClassID} to={`/class/${cls.ClassID}`}>
                      <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                        <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                          <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                            {cls.ClassName}
                          </IonCardTitle>
                          <IonCardSubtitle className="text-sm text-muted-foreground">
                            {cls.ClassDescription}
                          </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                          {/* <IonText className="text-sm text-gray-600">
                          {cls.sets} sets
                        </IonText> */}
                        </IonCardContent>
                      </IonCard>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'flashcards' && (
            <>
              {isLoadingUserSets ? (
                <div className="flex justify-center items-center p-8">
                  <IonSpinner name="circular" />
                  <span className="ml-2">Loading sets...</span>
                </div>
              ) : userSets === null ? (
                <div className="text-center p-8 text-gray-600">
                  You are not part of any sets. Join a set to get started.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userSets?.map((set) => (
                    <Link key={set.SetID} to={`/set-overview/${set.SetID}`}>
                      <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                        <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                          <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                            {set.SetName}
                          </IonCardTitle>
                          <IonCardSubtitle className="text-sm text-muted-foreground">
                            {set.SetDescription}
                          </IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                          {/* <IonText className="text-sm text-gray-600">
                          {set.cards} cards
                        </IonText> */}
                        </IonCardContent>
                      </IonCard>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Home;
