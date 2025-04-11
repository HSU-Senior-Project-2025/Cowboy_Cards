import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface FlashCardProps {
  front: string;
  back: string;
  onAdvance?: () => void;
  cardId: number;
  userId: number;
}

export const FlashCard = ({
  front,
  back,
  onAdvance,
  cardId,
  userId,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleScoreUpdate = async (endpoint: string) => {
    try {
      const result = await makeHttpCall(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          user_id: userId.toString(),
          card_id: cardId.toString(),
        },
      });
      console.log(`Score update successful for card ${cardId}:`, result);
      onAdvance?.(); // Advance card after successful API call
    } catch (error) {
      console.error(`Failed to update score for card ${cardId}:`, error);
      // Optionally handle the error, e.g., show a notification
      // Decide if you still want to advance the card on error
      // onAdvance?.();
    }
  };

  const handleLearningClick = () => {
    handleScoreUpdate('/api/card_history/incorrect');
  };

  const handleMasteredClick = () => {
    handleScoreUpdate('/api/card_history/correct');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Card className="flip-card-front p-8 min-h-[300px] flex items-center justify-center text-center">
          <p className="text-xl">{front}</p>
        </Card>
        <Card className="flip-card-back p-8 min-h-[300px] flex items-center justify-center text-center absolute top-0 w-full">
          <p className="text-xl">{back}</p>
        </Card>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          className="w-32"
          onClick={handleLearningClick}
        >
          <X className="mr-2 h-4 w-4" />
          Learning
        </Button>
        <Button className="w-32" onClick={handleMasteredClick}>
          <Check className="mr-2 h-4 w-4" />
          Mastered
        </Button>
      </div>
    </div>
  );
};
