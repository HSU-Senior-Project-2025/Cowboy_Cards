import FlashcardCarousel from '@/components/FlashcardCarousel';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { type CarouselApi } from '@/components/ui/carousel';
import Leaderboard from '@/components/Leaderboard';
import StudentList from '@/components/StudentList';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonAlert,
  IonButton,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
} from '@ionic/react';
import {
  arrowBackOutline,
  bookOutline,
  createOutline,
  peopleOutline,
  trophyOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type Class = {
  ID: number;
  ClassName: string;
  ClassDescription: string;
  JoinCode?: string;
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
  const [showDeleteAlert, setShowDeleteAlert] = useState({
    isOpen: false,
    studentId: null,
  });

  // Update Class Name and Description Form
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

  // Form validation
  const [errors, setErrors] = useState<{
    className?: string;
    classDescription?: string;
    general?: string;
  }>({});

  // Basic validation before submitting
  const validateForm = () => {
    const newErrors: {
      className?: string;
      classDescription?: string;
    } = {};
    let isValid = true;

    // Trim whitespace from the input values
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
    // Validate form before submission
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    // Define the fields to be updated
    const fieldsToUpdate = ['class_name', 'class_description'];

    // NOT WORKING YET

    try {
      // Identify which fields have changed and create API call promises
      const updatePromises = fieldsToUpdate
        // .filter((field) => updatedInfo[field] !== classData[field]) // Only include modified fields
        .map((field) =>
          makeHttpCall<Class>(`${API_BASE}/api/classes/${field}`, {
            method: 'PUT',
            headers: {
              id: id, // User ID as a string
              [field]: updatedInfo[field], // New value for the field
            },
          })
        );

      // Wait for all API calls to complete successfully
      await Promise.all(updatePromises);
      // If all updates succeed, update the local state and exit editing mode
      setClassData((prev) => ({
        ...prev,
        ClassName: updatedInfo.class_name,
        ClassDescription: updatedInfo.class_description,
      }));
      setIsEditing(false);
    } catch (error) {
      // Log the error and notify the user if any update fails
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

  // Single useEffect to fetch all data for the class
  useEffect(() => {
    async function fetchDataForClass() {
      setLoading(true);
      setError(null);
      try {
        const [classDetails, sets, users, scores] = await Promise.all([
          // Fetch class information
          makeHttpCall<Class>(`${API_BASE}/api/classes/`, {
            method: 'GET',
            headers: { id: id },
          }),

          // Fetch flashcard sets
          makeHttpCall<FlashcardSet[]>(`${API_BASE}/api/class_set/get_sets`, {
            method: 'GET',
            headers: { class_id: id },
          }),

          // Fetch class users
          makeHttpCall<ClassUser[]>(`${API_BASE}/api/class_user/members`, {
            method: 'GET',
            headers: { class_id: id },
          }),

          // Fetch class leaderboard
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
      }
    }

    if (id) {
      fetchDataForClass();
    }
  }, [id]);

  const showDeleteStudentAlert = (studentId) => {
    setShowDeleteAlert((prev) => ({
      ...prev,
      isOpen: true,
      studentId: studentId,
    }));
  };

  // Handler to delete a student
  const handleDeleteStudent = async (studentId) => {
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
    <IonContent className="ion-padding">
      <Navbar />

      <div id="main-content" className="container mx-auto px-4 py-8">
        {error && <div className="text-red-500 mt-2">{error}</div>}

        {isEditing ? (
          <IonCardContent className="p-6 pt-0">
            <h1 className="text-3xl font-bold mb-2">
              Update Class Information
            </h1>
            <div className="space-y-4">
              <IonItem>
                <IonLabel position="stacked">Class Name</IonLabel>
                <IonInput
                  type="text"
                  name="class_name"
                  placeholder="Enter class name"
                  value={updatedInfo?.class_name}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.className && (
                <p className="text-red-500 text-xs mt-1">{errors.className}</p>
              )}
              <IonItem>
                <IonLabel position="stacked">Class Description</IonLabel>
                <IonInput
                  type="text"
                  name="class_description"
                  placeholder="Enter class description"
                  value={updatedInfo?.class_description}
                  onIonChange={handleChange}
                />
              </IonItem>
              {errors.classDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.classDescription}
                </p>
              )}
              <div className="flex justify-end">
                <IonButton
                  onClick={handleCancel}
                  fill="outline"
                  className="mr-2"
                >
                  Cancel
                </IonButton>
                <IonButton onClick={handleSave} fill="solid" color="primary">
                  Save
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        ) : (
          <div className="flex justify-between items-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {loading ? 'Loading...' : classData?.ClassName}
              </h1>
              <p className="text-gray-600">
                {loading ? 'Loading...' : classData?.ClassDescription}
              </p>
              {isTeacher && (
                <IonIcon
                  icon={createOutline}
                  size="large"
                  color="primary"
                  className="hover:transform hover:scale-110 cursor-pointer p-2"
                  onClick={handleEdit}
                ></IonIcon>
              )}
            </div>
            {isTeacher && (
              //  TODO: create-set isn't accepting the class ID right now, will be necessary for making a set for a specific class
              <div className="mb-8">
                <IonButton
                  routerLink={`/create-set`}
                  fill="solid"
                  color="primary"
                >
                  Create Flashcard Set
                </IonButton>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-row justify-between mb-6">
          <IonButton onClick={() => window.history.back()} fill="outline">
            <IonIcon slot="start" icon={arrowBackOutline} />
            Back
          </IonButton>
          {/* TODO: should only show for teachers */}
        </div>

        <IonSegment
          value={tab}
          onIonChange={(e) => setTab(e.detail.value as string)}
          className="w-full mb-6"
        >
          <IonSegmentButton value="flashcards">
            <IonIcon icon={bookOutline} className="mr-2" />
            <IonLabel>Flashcard Sets</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="leaderboard">
            <IonIcon icon={trophyOutline} className="mr-2" />
            <IonLabel>Leaderboard</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="students">
            <IonIcon icon={peopleOutline} className="mr-2" />
            <IonLabel>Students</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {tab === 'leaderboard' && (
          <>
            {loadingScores ? (
              <div className="flex justify-center items-center p-8">
                <IonSpinner name="circular" />
                <span className="ml-2">Calculating scores...</span>
              </div>
            ) : (
              <Leaderboard leaderboard={leaderboardData} />
            )}
          </>
        )}

        {tab === 'flashcards' && (
          <FlashcardCarousel
            flashcardSets={flashcardSets}
            currentCardIndex={currentCardIndex}
            setApi={setCarouselApi}
          />
        )}

        {tab === 'students' && (
          <div className="flex flex-col">
            <StudentList
              isTeacher={isTeacher}
              students={classUsers}
              onDeleteStudent={showDeleteStudentAlert}
            />
          </div>
        )}
      </div>

      {/* Delete Account Alert */}
      <IonAlert
        isOpen={showDeleteAlert.isOpen}
        onDidDismiss={() =>
          setShowDeleteAlert((prev) => ({
            ...prev,
            isOpen: false,
            studentId: null,
          }))
        }
        header="Confirm Deletion"
        message="Are you sure you want to delete this Student? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              setShowDeleteAlert((prev) => ({
                ...prev,
                isOpen: false,
                studentId: null,
              }));
            },
          },
          {
            text: 'Delete',
            handler: () => {
              // Add your delete account logic here
              handleDeleteStudent(showDeleteAlert.studentId);
              setShowDeleteAlert((prev) => ({
                ...prev,
                isOpen: false,
                studentId: null,
              }));
              console.log('Student deletion initiated');
            },
          },
        ]}
      />
      <Footer />
    </IonContent>
  );
};

export default ClassDetail;
