import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUpdateCardStudyStatus } from '@/hooks/useFlashcardQueries';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

export const FlashCard = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const updateCardStatus = useUpdateCardStudyStatus();
  const [error, setError] = useState<Error | null>(null);
  const handleScoreUpdate = async (isCorrect: boolean) => {
    try {
      await updateCardStatus.mutateAsync({
        cardId: props.cardId,
        isCorrect,
      });
      console.log(`Score update successful for card ${props.cardId}`);
      props.onAdvance?.();
    } catch (error) {
      console.error(`Failed to update score for card ${props.cardId}:`, error);
      setError(error as Error);
    }
  };

  const handleLearningClick = () => {
    handleScoreUpdate(false);
  };

  const handleMasteredClick = () => {
    handleScoreUpdate(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && <div className="text-red-500">Error: {error.message}</div>}
      <div
        className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <Card className="flip-card-front p-8 min-h-[300px] flex items-center justify-center text-center">
          <p className="text-xl">{props.front}</p>
        </Card>
        <Card className="flip-card-back p-8 min-h-[300px] flex items-center justify-center text-center absolute top-0 w-full">
          <p className="text-xl">{props.back}</p>
        </Card>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          id="shadcn-button"
          className="w-32"
          onClick={handleLearningClick}
        >
          <X className="mr-2 h-4 w-4" />
          Not yet
        </Button>
        <Button
          id="shadcn-button"
          className="w-32"
          onClick={handleMasteredClick}
        >
          <Check className="mr-2 h-4 w-4" />
          Got it
        </Button>
      </div>
    </div>
  );
};
