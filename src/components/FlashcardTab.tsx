/**
 * @file FlashcardTab.tsx
 * Purpose: Defines the content component for the 'Flashcard Sets' tab in ClassDetail.
 * This component receives flashcard data and renders the FlashcardCarousel.
 */

import React from 'react';
import FlashcardCarousel from '@/components/FlashcardCarousel';
import { type CarouselApi } from '@/components/ui/carousel';

// TODO: Move this type to a shared types file (e.g., src/types/index.ts)
//       to avoid duplication and maintain consistency across the application.
type FlashcardSet = {
  ID: number;
  SetName: string;
  SetDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
};

/**
 * Props for the FlashcardTab component.
 */
interface FlashcardTabProps {
  /** Array of flashcard sets to display in the carousel. */
  flashcardSets: FlashcardSet[];
  /** The index of the currently visible card in the carousel. */
  currentCardIndex: number;
  /** Callback function to receive the carousel API instance. */
  setApi: (api: CarouselApi | undefined) => void;
  /** Flag indicating if the flashcard tab is currently loading. */
  loading: boolean;
}

/**
 * FlashcardTab Component
 *
 * Renders the FlashcardCarousel component, passing down the necessary props.
 * This component isolates the presentation logic for the flashcard sets tab.
 *
 * @param {FlashcardTabProps} props - Component properties.
 * @returns {JSX.Element} The rendered FlashcardCarousel.
 *
 * @example
 * ```tsx
 * <FlashcardTab
 *   flashcardSets={flashcardSetsData}
 *   currentCardIndex={currentCardIndex}
 *   setApi={handleCarouselApiSet}
 * />
 * ```
 */
const FlashcardTab: React.FC<FlashcardTabProps> = ({
  flashcardSets,
  currentCardIndex,
  setApi,
  loading,
}) => {
  return (
    <FlashcardCarousel
      flashcardSets={flashcardSets}
      currentCardIndex={currentCardIndex}
      setApi={setApi}
      loading={loading}
    />
  );
};

export default FlashcardTab;
