import React from 'react';
import { home, settings, addCircle } from 'ionicons/icons';
import {
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';

const Footer = () => {
  return (
    <IonFooter className="ion-no-border fixed bottom-0 w-full">
      <IonToolbar>
        {/* Home Button */}
        <IonButtons slot="start">
          <IonButton routerLink="/home">
            <IonIcon icon={home} />
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

        {/* About Section */}
        <IonText className="mx-auto text-center text-sm text-gray-500">
          Cowboy Cards 2025. Built for learning and fun.
        </IonText>
      </IonToolbar>
    </IonFooter>
  );
};

export { Footer };
