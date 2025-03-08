import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit2, ChevronDown, ChevronUp } from 'lucide-react';

const UserAccount = () => {
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

  const [expandedClass, setExpandedClass] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const toggleClassDetails = (classId) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState(userInfo);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserInfo(updatedInfo);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Mock API call for fetching user stats
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">
            User Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {userInfo.username}!</p>
        </div>

        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Account Information
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={updatedInfo.firstname}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={updatedInfo.lastname}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={updatedInfo.username}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updatedInfo.email}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={updatedInfo.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-lg w-full"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className="font-medium">First Name: </span>
                  {userInfo.firstname}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Last Name: </span>
                  {userInfo.lastname}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Username: </span>
                  {userInfo.username}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Email: </span>
                  {userInfo.email}
                </div>
                <div className="mb-4">
                  <span className="font-medium">Phone Number: </span>
                  {userInfo.phoneNumber}
                </div>
                <Button variant="outline" onClick={handleEdit} className="mt-4">
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Info
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Account Stats
            </h2>
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
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-6 py-6">
          <Card className="p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Class History
            </h2>
            <div className="space-y-4">
              {classHistory.map((cls) => (
                <div key={cls.id} className="border-b pb-2">
                  <button
                    className="w-full flex justify-between items-center text-left text-lg font-medium"
                    onClick={() => toggleClassDetails(cls.id)}
                  >
                    {cls.title}
                    {expandedClass === cls.id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {expandedClass === cls.id && (
                    <div className="mt-2 pl-4 text-gray-700">
                      <p>
                        <span className="font-medium">Date Started:</span>{' '}
                        {cls.startDate}
                      </p>
                      <p>
                        <span className="font-medium">Date Ended:</span>{' '}
                        {cls.endDate}
                      </p>
                      <a href={cls.link} className="text-primary underline">
                        Go to Class Page
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Account Options
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Theme</label>
                <select className="mt-1 p-2 border rounded-lg w-full">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <label className="block text-sm font-medium">
                Account Settings
              </label>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Change Your Password</p>
                  <p className="text-xs text-gray-600">
                    Reset your account password.
                  </p>
                </div>
                <Button onClick={() => setShowPasswordModal(true)}>
                  Change Password
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Delete Your Account</p>
                  <p className="text-xs text-gray-600">
                    This will delete all account data and can't be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <label className="block text-sm font-medium">Old Password</label>
              <input
                type="password"
                className="mt-1 p-2 border rounded-lg w-full mb-3"
              />
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                className="mt-1 p-2 border rounded-lg w-full mb-3"
              />
              <label className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                className="mt-1 p-2 border rounded-lg w-full mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowPasswordModal(false)}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    alert('Account Deleted');
                    setShowDeleteModal(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
