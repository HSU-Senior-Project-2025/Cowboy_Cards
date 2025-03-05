import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IonContent } from '@ionic/react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarTitle, NavbarButton } from "@/components/navbar";

const PublicFlashcards = () => {
  const flashcardSets = [
    {
      id: 1,
      title: 'Basic Spanish Vocabulary',
      creator: 'John Doe',
      cards: 50,
    },
    { id: 2, title: 'World Capitals', creator: 'Jane Smith', cards: 30 },
    { id: 3, title: 'Biology Terms', creator: 'Dr. Emily Brown', cards: 40 },
  ];

  return (
    <IonContent>
      <Navbar>
        <NavbarTitle>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">
            Public Flashcards
          </div>
        </NavbarTitle>
      </Navbar>
      <div id="main-content" className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {flashcardSets.map((set) => (
            <Card key={set.id}>
              <CardHeader>
                <CardTitle>{set.title}</CardTitle>
                <CardDescription>Created by {set.creator}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{set.cards} cards</p>
                <Button variant="link" asChild className="mt-2 p-0">
                  <Link to={`/flashcards/${set.id}`}>View Set →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </IonContent>
  );
};

export default PublicFlashcards;
