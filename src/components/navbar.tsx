import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menu, close, personCircle, moon, sunny, add } from 'ionicons/icons';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonTitle,
  IonMenuButton,
  IonMenuToggle,
  useIonRouter,
  IonPopover,
} from '@ionic/react';

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
            <IonItem button onClick={() => handleMenuItemClick('/userAccount')}>
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
          <IonTitle>Cowboy Cards</IonTitle>

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
                <IonItem button onClick={() => { closePopover(); router.push('#'); }}>
                  Create Set
                </IonItem>
                <IonItem button onClick={() => { closePopover(); router.push('#'); }}>
                  Create Class
                </IonItem>
                <IonItem button onClick={() => { closePopover(); router.push('#'); }}>
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
            <IonButton routerLink="/userAccount">
              <IonIcon icon={personCircle} size="large" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    </>
  );
};

export { Navbar };
