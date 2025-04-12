/**
 * @file ClassDetailTabs.tsx
 * Purpose: Defines the tab navigation component for the Class Detail page.
 * This component is responsible for rendering and managing the tab navigation
 * between different sections (Flashcard Sets, Leaderboard, Students).
 */

import React from 'react';
import { IonIcon, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import { bookOutline, trophyOutline, peopleOutline } from 'ionicons/icons';

/**
 * Props for the ClassDetailTabs component.
 * Contains the currently selected tab and the handler to change it.
 */
interface ClassDetailTabsProps {
  /** The currently selected tab value */
  selectedTab: string;
  /** Callback function to handle tab changes */
  onTabChange: (value: string) => void;
}

/**
 * ClassDetailTabs Component
 *
 * Renders the tab navigation section of the Class Detail page.
 * Provides navigation between different views:
 * - Flashcard Sets: View and manage flashcard sets for the class
 * - Leaderboard: View student performance rankings
 * - Students: Manage class enrollment
 * The actual segment logic has been moved here from the parent page.
 *
 * @param {ClassDetailTabsProps} props - Component properties
 * @returns {JSX.Element} The rendered tab navigation component
 *
 * @example
 * ```tsx
 * <ClassDetailTabs
 *   selectedTab="flashcards"
 *   onTabChange={(newTab) => setTab(newTab)}
 * />
 * ```
 */
const ClassDetailTabs: React.FC<ClassDetailTabsProps> = ({
  selectedTab,
  onTabChange,
}) => {
  return (
    <IonSegment
      value={selectedTab}
      onIonChange={(e) => onTabChange(e.detail.value as string)}
      className="w-full mb-6"
    >
      <IonSegmentButton value="flashcards">
        <IonIcon icon={bookOutline} className="mr-2" />
        <IonLabel>Flashcard Sets</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="leaderboard">
        <IonIcon icon={trophyOutline} className="mr-2" />
        <IonLabel>Leaderboard</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="students">
        <IonIcon icon={peopleOutline} className="mr-2" />
        <IonLabel>Students</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default ClassDetailTabs;
