import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useUserClasses } from '@/hooks/useClassQueries';
import type { Class } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonSearchbar,
  useIonToast,
} from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PublicClasses = () => {
  const queryClient = useQueryClient();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [presentToast] = useIonToast();
  const { data: userClasses, isLoading: isLoadingUserClasses } =
    useUserClasses();

  const isUserMember = (classId: number): boolean => {
    if (!userClasses) return false;
    return userClasses.some((userClass) => userClass.ClassID === classId);
  };

  const filteredClasses = classes.filter(
    (x) =>
      x.ClassName.toLowerCase().includes(searchText.toLowerCase()) ||
      (x.ClassDescription &&
        x.ClassDescription.toLowerCase().includes(searchText.toLowerCase()))
  );

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await makeHttpCall<Class[]>(`/api/classes/list`);
        setClasses(res);
      } catch (error) {
        setError(`Error fetching classes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div id="main-content" className="container mx-auto px-0 py-8 w-4/5">
          <div className="flex items-center flex-col justify-between mb-4">
            <h1 className="text-4xl tracking-wide font-bold font-smokum pb-8">
              Public Classes
            </h1>
            {(loading || isLoadingUserClasses) && <div>Loading...</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <IonSearchbar
              value={searchText} // eslint-disable-next-line
              onIonInput={(e: any) => setSearchText(e.target.value)}
              placeholder="Search classes"
              className="mb-4 max-w-lg"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses?.map(
              (classItem) =>
                !isUserMember(classItem.ID) && (
                  <Link key={classItem.ID} to={`/class/${classItem.ID}`}>
                    <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                      <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                        <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                          {classItem.ClassName}
                        </IonCardTitle>
                        <IonCardSubtitle className="text-sm ">
                          {classItem.ClassDescription || 'No description'}
                        </IonCardSubtitle>
                        <IonButton
                          expand="block"
                          color="primary"
                          className="mt-4"
                          onClick={async () => {
                            try {
                              const response = await makeHttpCall(
                                `/api/class_user`,
                                {
                                  method: 'POST',
                                  headers: {
                                    class_id: classItem.ID,
                                    role: 'student',
                                  },
                                }
                              );
                              console.log('Join class response:', response);
                              presentToast({
                                message: 'Successfully joined class',
                                duration: 2000,
                                color: 'success',
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['userClasses'],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['classMembers'],
                              });
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
                )
            )}
          </div>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default PublicClasses;
