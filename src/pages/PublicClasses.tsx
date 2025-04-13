import { Navbar } from '@/components/Navbar';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonButton,
  IonSearchbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Class = {
  ID: number;
  ClassName: string;
  ClassDescription: string;
  JoinCode?: string;
  CreatedAt: string;
  UpdatedAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
// const mockClasses = [
//   {
//     ID: 1,
//     ClassName: 'Biology 101',
//     ClassDescription: 'Biology',
//     CreatedAt: '2023-01-15',
//     UpdatedAt: '2023-05-20',
//   },
//   {
//     ID: 2,
//     ClassName: 'Chemistry 101',
//     ClassDescription: 'Chemistry',
//     CreatedAt: '2025-01-15',
//     UpdatedAt: '2023-05-20',
//   },
//   {
//     ID: 3,
//     ClassName: 'physic 101',
//     ClassDescription: 'physic',
//     CreatedAt: '2023-01-11',
//     UpdatedAt: '2023-05-10',
//   },
// ]
const PublicClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await makeHttpCall<Class[]>(`${API_BASE}/api/classes/list`);
        setClasses(res);
        setLoading(false);
      } catch (error) {
        setError(`Error fetching classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <IonContent>
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold pb-8">Public Classes</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem) => (
            // TODO: INstead of a link, navigate after the response comes back
            <Link key={classItem.ID} to={`/class/${classItem.ID}`}>
              <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                  <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    {classItem.ClassName}
                  </IonCardTitle>
                  <IonCardSubtitle className="text-sm text-gray-600">
                    {classItem.ClassDescription || 'No description'}
                  </IonCardSubtitle>
                  <IonButton
                    expand="block"
                    color="primary"
                    className="mt-4"
                    // TODO: Use state instead of onClick
                    onClick={async () => {
                      try {
                        const response = await makeHttpCall(
                          `${API_BASE}/api/class_user`,
                          {
                            method: 'POST',
                            headers: {
                              class_id: classItem.ID,
                              role: 'student',
                            },
                          }
                        );
                        console.log('Join class response:', response);
                      } catch (error) {
                        console.error('Error joining class:', error);
                      }
                    }}
                  >
                    Join Class
                  </IonButton>
                </IonCardHeader>
              </IonCard>
            </Link>
          ))}
        </div>
      </div>
    </IonContent>
  );
};

export default PublicClasses;
