import { AuthForm } from '@/components/auth/AuthForm';
import { IonContent } from '@ionic/react';

// type Class = {
//   ID: string;
//   ClassName: string;
//   ClassDescription: string;
//   CreatedAt: string;
//   UpdatedAt: string;
// };

const Index = () => {
  return (
    <IonContent>
      <div className="min-h-screen flex flex-col items-center justify-center from-white to-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">CowboyCards</h1>
          <p>Master any subject with smart flashcards</p>
        </div>
        <AuthForm />
      </div>
    </IonContent>
  );
};

export default Index;
