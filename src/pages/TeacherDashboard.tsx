import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { IonContent } from '@ionic/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock Data for teacher classes
  // Each class has an id, name, number of students, number of sets, and cards mastered
  // TODO: Replace with actual data from the database
  const teacherClasses = [
    {
      id: 1,
      name: 'Biology 101',
      students: 25,
      sets: 5,
      cardsMastered: 85,
    },
    {
      id: 2,
      name: 'Spanish Basics',
      students: 18,
      sets: 3,
      cardsMastered: 78,
    },
    {
      id: 3,
      name: 'World History',
      students: 30,
      sets: 7,
      cardsMastered: 92,
    },
  ];

  // Calculate summary statistics from the class data
  // These statistics provide an overview of all classes at a glance
  const totalClasses = teacherClasses.length;
  const totalStudents = teacherClasses.reduce(
    (sum, cls) => sum + cls.students,
    0
  );
  const totalSets = teacherClasses.reduce((sum, cls) => sum + cls.sets, 0);

  // Calculate average cards mastered across all classes
  // We sum all cards mastered values, then divide by class count
  const averageCardsMastered =
    teacherClasses.reduce((sum, cls) => {
      return sum + cls.cardsMastered;
    }, 0) / totalClasses;

  return (
    <IonContent>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Class</DialogTitle>
                <DialogDescription>
                  Enter the details for your new class. You can add students and
                  flashcard sets after creation.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh]">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="className" className="text-right">
                      Class Name
                    </Label>
                    <div className="col-span-3">
                      <Input id="className" placeholder="Biology 101" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Class ID</Label>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground">
                        A unique ID will be automatically assigned when the
                        class is created.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Note</Label>
                    <div className="col-span-3">
                      <p className="text-sm text-muted-foreground">
                        After creating the class, you'll be able to add students
                        and flashcard sets from the class detail page.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button
                  onClick={() => {
                    console.log('backend call');
                    alert('backend call');
                    setIsDialogOpen(false);
                  }}
                >
                  Create Class
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalClasses}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalSets}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average Cards Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Format to 1 decimal place for readability */}
              <p className="text-2xl font-bold">
                {averageCardsMastered.toFixed(1)}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">Classes</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teacherClasses.map((cls) => (
            <Card key={cls.id}>
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
                <CardDescription>
                  {cls.students} students enrolled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{cls.sets} sets</p>
                <p className="text-sm text-gray-600">
                  Cards mastered: {cls.cardsMastered}
                </p>
                <Button variant="link" asChild className="mt-2 p-0">
                  <Link to={`/teacher/class/${cls.id}`}>Manage Class</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </IonContent>
  );
};

export default TeacherDashboard;
