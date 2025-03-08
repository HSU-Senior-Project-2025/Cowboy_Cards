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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={Index} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/class/:id" component={ClassDetail} />
            <Route exact path="/teacher" component={TeacherDashboard} />
            <Route exact path="/teacher/class/:id" component={ClassDetail} />
            <Route exact path="/public-cards" component={PublicCards} />
            <Route exact path="/login" component={AuthForm} />
            <Route exact path="/reset-password" component={ResetPass} />
            <Route exact path="/userAccount" component={UserAccount} />
            <Route component={NotFound} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;