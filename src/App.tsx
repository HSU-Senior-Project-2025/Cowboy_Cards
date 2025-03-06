import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import ClassDetail from './pages/ClassDetail';
import Home from './pages/Home';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PublicCards from './pages/PublicCards';
import TeacherDashboard from './pages/TeacherDashboard';
import { AuthForm } from '@/components/auth/AuthForm'; // Import AuthForm
import { ResetPass } from '@/components/auth/ResetPass'; // Import ResetPass

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

/**
 * Main App component
 *
 * Defines the routing structure for the application.
 * Routes include:
 * - / : Index page
 * - /home : Home page
 * - /class/:id : Class detail page for students
 * - /teacher : Teacher dashboard
 * - /teacher/class/:id : Class management page for teachers
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <IonApp>
        <Router>
          <IonRouterOutlet>
            <Route exact path="/" component={Index} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/class/:id" component={ClassDetail} />
            <Route exact path="/teacher" component={TeacherDashboard} />
            <Route exact path="/teacher/class/:id" component={ClassDetail} />
            <Route exact path="/public-cards" component={PublicCards} />
            <Route exact path="/auth" component={AuthForm} /> {/* Add AuthForm route */}
            <Route exact path="/reset-password" component={ResetPass} /> {/* Add ResetPass route */}
            <Route component={NotFound} />
          </IonRouterOutlet>
        </Router>
      </IonApp>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;