import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import LoginStreakCard from './LoginStreakCard';

const UserAccountSecondRow = (props) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 py-6">
        <LoginStreakCard streak={props.streak} />
        <IonCard className="md:w-1/2 rounded-lg border shadow-sm">
          <IonCardHeader className="p-6">
            <IonCardTitle className="text-xl font-rye font-semibold text-primary">
              Account Options
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="p-6 pt-0">
            <div className="space-y-4">
              <IonSelect
                label="Theme"
                value={props.theme}
                onIonChange={(e) =>
                  props.setTheme(e.detail.value as 'light' | 'dark')
                }
                interface="popover"
                placeholder="Select Theme"
              >
                <IonSelectOption value="light">Light</IonSelectOption>
                <IonSelectOption value="dark">Dark</IonSelectOption>
              </IonSelect>
              <div className="flex justify-between items-center">
                <div className="mr-4">
                  <h4 className="text-sm font-medium text-black dark:text-white">
                    Change Your Password
                  </h4>
                  <p className="text-xs dark:text-gray-300">
                    Reset your account password.
                  </p>
                </div>
                <IonButton
                  color="primary"
                  onClick={() => props.setShowPasswordAlert(true)}
                >
                  Change Password
                </IonButton>
              </div>
              <div className="flex justify-between items-center">
                <div className="mr-4">
                  <h4 className="text-sm font-medium text-black dark:text-white">
                    Delete Your Account
                  </h4>
                  <p className="text-xs dark:text-gray-300">
                    This will delete all account data and can't be undone.
                  </p>
                </div>
                <IonButton
                  color="danger"
                  onClick={() => props.setShowDeleteAlert(true)}
                >
                  Delete Account
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>

      <IonAlert
        isOpen={props.showPasswordAlert}
        onDidDismiss={() => props.setShowPasswordAlert(false)}
        header="Change Password"
        inputs={[
          {
            name: 'oldPassword',
            type: 'password',
            placeholder: 'Old Password',
          },
          {
            name: 'newPassword',
            type: 'password',
            placeholder: 'New Password',
          },
          {
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirm New Password',
          },
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Save',
            handler: (data) => {
              if (data.newPassword !== data.confirmPassword) {
                props.presentToast({
                  message: 'Passwords do not match',
                  duration: 2000,
                  color: 'danger',
                });
                return true;
              }

              console.log('Password changed');
              return true;
            },
          },
        ]}
      />

      <IonAlert
        isOpen={props.showDeleteAlert}
        onDidDismiss={() => props.setShowDeleteAlert(false)}
        header="Confirm Deletion"
        message="Are you sure you want to delete your account? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
          {
            text: 'Delete',
            handler: () => {
              console.log('Account deleted');
            },
          },
        ]}
      />
    </>
  );
};

export default UserAccountSecondRow;
