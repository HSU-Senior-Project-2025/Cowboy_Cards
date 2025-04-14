import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner,
  useIonToast,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import UserAccountFirstRow from '../components/UserAccountFirstRow';
import UserAccountSecondRow from '../components/UserAccountSecondRow';

type User = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  login_streak: number;
  created_at: string;
  numClasses: number;
  cardsStudied: number;
  cardsMastered: number;
  totalCardViews: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const UserAccount = () => {
  const { theme, setTheme } = useTheme();
  const [userInfo, setUserInfo] = useState<User>();
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState<string | null>(null);

  // const [classHistory, setClassHistory] = useState([
  //   {
  //     id: 1,
  //     title: "Introduction to Computer Science",
  //     startDate: "2024-01-15",
  //     endDate: "2024-05-30",
  //     link: "/class/1"
  //   },
  //   {
  //     id: 2,
  //     title: "Data Structures and Algorithms",
  //     startDate: "2023-09-01",
  //     endDate: "2023-12-15",
  //     link: "/class/2"
  //   },
  //   {
  //     id: 3,
  //     title: "Web Development Fundamentals",
  //     startDate: "2023-06-01",
  //     endDate: "2023-08-15",
  //     link: "/class/3"
  //   }
  // ]);

  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(userInfo);

  const toggleClassDetails = (classID: number) => {
    setExpandedClass(expandedClass === classID ? null : classID);
  };

  const handleEdit = () => {
    setUpdatedInfo(userInfo);
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Define the fields that can be updated
    const fieldsToUpdate = ['first_name', 'last_name', 'username', 'email'];

    try {
      // Identify which fields have changed and create API call promises
      const updatePromises = fieldsToUpdate
        .filter((field) => updatedInfo[field] !== userInfo[field]) // Only include modified fields
        .map((field) =>
          makeHttpCall<User>(`${API_BASE}/api/users/${field}`, {
            method: 'PUT',
            headers: {
              [field]: updatedInfo[field], // New value for the field
            },
          })
        );

      // Wait for all API calls to complete successfully
      await Promise.all(updatePromises);
      // If all updates succeed, update the local state and exit editing mode
      setUserInfo(updatedInfo);
      setIsEditing(false);
    } catch (error) {
      // Log the error and notify the user if any update fails
      console.error(error);
      alert('Failed to update some fields. Please try again.');
    }
  };

  // Basic validation before submitting
  const validateForm = () => {
    const newErrors: {
      first_name?: string;
      last_name?: string;
      email?: string;
      username?: string;
    } = {};
    let isValid = true;

    // First name validation
    if (!updatedInfo.first_name) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }

    // Last name validation
    if (!updatedInfo.last_name) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }

    // Email validation
    if (!updatedInfo.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(updatedInfo.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Username validation
    if (!updatedInfo.username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    // Trim whitespace from the input values
    updatedInfo.first_name = updatedInfo.first_name.trim();
    updatedInfo.last_name = updatedInfo.last_name.trim();
    updatedInfo.email = updatedInfo.email.trim();
    updatedInfo.username = updatedInfo.username.trim();

    setErrors(newErrors);
    return isValid;
  };

  // Form validation
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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await makeHttpCall<User>(`${API_BASE}/api/users/`, {
          method: 'GET',
          headers: {},
        });
        setUserInfo(data);
        setUpdatedInfo(data);
        console.log('data', data as User);
      } catch (error) {
        console.log(`Failed to fetch User Data: ${error.message}`);
        setError(`Failed to fetch User Data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // cleanup func not necessary here
    // https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/
  }, []);

  // Hook for showing toast messages, used for password change
  const [presentToast] = useIonToast();

  return (
    <IonContent>
      <Navbar />

      <div id="main-content" className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-xl font-semibold text-primary">
            Welcome back, {userInfo?.username || 'User'}!
          </p>
        </div>

        {/* Back Button */}
        <IonButton
          onClick={() => window.history.back()}
          fill="outline"
          className="mb-6"
        >
          <IonIcon slot="start" icon={arrowBackOutline} />
          Back
        </IonButton>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <IonSpinner name="circular" />
            <span className="ml-2">Loading account details...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-red-500 text-center p-4 border border-red-500 rounded-md">
            {error}
          </div>
        )}

        {/* Content: Only show if not loading and no error */}
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
  );
};

export default UserAccount;
