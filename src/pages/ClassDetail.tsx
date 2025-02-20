import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlashCard } from "@/components/flashcards/FlashCard";
import { Trophy, BookOpen } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

const ClassDetail = () => {
  const { id } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  
  // Mock data - in a real app this would come from an API
  const classData = {
    name: "Biology 101",
    teacher: "Dr. Smith",
    leaderboard: [
      { name: "John Doe", score: 95 },
      { name: "Jane Smith", score: 90 },
      { name: "Bob Johnson", score: 85 },
      { name: "Alice Williams", score: 82 },
      { name: "Charlie Brown", score: 80 },
    ],
    flashcardSets: [
      {
        id: 1,
        name: "Cell  BIOLOGY",
        cards: [
          { id: 1, front: "What is a cell?", back: "The basic structural unit of all living organisms" },
          { id: 2, front: "What is a nucleus?", back: "The control center of the cell containing genetic material" },
          { id: 3, front: "What is mitochondria?", back: "The powerhouse of the cell" }
        ]
      },
      {
        id: 2,
        name: "Plant Biology",
        cards: [
          { id: 1, front: "What is photosynthesis?", back: "The process by which plants convert light energy into chemical energy" },
          { id: 2, front: "What are chloroplasts?", back: "Organelles where photosynthesis occurs" }
        ]
      }
    ]
  };

  const handleMastered = () => {
    console.log("Card marked as mastered");
  };

  const handleStillLearning = () => {
    console.log("Card marked as still learning");
  };

  // Update current card index when the carousel changes
  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrentCardIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
        <p className="text-gray-600">Teacher: {classData.teacher}</p>
      </div>

      <Button onClick={() => window.history.back()} variant="outline" className="mb-6">
        ← Back
      </Button>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="flashcards">
            <BookOpen className="mr-2 h-4 w-4" />
            Flashcard Sets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Class Leaderboard</h2>
            <div className="space-y-3">
              {classData.leaderboard.map((entry, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-lg">{index + 1}</span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="text-primary font-semibold">{entry.score}%</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-6">
          {selectedSet === null ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classData.flashcardSets.map((set) => (
                <Card 
                  key={set.id} 
                  className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSet(set.id)}
                >
                  <h3 className="text-lg font-semibold mb-2">{set.name}</h3>
                  <p className="text-muted-foreground">{set.cards.length} cards</p>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setSelectedSet(null)} 
                className="mb-6"
              >
                ← Back to Sets
              </Button>
              <div className="w-full max-w-2xl mx-auto relative">
                <Carousel 
                  orientation="vertical" 
                  className="w-full"
                  setApi={setApi}
                >
                  <CarouselContent className="-mt-1 h-[400px]">
                    {classData.flashcardSets
                      .find(set => set.id === selectedSet)
                      ?.cards.map((card) => (
                        <CarouselItem key={card.id}>
                          <FlashCard
                            front={card.front}
                            back={card.back}
                            onMastered={handleMastered}
                            onStillLearning={handleStillLearning}
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
                {/* Pagination dots */}
                <div className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                  {classData.flashcardSets
                    .find(set => set.id === selectedSet)
                    ?.cards.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentCardIndex ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetail;