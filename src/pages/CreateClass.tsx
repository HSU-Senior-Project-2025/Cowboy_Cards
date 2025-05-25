import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import type { NewClass } from '@/types/globalTypes';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonPage,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const CreateClass = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const submitForm = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await makeHttpCall<NewClass>(`/api/classes`, {
        method: 'POST',
        headers: {
          class_name: formData.className,
          class_description: formData.description,
        },
      });

      setFormData({
        className: '',
        description: '',
      });

      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['userClasses'] });
    } catch (error) {
      setError(`Failed to create class: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <Navbar />
      <IonContent>
        <div
          id="main-content"
          className="container mx-auto px-4 py-8 max-w-4xl"
        >
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <h1 className="text-4xl tracking-wide font-bold font-smokum mb-6">
            Create New Class
          </h1>
          <form>
            <IonCard className="mb-6 rounded-lg border shadow-sm">
              <IonCardContent>
                <IonTextarea
                  placeholder="Enter Class Name"
                  value={formData.className}
                  onIonChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      className: e.detail.value || '',
                    }))
                  }
                  rows={1}
                  autoGrow
                  className="w-full text-xl font-bold mb-2"
                  style={{ resize: 'none' }}
                />
                <IonTextarea
                  placeholder="Enter Class Description"
                  value={formData.description}
                  onIonChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.detail.value || '',
                    }))
                  }
                  rows={1}
                  autoGrow
                  className="w-full text-base mt-4"
                  style={{ resize: 'none' }}
                />
              </IonCardContent>
              {/* <IonItem>
              
              Public/Private will not be in MVP

              <IonCheckbox
                labelPlacement="start"
                justify="start"
                checked={isPrivate}
                onIonChange={(e) => {
                  setIsPrivate(e.detail.checked);
                }}
              >
                Private
              </IonCheckbox>
              <IonRadioGroup
                onIonChange={(e) => {
                  const value = e.detail.value;
                  setIsPrivate(value === 'private');
                  setFormData((prev) => ({
                    ...prev,
                    joinCode: value === 'private' ? crypto.randomUUID() : '',
                  }));
                }}
              >
                <IonRadio value="public">Public</IonRadio>
                <IonRadio value="private">Private</IonRadio>
              </IonRadioGroup>
            </IonItem> */}
            </IonCard>
            <div className="flex justify-center">
              <IonButton
                color="primary"
                className="rounded-lg shadow-sm w-full md:w-auto"
                onClick={submitForm}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Class'}
              </IonButton>
            </div>
            {/* 
          {showSuccess && (
            <IonText>
              {isPrivate && (
                <p>
                  Class created successfully! Please save this join code: <br />
                  <b>{lastJoinCode}</b>
                </p>
              )}
              {!isPrivate && <p>Class created successfully!</p>}
              <IonButton onClick={copyToClipboard}>Copy to Clipboard</IonButton>
              <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message="Text copied to clipboard!"
                duration={2000}
              />
            </IonText>
          )} */}
          </form>
          {showSuccess && (
            <IonToast
              isOpen={showSuccess}
              color="success"
              onDidDismiss={() => setShowSuccess(false)}
              message="Class created successfully!"
              duration={2000}
            />
          )}
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateClass;
