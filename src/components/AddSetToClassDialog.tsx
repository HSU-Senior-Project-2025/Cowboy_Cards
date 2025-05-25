import { useAddSetToClass, useUserSets } from '@/hooks/useClassQueries';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useEffect, useState } from 'react';

const AddSetToClassDialog = (props) => {
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [presentToast] = useIonToast();

  // Use React Query hooks
  const {
    data: userSets = [],
    isLoading: isLoadingUserSets,
    error: userSetsError,
  } = useUserSets();

  const addSetMutation = useAddSetToClass();

  // Filter sets that are not already in the class
  const availableSets = Array.isArray(userSets)
    ? userSets.filter((set) =>
        !Array.isArray(props.existingSetIds)
          ? true
          : !props.existingSetIds.includes(set.SetID)
      )
    : [];

  // Reset selected set when dialog opens/closes
  useEffect(() => {
    if (!props.isOpen) {
      setSelectedSetId(null);
    }
  }, [props.isOpen]);

  const handleAddSet = async () => {
    if (!selectedSetId || !props.classId) {
      presentToast({
        message: 'Please select a set to add.',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    try {
      await addSetMutation.mutateAsync({
        classId: props.classId,
        setId: selectedSetId,
      });

      presentToast({
        message: 'Set added successfully!',
        duration: 2000,
        color: 'success',
      });

      props.onDidDismiss();
    } catch (err) {
      const errorMessage = `Failed to add set: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`;

      presentToast({
        message: errorMessage,
        duration: 3000,
        color: 'danger',
      });
    }
  };

  const isLoading = isLoadingUserSets || addSetMutation.isPending;
  const error = userSetsError || addSetMutation.error;

  return (
    <IonModal isOpen={props.isOpen} onDidDismiss={props.onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Set to Class</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={props.onDidDismiss} color="medium">
              Cancel
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoading && !availableSets?.length ? (
          <div className="flex justify-center items-center h-full">
            <IonSpinner name="circular" />
            <span className="ml-2">Loading your sets...</span>
          </div>
        ) : error ? (
          <IonText color="danger">
            <p>{error instanceof Error ? error.message : String(error)}</p>
          </IonText>
        ) : availableSets?.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            You have no available sets to add to this class. Create a new set or
            check if all your sets are already added.
          </p>
        ) : (
          <IonRadioGroup
            value={selectedSetId}
            onIonChange={(e) => {
              setSelectedSetId(Number(e.detail.value));
            }}
          >
            <IonList>
              {availableSets?.map((set) => (
                <IonItem key={set.SetID}>
                  <IonRadio slot="start" key={set.SetID} value={set.SetID} />
                  <IonLabel>
                    <h2>{set.SetName}</h2>
                    <p className="text-sm text-gray-500">
                      {set.SetDescription}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonRadioGroup>
        )}

        {error && availableSets?.length > 0 && (
          <IonText color="danger" className="block mt-4">
            <p>{error instanceof Error ? error.message : String(error)}</p>
          </IonText>
        )}
      </IonContent>
      {!isLoading && availableSets?.length > 0 && (
        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={handleAddSet}
            disabled={!selectedSetId || addSetMutation.isPending}
            className="ion-margin-bottom"
          >
            {addSetMutation.isPending ? (
              <IonSpinner name="dots" />
            ) : (
              'Add Selected Set'
            )}
          </IonButton>
        </div>
      )}
    </IonModal>
  );
};

export default AddSetToClassDialog;
