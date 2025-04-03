import { AuthForm } from '@/components/auth/AuthForm';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';

type Class = {
  ID: string;
  ClassName: string;
  ClassDescription: string;
  JoinCode: string;
  CreatedAt: string;
  UpdatedAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Index = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      // This is a nested try catch, but it shows the error message on the page so I left it
      try {
        // How to fetch data from the backend using universal fetch utility
        const data = await makeHttpCall<Class[]>(
          `${API_BASE}/api/classes/list`
        );

        console.log('data', data);
        setClasses(Array.isArray(data) ? data : [data]);
        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (buttonClicked) {
      fetchData();
    }
  }, [buttonClicked]);

  return (
    <IonContent>
      <div className="min-h-screen flex flex-col items-center justify-center from-white to-gray-50">
        <button
          className="h-24 w-24 bg-red-500"
          onClick={(e) => {
            console.log(e);
            setButtonClicked(true);
          }}
        >
          clickme!
        </button>
        <a href="/home" className="text-blue-500 hover:text-blue-700 underline">
          Home
        </a>
        <a
          href="/public-cards"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Public Cards
        </a>
        <a
          href="/teacher"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Teacher
        </a>
        <a
          href="/teacher/class/1"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Teacher Class
        </a>
        <a
          href="/class/1"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Class
        </a>
        <a
          href="/class/1"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Class
        </a>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div>
          {classes.map(
            (cls) => (
              console.log('cls', cls),
              console.log('cls.ID', cls.ID),
              console.log('cls.Name', cls.ClassName),
              (
                <div key={cls.ID}>
                  <p>{cls.ClassName}</p>
                </div>
              )
            )
          )}
        </div>
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
