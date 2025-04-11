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
    router.push(route);
    document.querySelector('ion-menu')?.close();
  };

  const router = useIonRouter();
  const { theme, setTheme } = useTheme();

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Sidebar Navigation (IonMenu) */}
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            {/* Close icon will automatically show when the menu is open */}
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

      {/* Navbar */}
      <IonHeader>
        <IonToolbar>
          {/* Left Side (Menu Button) */}
          <IonButtons slot="start">
            {/* Left Side (Menu Button - FIXED) */}
            <IonMenuToggle>
              <IonButton>
                <IonIcon icon={menu} />
              </IonButton>
            </IonMenuToggle>
          </IonButtons>

          {/* Middle Section (Title / Children) */}
          <IonTitle
            color="primary"
            className="text-lg md:text-xl lg:text-2xl font-bold hover:translate-x-1 transition-all duration-300 cursor-pointer"
            onClick={() => router.push('/home')}
          >
            Cowboy Cards
          </IonTitle>

          {/* Theme Toggle Button */}
          <IonButtons slot="end">
            <IonButton onClick={openPopover}>
              <IonIcon icon={add} className="text-[32px] stroke-[2]" />
            </IonButton>
            {/* Popover for Create Options */}
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
                      router.push('/create-set');
                    }}
                  >
                    Create Set
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => {
                      closePopover();
                      router.push('/class/create');
                    }}
                  >
                    Create Class
                  </IonItem>
                  <IonItem
                    button
                    onClick={() => {
                      closePopover();
                      router.push('/public-classes');
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

          {/* Profile Icon */}
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
