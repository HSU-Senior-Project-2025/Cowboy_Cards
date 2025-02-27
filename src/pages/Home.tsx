import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, List } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home = () => {
  const [tab, setTab] = useState("classes");

  const classes = [
    { id: 1, name: "Biology 101", teacher: "Dr. Smith", sets: 5 },
    { id: 2, name: "Spanish Basics", teacher: "Mrs. Garcia", sets: 3 },
    { id: 3, name: "World History", teacher: "Mr. Johnson", sets: 7 },
  ];

  const personalFlashcardSets = [
    { id: 1, name: "Chemistry Fundamentals", cards: 12 },
    { id: 2, name: "French Vocabulary", cards: 20 },
    { id: 3, name: "Geography Facts", cards: 8 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-3xl font-bold">
          {tab === "classes" ? "My Classes" : "Personal Flashcard Sets"}
        </h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add {tab === "classes" ? "Class" : "Flashcard Set"}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classes">
            <List className="mr-2 h-4 w-4" />
            My Classes
          </TabsTrigger>
          <TabsTrigger value="flashcards">
            <BookOpen className="mr-2 h-4 w-4" />
            My Cards
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "classes" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link key={cls.id} to={`/class/${cls.id}`}>
              <Card className="p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.teacher}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{cls.sets} sets</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {tab === "flashcards" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personalFlashcardSets.map((set) => (
            <Link key={set.id} to={`/class/${set.id}`}>
              <Card className="p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <CardHeader>
                  <CardTitle>{set.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{set.cards} cards</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;
