import { AuthForm } from '@/components/auth/AuthForm';
import ConfirmResetPass from '@/components/auth/ConfirmResetPass';
import ResetPass from '@/components/auth/ResetPass';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { IonApp, setupIonicReact } from '@ionic/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
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
            <BrowserRouter>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
                <div id="main-content">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/class/:id" element={<ClassDetail />} />
                    <Route path="/auth" element={<AuthForm />} />
                    <Route path="/reset-password" element={<ResetPass />} />
                    <Route
                      path="/confirm-reset-password"
                      element={<ConfirmResetPass />}
                    />
                    <Route path="/public-cards" element={<PublicCards />} />
                    <Route path="/user-account" element={<UserAccount />} />
                    <Route path="/flashcards/:id" element={<Flashcard />} />
                    <Route path="/create-set" element={<CreateSet />} />
                    <Route path="/create-class" element={<CreateClass />} />
                    <Route path="/public-classes" element={<PublicClasses />} />
                    <Route path="/set-overview/:id" element={<SetOverview />} />
                    <Route element={<NotFound />} />
                  </Routes>
                </div>
              </Suspense>
              <Footer />
            </BrowserRouter>
          </IonApp>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
