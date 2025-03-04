import { FlashCard } from '@/components/flashcards/FlashCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { IonContent } from '@ionic/react';
import { BookOpen, Plus, Trophy, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * ClassDetail Component
 *
 * This component displays detailed information about a specific class.
 * It allows teachers to:
 * - View class information and leaderboard
 * - Manage flashcard sets
 * - Add new students to the class
 * - Add new flashcard sets to the class
 *
 * The component uses the class ID from the URL to load the correct class data.
 */
const ClassDetail = () => {
  // Get the class ID from the URL parameters
  const { id } = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [selectedSet, setSelectedSet] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data - in a real app this would come from an API based on the class ID
  const classData = {
    id: id,
    name: 'Biology 101',
    teacher: 'Dr. Smith',
    students: [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
      { id: 4, name: 'Alice Williams', email: 'alice.williams@example.com' },
      { id: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com' },
    ],
    leaderboard: [
      { name: 'John Doe', cardsMastered: 95 },
      { name: 'Jane Smith', cardsMastered: 90 },
      { name: 'Bob Johnson', cardsMastered: 85 },
      { name: 'Alice Williams', cardsMastered: 82 },
      { name: 'Charlie Brown', cardsMastered: 80 },
    ],
    flashcardSets: [
      {
        id: 1,
        name: 'Cell Biology',
        description: 'Basic concepts of cell biology',
        cards: [
          {
            id: 1,
            front: 'What is a cell?',
            back: 'The basic structural unit of all living organisms',
          },
          {
            id: 2,
            front: 'What is a nucleus?',
            back: 'The control center of the cell containing genetic material',
          },
          {
            id: 3,
            front: 'What is mitochondria?',
            back: 'The powerhouse of the cell',
          },
        ],
      },
      {
        id: 2,
        name: 'Plant Biology',
        description: 'Introduction to plant biology concepts',
        cards: [
          {
            id: 1,
            front: 'What is photosynthesis?',
            back: 'The process by which plants convert light energy into chemical energy',
          },
          {
            id: 2,
            front: 'What are chloroplasts?',
            back: 'Organelles where photosynthesis occurs',
          },
        ],
      },
    ],
  };

  // Update current card index when the carousel changes
  // TODO: get the current card index from the backend
  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrentCardIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <IonContent>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
          <p className="text-gray-600">Teacher: {classData.teacher}</p>
          <p className="text-gray-600">Class ID: {id}</p>
        </div>

        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="flex gap-4 mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the details of the student you want to add to this
                  class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Full Name
                  </Label>
                  <div className="col-span-3">
                    <Input id="name" placeholder="John Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input id="email" placeholder="john.doe@example.com" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    console.log('backend call');
                    alert('backend call');
                    setIsDialogOpen(false);
                  }}
                >
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Flashcard Set
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Flashcard Set</DialogTitle>
                <DialogDescription>
                  Create a new flashcard set for this class.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="setName" className="text-right">
                    Set Name
                  </Label>
                  <Input
                    id="setName"
                    className="col-span-3"
                    placeholder="Cell Biology"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    placeholder="Basic concepts of cell biology"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    console.log('backend call');
                    alert('backend call');
                    setIsDialogOpen(false);
                  }}
                >
                  Create Set
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="flashcards">
              <BookOpen className="mr-2 h-4 w-4" />
              Flashcard Sets
            </TabsTrigger>
            <TabsTrigger value="students">
              <Users className="mr-2 h-4 w-4" />
              Students
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
                    <span className="text-primary font-semibold">
                      {entry.cardsMastered} cards
                    </span>
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
                    <p className="text-muted-foreground mb-2">
                      {set.description}
                    </p>
                    <p className="text-muted-foreground">
                      {set.cards.length} cards
                    </p>
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
                        .find((set) => set.id === selectedSet)
                        ?.cards.map((card) => (
                          <CarouselItem key={card.id}>
                            <FlashCard front={card.front} back={card.back} />
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                  {/* Pagination dots */}
                  <div className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                    {classData.flashcardSets
                      .find((set) => set.id === selectedSet)
                      ?.cards.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentCardIndex
                              ? 'bg-primary'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Class Students</h2>
              <div className="space-y-3">
                {classData.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span className="font-medium">{student.name}</span>
                    <span className="text-muted-foreground">
                      {student.email}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IonContent>
  );
};

export default ClassDetail;
