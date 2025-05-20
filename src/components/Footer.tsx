import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonText,
  IonToolbar,
} from '@ionic/react';
import { home } from 'ionicons/icons';
import { Link, useLocation } from 'react-router';

const Footer = () => {
  const location = useLocation();

  // Skip rendering on Index page
  if (
    location.pathname === '/' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/confirm-reset-password'
  ) {
    return null;
  }

  return (
    <IonFooter className="hidden md:flex ion-no-border">
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton>
            <Link to="/home">
              <IonIcon icon={home} />
            </Link>
          </IonButton>
        </IonButtons>

        {/*/!* Add Button *!/*/}
        {/*<IonButtons slot="primary">*/}
        {/*    <IonButton expand="full" routerLink="/create">*/}
        {/*        <IonIcon icon={addCircle} />*/}
        {/*    </IonButton>*/}
        {/*</IonButtons>*/}

        {/*/!* Settings Button *!/*/}
        {/*<IonButtons slot="end">*/}
        {/*    <IonButton routerLink="/settings">*/}
        {/*        <IonIcon icon={settings} />*/}
        {/*    </IonButton>*/}
        {/*</IonButtons>*/}

        <IonText className="mx-auto text-center text-sm">
          &copy;Cowboy Cards 2025. Built for learning and fun.
        </IonText>
      </IonToolbar>
    </IonFooter>
  );
};

export { Footer };
