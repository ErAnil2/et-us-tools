import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WhackAMoleClient from './WhackAMoleClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'whack-a-mole',
  category: 'games',
  fallback: {
    title: 'Whack a Mole Game Online - Play Free Reflex Game | The Economic Times',
    description: 'Play Whack a Mole game online for free! Test your reflexes and reaction time in this classic arcade game. Hit moles as they pop up and beat your high score!',
    keywords: 'whack a mole, whack a mole game, whack a mole online, reflex game, reaction time game, arcade game, free whack a mole, mole game',
  }
});

export default function WhackAMolePage() {
  return <WhackAMoleClient />;
}
