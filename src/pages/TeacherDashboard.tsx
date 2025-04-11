import { Navbar } from '@/components/Navbar';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock Data for teacher classes
  // Each class has an id, name, number of students, number of sets, and cards mastered
  // TODO: Replace with actual data from the database
  const teacherClasses = [
    {
      id: 1,
      name: 'Biology 101',
      students: 25,
      sets: 5,
      cardsMastered: 85,
    },
    {
      id: 2,
      name: 'Spanish Basics',
      students: 18,
      sets: 3,
      cardsMastered: 78,
    },
    {
      id: 3,
      name: 'World History',
      students: 30,
      sets: 7,
      cardsMastered: 92,
    },
  ];

  // Calculate summary statistics from the class data
  // These statistics provide an overview of all classes at a glance
  const totalClasses = teacherClasses.length;
  const totalStudents = teacherClasses.reduce(
    (sum, cls) => sum + cls.students,
    0
  );
  const totalSets = teacherClasses.reduce((sum, cls) => sum + cls.sets, 0);

  // Calculate average cards mastered across all classes
  // We sum all cards mastered values, then divide by class count
  const averageCardsMastered =
    teacherClasses.reduce((sum, cls) => {
      return sum + cls.cardsMastered;
    }, 0) / totalClasses;

  return (
    <IonContent>
      <Navbar />

      <div id="main-content" className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
          <IonCard className="rounded-lg border shadow-sm">
            <IonCardHeader className="flex flex-col space-y-1.5 p-6">
              <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                Total Classes
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText className="text-2xl font-bold">{totalClasses}</IonText>
            </IonCardContent>
          </IonCard>

          <IonCard className="rounded-lg border shadow-sm">
            <IonCardHeader className="flex flex-col space-y-1.5 p-6">
              <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                Total Students
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText className="text-2xl font-bold">{totalStudents}</IonText>
            </IonCardContent>
          </IonCard>

          <IonCard className="rounded-lg border shadow-sm">
            <IonCardHeader className="flex flex-col space-y-1.5 p-6">
              <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                Total Sets
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText className="text-2xl font-bold">{totalSets}</IonText>
            </IonCardContent>
          </IonCard>

          <IonCard className="rounded-lg border shadow-sm">
            <IonCardHeader className="flex flex-col space-y-1.5 p-6">
              <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                Average Cards Mastered
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText className="text-2xl font-bold">
                {averageCardsMastered.toFixed(1)}
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>

        <h2 className="text-xl font-bold mb-4">Classes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teacherClasses.map((cls) => (
            <Link key={cls.id} to={`/class/${cls.id}`}>
              <IonCard className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform-shadow duration-200 rounded-lg border shadow-sm">
                <IonCardHeader className="flex flex-col space-y-1.5 p-6">
                  <IonCardTitle className="text-2xl font-semibold leading-none tracking-tight">
                    {cls.name}
                  </IonCardTitle>
                  <IonText className="text-sm text-gray-600">
                    {cls.students} students enrolled
                  </IonText>
                </IonCardHeader>
                <IonCardContent className="flex flex-col gap-0 p-6 pt-0">
                  <IonText className="text-sm text-gray-600">
                    {cls.sets} sets
                  </IonText>
                  <IonText className="text-sm text-gray-600">
                    Cards mastered: {cls.cardsMastered}
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

export default TeacherDashboard;
