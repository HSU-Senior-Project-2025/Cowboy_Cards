import { useTheme } from '@/contexts/ThemeContext';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { add, close, menu, moon, personCircle, sunny } from 'ionicons/icons';
import { useState } from 'react';

const Navbar = () => {
  const [popoverEvent, setPopoverEvent] = useState(null);

  const openPopover = (event) => setPopoverEvent(event.nativeEvent);
  const closePopover = () => setPopoverEvent(null);

  const handleMenuItemClick = (route) => {
    ionRouter.push(route);
    document.querySelector('ion-menu')?.close();
  };

  const ionRouter = useIonRouter();
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuToggle>
                <IonButton>
                  <IonIcon icon={close} />
                </IonButton>
              </IonMenuToggle>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem button onClick={() => handleMenuItemClick('/home')}>
              My Dashboard
            </IonItem>
            <IonItem
              button
              onClick={() => handleMenuItemClick('/public-cards')}
            >
              Public Cards
            </IonItem>
            <IonItem
              button
              onClick={() => handleMenuItemClick('/public-classes')}
            >
              Public Classes
            </IonItem>
            <IonItem
              button
              onClick={() => handleMenuItemClick('/user-account')}
            >
              My Account
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuToggle>
              <IonButton>
                <IonIcon icon={menu} />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>

          <div
            className="flex items-center cursor-pointer"
            onClick={() => ionRouter.push('/home')}
          >
            <img
              src="src/assets/Spirit-Cowboy-Profile-Only.png"
              alt="Cowboy Cards Logo"
              className="h-8 w-auto xs:hidden block"
            />
            <IonTitle
              color="primary"
              className="hidden xs:block text-2xl sm:text-3xl lg:text-4xl font-ewert"
            >
              Cowboy Cards
            </IonTitle>
          </div>

          <IonButtons slot="end">
            <IonButton onClick={openPopover}>
              <IonIcon icon={add} className="text-[32px] stroke-[2]" />
            </IonButton>
            <IonPopover
              event={popoverEvent}
              isOpen={!!popoverEvent}
              onDidDismiss={closePopover}
            >
              <IonContent className="p-2">
                <IonList>
                  <IonItem
                    button
                    onClick={() => {
                      closePopover();
                      ionRouter.push('/create-set');
                    }}
                  >
                    Create Set
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => {
                      closePopover();
                      ionRouter.push('/create-class');
                    }}
                  >
                    Create Class
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => {
                      closePopover();
                      ionRouter.push('/public-classes');
                    }}
                  >
                    Join Class
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
            <IonButton fill="clear" onClick={toggleDarkMode}>
              <IonIcon
                slot="icon-only"
                icon={theme === 'dark' ? sunny : moon}
              />
            </IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton routerLink="/user-account">
              <IonIcon icon={personCircle} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export { Navbar };
