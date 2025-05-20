import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import type { User } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonSpinner,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import UserAccountFirstRow from '../components/UserAccountFirstRow';
import UserAccountSecondRow from '../components/UserAccountSecondRow';

const UserAccount = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [userInfo, setUserInfo] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(userInfo);
  const [presentToast] = useIonToast();

  const toggleClassDetails = (classID: number) => {
    setExpandedClass(expandedClass === classID ? null : classID);
  };

  const handleEdit = () => {
    setUpdatedInfo(userInfo);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const fieldsToUpdate = ['first_name', 'last_name', 'username', 'email'];

    try {
      const updatePromises = fieldsToUpdate
        ?.filter((field) => updatedInfo[field] !== userInfo[field])
        ?.map((field) =>
          makeHttpCall<User>(`/api/users/${field}`, {
            method: 'PUT',
            headers: {
              [field]: updatedInfo[field],
            },
          })
        );

      await Promise.all(updatePromises);
      setUserInfo(updatedInfo);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      presentToast({
        message: 'Failed to update some fields. Please try again.',
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const validateForm = () => {
    const newErrors: {
      first_name?: string;
      last_name?: string;
      email?: string;
      username?: string;
    } = {};
    let isValid = true;

    if (!updatedInfo.first_name) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }

    if (!updatedInfo.last_name) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }

    if (!updatedInfo.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(updatedInfo.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!updatedInfo.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    updatedInfo.first_name = updatedInfo.first_name.trim();
    updatedInfo.last_name = updatedInfo.last_name.trim();
    updatedInfo.email = updatedInfo.email.trim();
    updatedInfo.username = updatedInfo.username.trim();

    setErrors(newErrors);
    return isValid;
  };

  const [errors, setErrors] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
    username?: string;
    general?: string;
  }>({});

  const handleChange = (e: CustomEvent) => {
    const { name } = e.target as HTMLIonInputElement;
    const value = e.detail.value;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await makeHttpCall<User>(`/api/users/`);
      setUserInfo(data);
      setUpdatedInfo(data);
      console.log('data', data as User);
    } catch (error) {
      console.log(`Failed to fetch User Data: ${error.message}`);
      setError(`Failed to fetch User Data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useIonViewWillEnter(() => {
    console.log('UserAccount will enter, fetching data...');
    fetchUserData();
  });

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div id="main-content" className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <p className="text-xl font-rye font-semibold text-primary">
              {loading
                ? 'Loading...'
                : `Welcome back, ${userInfo?.username || 'User'}!`}
            </p>
          </div>

          <IonButton onClick={() => navigate(-1)} className="mb-6">
            <IonIcon slot="start" icon={arrowBackOutline} />
            Back
          </IonButton>

          {loading && (
            <div className="flex justify-center items-center p-8">
              <IonSpinner name="circular" />
              <span className="ml-2">Loading account details...</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-red-500 text-center p-4 border border-red-500 rounded-md">
              {error}
            </div>
          )}

          {!loading && !error && userInfo && (
            <>
              <UserAccountFirstRow
                isEditing={isEditing}
                errors={errors}
                handleChange={handleChange}
                handleSave={handleSave}
                updatedInfo={updatedInfo}
                userInfo={userInfo}
                handleEdit={handleEdit}
              />
              <UserAccountSecondRow
                streak={userInfo?.login_streak ?? 0}
                isEditing={isEditing}
                errors={errors}
                handleChange={handleChange}
                handleSave={handleSave}
                updatedInfo={updatedInfo}
                userInfo={userInfo}
                expandedClass={expandedClass}
                toggleClassDetails={toggleClassDetails}
                showPasswordAlert={showPasswordAlert}
                setShowPasswordAlert={setShowPasswordAlert}
                showDeleteAlert={showDeleteAlert}
                setShowDeleteAlert={setShowDeleteAlert}
                theme={theme}
                setTheme={setTheme}
                presentToast={presentToast}
              />
            </>
          )}
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default UserAccount;
