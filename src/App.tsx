import { AuthForm } from '@/components/auth/AuthForm';
import ConfirmResetPass from '@/components/auth/ConfirmResetPass';
import ResetPass from '@/components/auth/ResetPass';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ClassDetail from './pages/ClassDetail';
import CreateClass from './pages/CreateClass';
import CreateSet from './pages/CreateSet';
import Flashcard from './pages/Flashcard';
import Home from './pages/Home';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PublicCards from './pages/PublicCards';
import PublicClasses from './pages/PublicClasses';
import SetOverview from './pages/SetOverview';
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
// import './theme/variables.css'; Removed this import

setupIonicReact();

const queryClient = new QueryClient();

// const Home = React.lazy(() => import('./pages/Home'));
// const PublicCards = React.lazy(() => import('./pages/PublicCards'));
// const PublicClasses = React.lazy(() => import('./pages/PublicClasses'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <IonApp>
            {/* @ts-expect-error - unsolvable type error */}
            <IonReactRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <IonRouterOutlet id="main-content">
                  <Route exact path="/" component={Index} />
                  <Route exact path="/home" component={Home} />
                  <Route exact path="/class/:id" component={ClassDetail} />
                  <Route exact path="/auth" component={AuthForm} />
                  <Route exact path="/reset-password" component={ResetPass} />
                  <Route
                    exact
                    path="/confirm-reset-password"
                    component={ConfirmResetPass}
                  />
                  <Route exact path="/public-cards" component={PublicCards} />
                  <Route exact path="/user-account" component={UserAccount} />
                  <Route exact path="/flashcards/:id" component={Flashcard} />
                  <Route exact path="/create-set" component={CreateSet} />
                  <Route exact path="/create-class" component={CreateClass} />
                  <Route
                    exact
                    path="/public-classes"
                    component={PublicClasses}
                  />
                  <Route
                    exact
                    path="/set-overview/:id"
                    component={SetOverview}
                  />
                  <Route component={NotFound} />
                </IonRouterOutlet>
              </Suspense>
              <Footer />
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
