/**
 * @file LeaderboardTab.tsx
 * Purpose: Defines the content component for the 'Leaderboard' tab in ClassDetail.
 * This component receives leaderboard data and loading status, rendering either
 * a loading indicator or the Leaderboard component.
 */

import React from 'react';
import { IonSpinner } from '@ionic/react';
import Leaderboard from '@/components/Leaderboard'; // Assuming Leaderboard component path

// TODO: Move this type to a shared types file (e.g., src/types/index.ts)
//       to avoid duplication and maintain consistency across the application.
type GetClassScoresRow = {
  UserID: number;
  Username: string;
  ClassScore: number;
};

/**
 * Props for the LeaderboardTab component.
 */
interface LeaderboardTabProps {
  /** Array of leaderboard data rows. */
  leaderboardData: GetClassScoresRow[];
  /** Flag indicating if the leaderboard scores are currently being loaded. */
  loadingScores: boolean;
}

/**
 * LeaderboardTab Component
 *
 * Renders the content for the Leaderboard tab. Displays a loading spinner
 * while scores are being fetched, or the Leaderboard component once data is available.
 * This component isolates the presentation logic for the leaderboard tab.
 *
 * @param {LeaderboardTabProps} props - Component properties.
 * @returns {JSX.Element} The rendered leaderboard content or loading spinner.
 *
 * @example
 * ```tsx
 * <LeaderboardTab
 *   leaderboardData={scoresData}
 *   loadingScores={isLoading}
 * />
 * ```
 */
const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  leaderboardData,
  loadingScores,
}) => {
  return (
    <>
      {loadingScores ? (
        // Display a centered spinner while loading
        <div className="flex justify-center items-center p-8">
          <IonSpinner name="circular" />
          <span className="ml-2">Calculating scores...</span>
        </div>
      ) : (
        // Render the Leaderboard component when data is ready
        <Leaderboard leaderboard={leaderboardData} />
      )}
    </>
  );
};

export default LeaderboardTab;
