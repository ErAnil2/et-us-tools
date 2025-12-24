import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DiceRollerClient from './DiceRollerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'dice-roller',
  category: 'apps',
  fallback: {
    title: 'Roll Dice Online - Free Virtual Dice Roller | The Economic Times',
    description: 'Roll dice online for free! Virtual dice roller for board games, D&D, and RPGs. Customize dice types, roll multiple dice at once. Perfect for tabletop gaming!',
    keywords: 'roll dice online, dice roller, virtual dice, online dice, D&D dice roller, board game dice, random dice, RPG dice roller, dice simulator',
  }
});

export default function DiceRollerPage() {
  return <DiceRollerClient />;
}
