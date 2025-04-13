import { Navbar } from '@/components/Navbar';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonText,
  IonTextarea,
} from '@ionic/react';
import { useEffect, useState } from 'react';

type Class = {
  ID: number;
  ClassName: string;
  ClassDescription: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const CreateClass = () => {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  // const [isPrivate, setIsPrivate] = useState(false);
  // const [textToCopy, setTextToCopy] = useState('This is the text to be copied');
  // const [showToast, setShowToast] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);

  // const copyToClipboard = async () => {
  //   try {
  //     await navigator.clipboard.writeText(textToCopy);
  //     setShowToast(true);
  //   } catch (err) {
  //     console.error('Failed to copy text', err);
  //   }
  // };

  useEffect(() => {
    async function submitForm() {
      if (!buttonClicked) return;

      setLoading(true);
      setError(null);

      try {
        const data = await makeHttpCall<Class>(`${API_BASE}/api/classes`, {
          method: 'POST',
          headers: {
            class_name: formData.className,
            class_description: formData.description,
          },
        });

        console.log('Class created successfully:', data);

        setButtonClicked(false);

        setFormData({
          className: '',
          description: '',
        });

        setShowSuccess(true);
        setLoading(false);
      } catch (error) {
        setError(`Failed to create class: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (buttonClicked) {
      submitForm();
    }
  }, [buttonClicked, formData]);

  return (
    <IonContent>
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8">
        {/*<IonText color="warning">
          <p>
            Database only accepts a teacher ID of 12. <br />
            So I have not included an input for that, it will automatically be
            passed
          </p>
        </IonText>*/}
        {error && <div className="text-red-500 mt-2">{error}</div>}
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
          <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 mt-8">
            <IonButton
              color="success"
              disabled={loading}
              onClick={() => setButtonClicked(true)}
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
          <IonText>
            <p>Class created successfully!</p>
          </IonText>
        )}
      </div>
    </IonContent>
  );
};

export default CreateClass;
