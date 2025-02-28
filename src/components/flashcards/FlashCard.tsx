import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface FlashCardProps {
  front: string;
  back: string;
}

export const FlashCard = ({ front, back }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

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
        <Button variant="outline" className="w-32">
          <X className="mr-2 h-4 w-4" />
          Learning
        </Button>
        <Button className="w-32">
          <Check className="mr-2 h-4 w-4" />
          Mastered
        </Button>
      </div>
    </div>
  );
};
