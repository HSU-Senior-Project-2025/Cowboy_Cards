import AddSetToClassDialog from '@/components/AddSetToClassDialog';
import ClassDetailControls from '@/components/ClassDetailControls';
import ClassDetailHeader from '@/components/ClassDetailHeader';
import ClassDetailTabs from '@/components/ClassDetailTabs';
import FlashcardSetList from '@/components/FlashcardSetList';
import { Footer } from '@/components/Footer';
import LeaderboardTab from '@/components/LeaderboardTab';
import { Navbar } from '@/components/Navbar';
import StudentTab from '@/components/StudentTab';
import { type CarouselApi } from '@/components/ui/carousel';
import {
  useClassDetails,
  useClassLeaderboard,
  useClassMembers,
  useClassSets,
  useDeleteStudent,
  useUpdateClass,
} from '@/hooks/useClassQueries';
import { IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [tab, setTab] = useState('flashcards');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    class_name: '',
    class_description: '',
  });
  const [showAddSetDialog, setShowAddSetDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    className?: string;
    classDescription?: string;
    general?: string;
  }>({});

  // React Query hooks
  const {
    data: classData,
    isLoading: isLoadingClass,
    error: classError,
  } = useClassDetails(id!);
  const {
    data: flashcardSets = [],
    isLoading: isLoadingSets,
    error: setsError,
  } = useClassSets(id!);
  const {
    data: classUsers = [],
    isLoading: isLoadingUsers,
    error: usersError,
  } = useClassMembers(id!);
  const {
    data: leaderboardData = [],
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useClassLeaderboard(id!);

  const updateClassMutation = useUpdateClass();
  const deleteStudentMutation = useDeleteStudent(id!);

  const isTeacher = classData?.Role === 'teacher';

  const handleEdit = () => {
    setUpdatedInfo({
      class_name: classData?.ClassName || '',
      class_description: classData?.ClassDescription || '',
    });
    setIsEditing(true);
  };

  const validateForm = () => {
    const newErrors: { className?: string; classDescription?: string } = {};
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
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await Promise.all([
        updateClassMutation.mutateAsync({
          id: id!,
          field: 'class_name',
          value: updatedInfo.class_name,
        }),
        updateClassMutation.mutateAsync({
          id: id!,
          field: 'class_description',
          value: updatedInfo.class_description,
        }),
      ]);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update some fields. Please try again.');
    }
  };

  const handleChange = (e: CustomEvent) => {
    const { name } = e.target as HTMLInputElement;
    const value = e.detail.value;
    setUpdatedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDeleteStudent = async (studentId: number | null) => {
    if (studentId === null) return;
    try {
      await deleteStudentMutation.mutateAsync(studentId);
    } catch (error) {
      alert('Error deleting student');
    }
  };

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on('select', () => {
      setCurrentCardIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Error and loading handling
  const queryLoading =
    isLoadingClass || isLoadingSets || isLoadingUsers || isLoadingLeaderboard;
  const queryError = classError || setsError || usersError || leaderboardError;

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {queryError && (
            <div className="text-red-500">{queryError.message}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <ClassDetailHeader
              loading={queryLoading}
              classData={classData}
              isEditing={isEditing}
              isTeacher={isTeacher}
              updatedInfo={updatedInfo}
              formErrors={formErrors}
            />
            <ClassDetailControls
              isTeacher={isTeacher}
              isEditing={isEditing}
              handleEdit={handleEdit}
              handleChange={handleChange}
              handleSave={handleSave}
              handleCancel={handleCancel}
              classId={id}
              onAddSetClick={() => setShowAddSetDialog(true)}
            />
          </div>
          <ClassDetailTabs selectedTab={tab} onTabChange={setTab} />
          {tab === 'leaderboard' && (
            <LeaderboardTab
              leaderboardData={leaderboardData}
              loadingScores={isLoadingLeaderboard}
            />
          )}
          {tab === 'flashcards' && (
            <FlashcardSetList
              flashcardSets={flashcardSets}
              currentCardIndex={currentCardIndex}
              setApi={setCarouselApi}
              loading={queryLoading}
              classId={id}
            />
          )}
          {tab === 'students' && (
            <StudentTab
              isTeacher={isTeacher}
              students={classUsers}
              handleActualDelete={handleDeleteStudent}
            />
          )}
        </div>
        <AddSetToClassDialog
          isOpen={showAddSetDialog}
          onDidDismiss={() => setShowAddSetDialog(false)}
          classId={id}
          existingSetIds={flashcardSets?.map((set) => set.ID) || []}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default ClassDetail;
