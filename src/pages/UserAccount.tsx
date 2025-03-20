import { useState, useEffect } from 'react';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonAlert,
} from '@ionic/react';
import {
  arrowBackOutline,
  createOutline,
  chevronDownOutline,
  chevronUpOutline,
} from 'ionicons/icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Navbar, NavbarTitle } from '@/components/navbar';

const UserAccount = () => {
  const { theme, setTheme } = useTheme();
  const [userInfo, setUserInfo] = useState({
    username: 'john_doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    firstname: 'John',
    lastname: 'Doe',
  });

  const [stats, setStats] = useState({
    accountCreated: '1-01-2022',
    numClasses: 2,
    cardsShown: 120,
    cardsMastered: 85,
    timeInApp: '5 hours 30 minutes',
  });

  const [classHistory, setClassHistory] = useState([
    {
      id: 1,
      title: 'Biology 101',
      startDate: '2023-01-15',
      endDate: '2023-05-20',
      link: '#',
    },
    {
      id: 2,
      title: 'Chemistry 201',
      startDate: '2022-08-10',
      endDate: '2022-12-15',
      link: '#',
    },
    {
      id: 3,
      title: 'Chemistry 202',
      startDate: '2023-08-10',
      endDate: '2023-12-15',
      link: '#',
    },
  ]);

  const [expandedClass, setExpandedClass] = useState<number | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(userInfo);

  const toggleClassDetails = (classId: number) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserInfo(updatedInfo);
    setIsEditing(false);
  };

  const handleChange = (e: any) => {
    const { name } = e.target;
    const value = e.detail.value;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Mock API call for fetching user stats
  }, []);

  return (
    <IonContent className="ion-padding">
      <Navbar>
        <NavbarTitle>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">
            User Dashboard
          </div>
        </NavbarTitle>
      </Navbar>
      <div className="container mx-auto px-4 py-8">
      
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">
            User Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {userInfo.username}!</p>
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

        {/* First Row: Account Information and Stats */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Account Information Card */}
          <IonCard className="w-full md:w-1/2 rounded-lg border shadow-sm">
            <IonCardHeader className="p-6">
              <IonCardTitle className="text-xl font-semibold text-primary">
                Account Information
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-6 pt-0">
              {isEditing ? (
                <div className="space-y-4">
                  <IonItem>
                    <IonLabel position="stacked">First Name</IonLabel>
                    <IonInput
                      type="text"
                      name="firstname"
                      value={updatedInfo.firstname}
                      onIonChange={handleChange}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Last Name</IonLabel>
                    <IonInput
                      type="text"
                      name="lastname"
                      value={updatedInfo.lastname}
                      onIonChange={handleChange}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Username</IonLabel>
                    <IonInput
                      type="text"
                      name="username"
                      value={updatedInfo.username}
                      onIonChange={handleChange}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                      type="email"
                      name="email"
                      value={updatedInfo.email}
                      onIonChange={handleChange}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Phone Number</IonLabel>
                    <IonInput
                      type="text"
                      name="phoneNumber"
                      value={updatedInfo.phoneNumber}
                      onIonChange={handleChange}
                    />
                  </IonItem>
                  <div className="mt-4 flex justify-end">
                    <IonButton onClick={handleSave}>Save Changes</IonButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">First Name: </span>
                    {userInfo.firstname}
                  </div>
                  <div>
                    <span className="font-medium">Last Name: </span>
                    {userInfo.lastname}
                  </div>
                  <div>
                    <span className="font-medium">Username: </span>
                    {userInfo.username}
                  </div>
                  <div>
                    <span className="font-medium">Email: </span>
                    {userInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone Number: </span>
                    {userInfo.phoneNumber}
                  </div>
                  <IonButton
                    fill="outline"
                    onClick={handleEdit}
                    className="mt-4"
                  >
                    <IonIcon slot="start" icon={createOutline} />
                    Edit Info
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>

          {/* Account Stats Card */}
          <IonCard className="w-full md:w-1/2 rounded-lg border shadow-sm">
            <IonCardHeader className="p-6">
              <IonCardTitle className="text-xl font-semibold text-primary">
                Account Stats
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-6 pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Account Created:</span>
                  <span>{stats.accountCreated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Classes Taken:</span>
                  <span>{stats.numClasses}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cards Shown:</span>
                  <span>{stats.cardsShown}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cards Mastered:</span>
                  <span>{stats.cardsMastered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Time in App:</span>
                  <span>{stats.timeInApp}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Second Row: Class History and Account Options */}
        <div className="flex flex-col md:flex-row gap-6 py-6">
          {/* Class History Card */}
          <IonCard className="w-full md:w-1/2 rounded-lg border shadow-sm">
            <IonCardHeader className="p-6">
              <IonCardTitle className="text-xl font-semibold text-primary">
                Class History
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-6 pt-0">
              <IonList>
                {classHistory.map((cls) => (
                  <div key={cls.id}>
                    <IonItem button onClick={() => toggleClassDetails(cls.id)}>
                      <IonLabel>{cls.title}</IonLabel>
                      <IonIcon
                        icon={expandedClass === cls.id ? chevronUpOutline : chevronDownOutline}
                        slot="end"
                      />
                    </IonItem>
                    {expandedClass === cls.id && (
                      <IonItem lines="none">
                        <div className="pl-4 text-gray-700">
                          <p>
                            <span className="font-medium">Date Started:</span> {cls.startDate}
                          </p>
                          <p>
                            <span className="font-medium">Date Ended:</span> {cls.endDate}
                          </p>
                          <a href={cls.link} className="text-primary underline">
                            Go to Class Page
                          </a>
                        </div>
                      </IonItem>
                    )}
                  </div>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Account Options Card */}
          <IonCard className="w-full md:w-1/2 rounded-lg border shadow-sm">
            <IonCardHeader className="p-6">
              <IonCardTitle className="text-xl font-semibold text-primary">
                Account Options
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="p-6 pt-0">
              <div className="space-y-4">
                <IonItem>
                  <IonLabel>Theme</IonLabel>
                  <IonSelect
                    value={theme}
                    onIonChange={(e) => setTheme(e.detail.value as 'light' | 'dark')}
                  >
                    <IonSelectOption value="light">Light</IonSelectOption>
                    <IonSelectOption value="dark">Dark</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Change Your Password</p>
                    <p className="text-xs text-gray-600">
                      Reset your account password.
                    </p>
                  </div>
                  <IonButton onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </IonButton>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Delete Your Account</p>
                    <p className="text-xs text-gray-600">
                      This will delete all account data and can't be undone.
                    </p>
                  </div>
                  <IonButton
                    color="danger"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    Delete Account
                  </IonButton>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Password Change Modal */}
        <IonModal isOpen={showPasswordModal} onDidDismiss={() => setShowPasswordModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Change Password</IonTitle>
              <IonButton slot="end" onClick={() => setShowPasswordModal(false)}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Old Password</IonLabel>
              <IonInput type="password" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">New Password</IonLabel>
              <IonInput type="password" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Confirm New Password</IonLabel>
              <IonInput type="password" />
            </IonItem>
            <div className="flex justify-end space-x-2 mt-4">
              <IonButton onClick={() => setShowPasswordModal(false)}>Cancel</IonButton>
              <IonButton onClick={() => setShowPasswordModal(false)}>Save</IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Delete Account Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm Deletion"
          message="Are you sure you want to delete your account? This action cannot be undone."
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => {
                console.log("Cancel clicked");
              },
            },
            {
              text: "Delete",
              handler: () => {
                // Add your delete account logic here
                console.log("Account deleted");
              },
            },
          ]}
        />
      </div>
    </IonContent>
  );
};

export default UserAccount;