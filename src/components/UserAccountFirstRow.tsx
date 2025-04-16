import { EditableField } from '@/utils/EditableField';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import InfoRow from '@/utils/InfoRow';

const UserAccountFirstRow = (props) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Account Information Card */}
      <IonCard className="w-full md:w-1/2 rounded-lg border shadow-sm">
        <IonCardHeader className="p-6">
          <IonCardTitle className="text-xl font-semibold text-primary">
            Account Information
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="p-6 pt-0">
          {/* TODO: Make this into an EditingField component where you can pass whatever label or field you want. */}

          {props.isEditing ? (
            <div className="space-y-4">
              <EditableField
                label="First Name"
                name="first_name"
                value={props.updatedInfo?.first_name || ''}
                error={props.errors.first_name}
                onChange={props.handleChange}
              />
              <EditableField
                label="Last Name"
                name="last_name"
                value={props.updatedInfo?.last_name || ''}
                error={props.errors.last_name}
                onChange={props.handleChange}
              />
              <EditableField
                label="Username"
                name="username"
                value={props.updatedInfo?.username || ''}
                error={props.errors.username}
                onChange={props.handleChange}
              />
              <EditableField
                label="Email"
                name="email"
                value={props.updatedInfo?.email || ''}
                error={props.errors.email}
                onChange={props.handleChange}
              />
              <div className="mt-4 flex justify-end">
                <IonButton onClick={props.handleSave}>Save Changes</IonButton>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <InfoRow label="First Name" value={props.userInfo?.first_name} />
              <InfoRow label="Last Name" value={props.userInfo?.last_name} />
              <InfoRow label="Username" value={props.userInfo?.username} />
              <InfoRow label="Email" value={props.userInfo?.email} />
              <IonButton
                fill="outline"
                onClick={props.handleEdit}
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
            <InfoRow
              label="Account Created"
              value={props.userInfo?.created_at}
            />
            <InfoRow
              label="Login Streak"
              value={props.userInfo?.login_streak}
            />
            <InfoRow label="Classes Taken" value={props.userInfo?.numClasses} />
            <InfoRow
              label="Cards Mastered/Studied"
              value={`${props.userInfo?.cardsMastered} / ${props.userInfo?.cardsStudied}`}
            />
            <InfoRow
              label="Total Card Views"
              value={props.userInfo?.totalCardViews}
            />
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default UserAccountFirstRow;
