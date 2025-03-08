import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { menu, close, personCircle } from 'ionicons/icons';
import { Button } from '@/components/ui/button';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonMenu, IonContent, IonList, IonItem, IonIcon, IonTitle, IonMenuButton, IonMenuToggle, useIonRouter} from '@ionic/react';


const Navbar = ({ children }) => {
    // Ensure children is always an array
    const childrenArray = React.Children.toArray(children);

    // Get left and right children, or defaults to null if not available
    const leftChild = childrenArray[0] || null;
    const rightChild = childrenArray[1] || null;
    
    const router = useIonRouter();

    // Function to handle menu item clicks and close the menu
    const handleMenuItemClick = (route: string) => {
        router.push(route);
        // Close the menu manually after navigating
        document.querySelector('ion-menu')?.close();
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
                        <IonItem button onClick={() => handleMenuItemClick("/home")}>My Dashboard</IonItem>
                        <IonItem button onClick={() => handleMenuItemClick("/public-cards")}>Public Cards</IonItem>
                        <IonItem button onClick={() => handleMenuItemClick("/account")}>My Account</IonItem>
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
                    <IonTitle>{leftChild}</IonTitle>

                    {/* Right Side (Custom Button / Children) */}
                    <IonButtons slot="end" className='hidden md:block'>{rightChild}</IonButtons>

                    {/* Profile Icon */}
                    <IonButtons slot="end">
                        <IonButton routerLink="/home">
                            <IonIcon icon={personCircle} size="large" />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
        </>
    );
};


const NavbarTitle = ({ children }) => {
    return <h1 className="text-3xl font-bold">{children}</h1>;
};

const NavbarButton = ({ children, onClick }) => {
    return (
      <Button onClick={onClick}>
        {children}
      </Button>
    );
  };

export { Navbar, NavbarTitle, NavbarButton };
