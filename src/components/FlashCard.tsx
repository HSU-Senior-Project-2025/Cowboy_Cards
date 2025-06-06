import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUpdateCardStudyStatus } from '@/hooks/useFlashcardQueries';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

export const FlashCard = (props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const updateCardStatus = useUpdateCardStudyStatus();
  const [error, setError] = useState<Error | null>(null);

  const setId = props.setId;

  const handleScoreUpdate = async (isCorrect: boolean, setId: number) => {
    try {
      await updateCardStatus.mutateAsync({
        cardId: props.cardId,
        isCorrect,
        setId,
      });
      props.onAdvance?.();
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleIncorrectClick = () => {
    handleScoreUpdate(false, setId);
  };

  const handleCorrectClick = () => {
    handleScoreUpdate(true, setId);
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
          onClick={handleIncorrectClick}
        >
          <X className="mr-2 h-4 w-4" />
          Not yet
        </Button>
        <Button
          id="shadcn-button"
          className="w-32"
          onClick={handleCorrectClick}
        >
          <Check className="mr-2 h-4 w-4" />
          Got it
        </Button>
      </div>
    </div>
  );
};
