import { Navbar } from '@/components/navbar';
import { makeHttpCall } from '@/utils/makeHttpCall';
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonText,
  IonTextarea,
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type FlashcardSet = {
  ID: number;
  SetName: string;
  SetDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
};

const CreateSet = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<
    { id?: number; front: string; back: string }[]
  >([{ front: '', back: '' }]);
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCards = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/flashcards/list`, {
            method: 'GET',
            headers: {
              set_id: id,
            },
          });
          if (!res.ok) throw new Error('Failed to fetch flashcards');
          const data = await res.json();
          console.log(data);
          const cardsData = Array.isArray(data) ? data : [];
          if (cardsData.length === 0) {
            setCards([{ front: '', back: '' }]); // ensure at least one blank card
          } else {
            setCards(
              cardsData.map((card: any) => ({
                id: card.ID, // Map the ID from API to the state
                front: card.Front, // Map the Front from API to the state
                back: card.Back, // Map the Back from API to the state
              }))
            );
          }
        } catch (error) {
          console.error('Error fetching flashcards:', error);
        }
      };
      fetchCards();

      const fetchSet = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/flashcards/sets/`, {
            method: 'GET',
            headers: {
              id: id,
            },
          });
          if (!res.ok) {
            history.push('/create-set');
            return;
          }
          const data = await res.json();
          console.log(data);
          setTitle(data.SetName);
          setDescription(data.SetDescription);
        } catch (error) {
          console.error('Error fetching flashcard set', error);
        }
      };

      fetchSet();
    }
  }, [id, history]);

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, field: string, value: string) => {
    setCards(
      cards.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const saveSet = async () => {
    const newErrors = { title: '', description: '' };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const cleanedCards = cards.filter(
      (card) => card.front.trim() !== '' || card.back.trim() !== ''
    );

    if (id) {
      try {
        await fetch(`${API_BASE}/api/flashcards/sets/set_name`, {
          method: 'PUT',
          headers: {
            id: id,
            set_name: title,
          },
        });
      } catch (error) {
        console.error('Error saving flashcard set:', error);
        alert('Failed to save flashcard set.');
      }
      try {
        await fetch(`${API_BASE}/api/flashcards/sets/set_description`, {
          method: 'PUT',
          headers: {
            id: id,
            set_description: description,
          },
        });
      } catch (error) {
        console.error('Error saving flashcard set:', error);
        alert('Failed to save flashcard set.');
      }

      const res = await fetch(`${API_BASE}/api/flashcards/list`, {
        method: 'GET',
        headers: {
          set_id: id,
        },
      });
      let existingCards = await res.json();
      if (!Array.isArray(existingCards)) {
        existingCards = [];
      }

      for (const card of cleanedCards) {
        if (card.id) {
          await fetch(`${API_BASE}/api/flashcards/front`, {
            method: 'PUT',
            headers: {
              id: card.id.toString(),
              front: card.front,
            },
          });
          await fetch(`${API_BASE}/api/flashcards/back`, {
            method: 'PUT',
            headers: {
              id: card.id.toString(),
              back: card.back,
            },
          });
        } else {
          await fetch(`${API_BASE}/api/flashcards`, {
            method: 'POST',
            headers: {
              front: card.front.trim(),
              back: card.back.trim(),
              set_id: id.toString(),
            },
          });
        }
      }
      history.push(`/flashcards/${id}`);
    } else {
      try {
        // 1. Create the set
        const setResponse = await fetch(`${API_BASE}/flashcards/sets/`, {
          method: 'POST',
          headers: {
            set_name: title,
            set_description: description,
          },
        });

        if (!setResponse.ok) throw new Error('Failed to create set');
        const setData = await setResponse.json();
        const setId = setData.ID;

        // 2. Create flashcards
        for (const card of cleanedCards) {
          await fetch(`${API_BASE}/flashcards`, {
            method: 'POST',
            headers: {
              front: card.front,
              back: card.back,
              set_id: setId.toString(),
            },
          });
        }

        // ✅ Navigate instead of alert
        history.push(`/flashcards/${setId}`);
      } catch (error) {
        console.error('Error saving flashcard set:', error);
        alert('Failed to save flashcard set.');
      }
    }
  };

  const deleteSet = () => {
    setTitle('');
    setDescription('');
    setCards([{ front: '', back: '' }]);
    setErrors({ title: '', description: '' });
    console.log('Flashcard set deleted');
  };

  const saveSet2 = async () => {
    setLoading(true);
    setError(null);
    const newErrors = { title: '', description: '' };
    let hasError = false;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const cleanedCards = cards.filter(
      (card) => card.front.trim() !== '' || card.back.trim() !== ''
    );

    try {
      // 1. Create the set
      const setResponse = await makeHttpCall<FlashcardSet>(
        `${API_BASE}/api/flashcards/sets/`,
        {
          method: 'POST',
          headers: {
            set_name: title,
            set_description: description,
          },
        }
      );

      const setId = setResponse.ID;

      // 2. Create flashcards
      for (const card of cleanedCards) {
        await makeHttpCall(`${API_BASE}/api/flashcards`, {
          method: 'POST',
          headers: {
            front: card.front,
            back: card.back,
            set_id: setId.toString(),
          },
        });
      }
      setLoading(false);
      // ✅ Navigate instead of alert
      history.push(`/flashcards/${setId}`);
    } catch (error) {
      console.error('Error saving flashcard set:', error);
      setError(`Failed to save flashcard set: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonContent className="ion-padding">
      <Navbar />
      <div id="main-content" className="container mx-auto px-4 py-8 max-w-4xl">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <h1 className="text-3xl font-bold mb-6">Create New Flashcard Set</h1>

        {/* Title & Description inputs */}
        <IonCard className="mb-6 rounded-lg border shadow-sm">
          <IonCardContent>
            <IonTextarea
              placeholder="Enter set title"
              value={title}
              onIonChange={(e) => setTitle(e.detail.value!)}
              rows={1}
              autoGrow
              className="w-full text-xl font-bold mb-2"
              style={{ resize: 'none' }}
            />
            {errors.title && (
              <IonText color="danger">
                <p className="text-sm mt-1">{errors.title}</p>
              </IonText>
            )}

            <IonTextarea
              placeholder="Enter set description"
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
              rows={1}
              autoGrow
              className="w-full text-base mt-4"
              style={{ resize: 'none' }}
            />
            {errors.description && (
              <IonText color="danger">
                <p className="text-sm mt-1">{errors.description}</p>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* Flashcard Inputs */}
        {cards.map((card, index) => (
          <IonCard key={index} className="mb-6 rounded-lg border shadow-sm">
            <IonCardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-semibold">
                  Card {index + 1}
                </span>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => removeCard(index)}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
              <IonTextarea
                placeholder="Front of card"
                value={card.front}
                onIonChange={(e) => updateCard(index, 'front', e.detail.value!)}
                rows={1}
                autoGrow
                className="mb-4"
                style={{ resize: 'none' }}
              />
              <IonTextarea
                placeholder="Back of card"
                value={card.back}
                onIonChange={(e) => updateCard(index, 'back', e.detail.value!)}
                rows={1}
                autoGrow
                style={{ resize: 'none' }}
              />
            </IonCardContent>
          </IonCard>
        ))}

        {/* Add card button */}
        <div className="flex justify-center mb-6">
          <IonButton
            color="primary"
            className="rounded-lg shadow-sm"
            onClick={addCard}
          >
            <IonIcon slot="start" icon={addOutline} /> Add Card
          </IonButton>
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-4 mt-8">
          {/* Delete Set Button */}
          <IonButton color="danger" onClick={() => setShowDeleteAlert(true)}>
            Delete Set
          </IonButton>

          {/* Create button */}
          <IonButton
            color="success"
            className="rounded-lg shadow-sm w-full md:w-auto"
            onClick={saveSet}
          >
            {id ? 'Update Set' : 'Create Set'}
          </IonButton>
        </div>

        {/* Delete Set Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm Set Deletion"
          message="Are you sure you want to delete this flashcard set? This action cannot be undone."
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
                // Add your delete account logic here
                deleteSet();
              },
            },
          ]}
        />
      </div>
    </IonContent>
  );
};

export default CreateSet;
