import { EditableField } from '@/utils/EditableField';
import InfoRow from '@/utils/InfoRow';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';

const UserAccountFirstRow = (props) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <IonCard className="md:w-1/2 rounded-lg border shadow-sm">
        <IonCardHeader className="p-6">
          <IonCardTitle className="text-xl font-rye font-semibold text-primary">
            Account Information
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="p-6 pt-0">
          {props.isEditing ? (
            <div className="space-y-4">
              <EditableField
                type="text"
                label="First Name"
                name="first_name"
                value={props.updatedInfo?.first_name || ''}
                error={props.errors.first_name}
                onChange={props.handleChange}
              />
              <EditableField
                type="text"
                label="Last Name"
                name="last_name"
                value={props.updatedInfo?.last_name || ''}
                error={props.errors.last_name}
                onChange={props.handleChange}
              />
              <EditableField
                type="text"
                label="Username"
                name="username"
                value={props.updatedInfo?.username || ''}
                error={props.errors.username}
                onChange={props.handleChange}
              />
              <EditableField
                type="email"
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
              <IonButton onClick={props.handleEdit} className="mt-4">
                <IonIcon slot="start" icon={createOutline} />
                Edit Info
              </IonButton>
            </div>
          )}
        </IonCardContent>
      </IonCard>

      <IonCard className="md:w-1/2 rounded-lg border shadow-sm">
        <IonCardHeader className="p-6">
          <IonCardTitle className="text-xl font-rye font-semibold text-primary">
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
            {/* <InfoRow
              label="Cards Mastered/Studied"
              value={`${props.userInfo?.cardsMastered} / ${props.userInfo?.cardsStudied}`}
            /> */}
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
