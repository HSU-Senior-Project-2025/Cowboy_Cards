import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { type CarouselApi } from '@/components/ui/carousel';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassDetailHeader from '@/components/ClassDetailHeader';
import ClassDetailControls from '@/components/ClassDetailControls';
import ClassDetailTabs from '@/components/ClassDetailTabs';
import FlashcardTab from '@/components/FlashcardTab';
import LeaderboardTab from '@/components/LeaderboardTab';
import StudentTab from '@/components/StudentTab';

type Class = {
  ID: number;
  ClassName: string;
  ClassDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
  Role: string;
};

type FlashcardSet = {
  ID: number;
  SetName: string;
  SetDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type ClassUser = {
  UserID: number;
  ClassID: number;
  Role: string;
  FirstName: string;
  LastName: string;
};

type GetClassScoresRow = {
  UserID: number;
  Username: string;
  ClassScore: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ClassDetail = () => {
  const { id } = useParams();
  console.log('id', id);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [tab, setTab] = useState('flashcards');
  const [isTeacher, setIsTeacher] = useState(false);
  const [classData, setClassData] = useState<Class>();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [classUsers, setClassUsers] = useState<ClassUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<GetClassScoresRow[]>(
    []
  );
  const [loadingScores, setLoadingScores] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    class_name: '',
    class_description: '',
  });

  const handleEdit = () => {
    console.log('Handling Edit');
    setUpdatedInfo({
      class_name: classData?.ClassName || '',
      class_description: classData?.ClassDescription || '',
    });
    setIsEditing(true);
  };

  const [errors, setErrors] = useState<{
    className?: string;
    classDescription?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      className?: string;
      classDescription?: string;
    } = {};
    let isValid = true;

    updatedInfo.class_name = updatedInfo.class_name.trim();
    updatedInfo.class_description = updatedInfo.class_description.trim();

    if (!updatedInfo.class_name) {
      newErrors.className = 'Class name is required';
      isValid = false;
    }

    if (!updatedInfo.class_description) {
      newErrors.classDescription = 'Class description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    const fieldsToUpdate = ['class_name', 'class_description'];

    try {
      const updatePromises = fieldsToUpdate.map((field) =>
        makeHttpCall<Class>(`${API_BASE}/api/classes/${field}`, {
          method: 'PUT',
          headers: {
            id: id,
            [field]: updatedInfo[field],
          },
        })
      );

      await Promise.all(updatePromises);
      setClassData((prev) => ({
        ...prev,
        ClassName: updatedInfo.class_name,
        ClassDescription: updatedInfo.class_description,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update some fields. Please try again.');
    }
  };

  const handleChange = (e: CustomEvent) => {
    const { name } = e.target as HTMLInputElement;
    const value = e.detail.value;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    async function fetchDataForClass() {
      setLoading(true);
      setLoadingScores(true);
      setError(null);
      try {
        const [classDetails, sets, users, scores] = await Promise.all([
          makeHttpCall<Class>(`${API_BASE}/api/classes/`, {
            method: 'GET',
            headers: { id: id },
          }),

          makeHttpCall<FlashcardSet[]>(`${API_BASE}/api/class_set/list_sets`, {
            method: 'GET',
            headers: { id: id },
          }),

          makeHttpCall<ClassUser[]>(`${API_BASE}/api/class_user/members`, {
            method: 'GET',
            headers: { class_id: id },
          }),

          makeHttpCall<GetClassScoresRow[]>(
            `${API_BASE}/api/classes/leaderboard`,
            {
              method: 'GET',
              headers: { id: id },
            }
          ),
        ]);

        console.log('data', classDetails);
        setIsTeacher(classDetails.Role === 'teacher');
        setClassData(classDetails);

        console.log('sets', sets);
        setFlashcardSets(sets);

        console.log('users', users);
        setClassUsers(users);

        console.log('scores', scores);
        setLeaderboardData(scores);
      } catch (error) {
        setError(`Error fetching class data: ${error.message}`);
      } finally {
        setLoading(false);
        setLoadingScores(false);
      }
    }

    fetchDataForClass();
  }, [id]);

  const handleDeleteStudent = async (studentId: number | null) => {
    if (studentId === null) return;
    try {
      // TODO: Usees the wrong endpoint for deleting a student, deletes the current user from the  class
      // TODO: Need endpoint for deleting a student from a class, should verify that the user is a teacher in the backend
      await makeHttpCall(`${API_BASE}/api/class_user/`, {
        method: 'DELETE',
        headers: {
          class_id: id,
          student_id: studentId,
        },
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Error deleting student');
    }
  };

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    carouselApi.on('select', () => {
      setCurrentCardIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  return (
    <>
      <Navbar />
      <IonContent className="ion-padding">
        <div id="main-content" className="max-w-4xl mx-auto">
          {error && <div className="text-red-500">{error}</div>}

          <ClassDetailHeader
            classData={classData}
            isTeacher={isTeacher}
            loading={loading}
            handleEdit={handleEdit}
            isEditing={isEditing}
            updatedInfo={updatedInfo}
            errors={errors}
            handleChange={handleChange}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />

          <ClassDetailControls isTeacher={isTeacher} classId={id} />

          <ClassDetailTabs selectedTab={tab} onTabChange={setTab} />

          {tab === 'leaderboard' && (
            <LeaderboardTab
              leaderboardData={leaderboardData}
              loadingScores={loadingScores}
            />
          )}

          {
            // Render FlashcardTab when 'flashcards' tab is active
            tab === 'flashcards' && (
              <FlashcardTab
                flashcardSets={flashcardSets}
                currentCardIndex={currentCardIndex}
                setApi={setCarouselApi} // Pass the setter for the carousel API
              />
            )
          }

          {
            // Render StudentTab when 'students' tab is active
            tab === 'students' && (
              <StudentTab
                isTeacher={isTeacher}
                students={classUsers} // Pass classUsers as the students prop
                handleActualDelete={handleDeleteStudent} // Pass the actual delete handler
              />
            )
          }
        </div>
        <Footer />
      </IonContent>
    </>
  );
};

export default ClassDetail;
