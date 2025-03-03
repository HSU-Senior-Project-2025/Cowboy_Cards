import { AuthForm } from '@/components/auth/AuthForm';
import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';

type Class = {
  ID: string;
  Name: string;
  Description: string;
  JoinCode: string;
  TeacherID: string;
  CreatedAt: string;
  UpdatedAt: string;
};

async function fetchClasses(url: string): Promise<Class[]> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const Index = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchClasses('http://localhost:8000/classes');
        setClasses(data);
      } catch (error) {
        setError(error.message);
      }
    }
    if (buttonClicked) {
      fetchData();
    }
  }, [buttonClicked]);

  return (
    <IonContent>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <button
          className="h-24 w-24 bg-red-500"
          onClick={(e) => {
            console.log(e);
            setButtonClicked(true);
          }}
        >
          clickme!
        </button>
        {error && <div>Error: {error}</div>}
        <div>
          {classes.map((cls) => (
            <div key={cls.ID}>
              <p>{cls.Name}</p>
            </div>
          ))}
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">CowboyCards</h1>
          <p className="text-gray-600">
            Master any subject with smart flashcards
          </p>
        </div>
        <AuthForm />
      </div>
    </IonContent>
  );
};

export default Index;
