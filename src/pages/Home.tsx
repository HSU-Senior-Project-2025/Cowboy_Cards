import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IonContent } from '@ionic/react';
import { BookOpen, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarTitle, NavbarButton } from "@/components/navbar";

const Home = () => {
  const [tab, setTab] = useState('classes');

  const classes = [
    { id: 1, name: 'Biology 101', teacher: 'Dr. Smith', sets: 5 },
    { id: 2, name: 'Spanish Basics', teacher: 'Mrs. Garcia', sets: 3 },
    { id: 3, name: 'World History', teacher: 'Mr. Johnson', sets: 7 },
  ];

  const personalFlashcardSets = [
    { id: 1, name: 'Chemistry Fundamentals', cards: 12 },
    { id: 2, name: 'French Vocabulary', cards: 20 },
    { id: 3, name: 'Geography Facts', cards: 8 },
  ];

  return (
    <IonContent>
      <Navbar>
        <NavbarTitle>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">
            Dashboard
          </div>
        </NavbarTitle>
        <NavbarButton onClick={() => {}}>
          <div className="flex items-center">
            <Plus className="h-4 w-4" />
            <div className="ml-2">Join Class</div>
          </div>
        </NavbarButton>
      </Navbar>
      <div id="main-content" className="container mx-auto px-4 py-8">
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

        {tab === 'classes' && (
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

        {tab === 'flashcards' && (
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
    </IonContent>
  );
};

export default Home;
