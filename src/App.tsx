import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ClassDetail from './pages/ClassDetail';
import TeacherDashboard from './pages/TeacherDashboard';
import { AuthForm } from '@/components/auth/AuthForm';
import ResetPass from '@/components/auth/ResetPass';
import PublicCards from './pages/PublicCards';
import UserAccount from './pages/UserAccount';
import { ThemeProvider } from './contexts/ThemeContext';
import CreateClass from './pages/CreateClass';
import Flashcard from './pages/Flashcard';
import CreateSet from './pages/CreateSet';
import PublicClasses from './pages/PublicClasses';
import SetOverview from './pages/SetOverview';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route exact path="/" component={Index} />
                <Route exact path="/home" component={Home} />
                <Route exact path="/class/:id" component={ClassDetail} />
                <Route exact path="/teacher" component={TeacherDashboard} />
                <Route exact path="/auth" component={AuthForm} />
                <Route exact path="/reset-password" component={ResetPass} />
                <Route exact path="/public-cards" component={PublicCards} />
                <Route exact path="/user-account" component={UserAccount} />
                <Route exact path="/flashcards/:id" component={Flashcard} />
                <Route exact path="/create-set" component={CreateSet} />
                <Route exact path="/edit-set/:id" component={CreateSet} />
                <Route exact path="/class/create" component={CreateClass} />
                <Route exact path="/public-classes" component={PublicClasses} />
                <Route exact path="/set-overview/:id" component={SetOverview} />
                <Route component={NotFound} />
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
