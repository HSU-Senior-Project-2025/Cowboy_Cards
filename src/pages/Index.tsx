import { AuthForm } from '@/components/auth/AuthForm';
import { IonContent, IonPage } from '@ionic/react';

const Index = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen flex flex-col items-center justify-center from-white to-gray-50">
          <div className="text-center mb-8 sm:mb-12 md:mb-16 mt-6 sm:mt-10 md:mt-14 mx-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl text-primary mb-4 font-ewert">
              Cowboy Cards
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-rye">
              Master any subject with smart flashcards
            </p>
          </div>
          <AuthForm />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Index;
