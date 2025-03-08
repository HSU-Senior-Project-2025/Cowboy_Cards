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
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}

const Index = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClasses('http://localhost:8000/classes');
        setClasses(data);
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
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
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
