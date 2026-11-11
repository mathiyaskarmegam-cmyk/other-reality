import type { AvatarMotif } from '../types/index.ts';

export const AVATAR_MOTIFS: AvatarMotif[] = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    symbol: '🚶',
    description: 'A contemplative traveler of paths less walked',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
  {
    id: 'quill',
    name: 'Quill',
    symbol: '✒️',
    description: 'An observer translating unvoiced truths to ink',
    color: '#8B5CF6',
    bg: '#F5F3FF',
  },
  {
    id: 'fog',
    name: 'Morning Fog',
    symbol: '🌫️',
    description: 'Subtle, gentle presence lingering at daybreak',
    color: '#64748B',
    bg: '#F8FAFC',
  },
  {
    id: 'river',
    name: 'Quiet River',
    symbol: '🌊',
    description: 'Unbroken flow moving patiently toward open waters',
    color: '#0EA5E9',
    bg: '#F0F9FF',
  },
  {
    id: 'meadow',
    name: 'Solitary Meadow',
    symbol: '🌾',
    description: 'A peaceful expanse swaying under quiet winds',
    color: '#10B981',
    bg: '#ECFDF5',
  },
  {
    id: 'hearth',
    name: 'Warm Hearth',
    symbol: '🕯️',
    description: 'A comforting flame keeping watch in stillness',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    id: 'mountain',
    name: 'Distant Peak',
    symbol: '🏔️',
    description: 'Steadfast witness to the passage of clouds',
    color: '#6B7280',
    bg: '#F3F4F6',
  },
  {
    id: 'dawn',
    name: 'First Dawn',
    symbol: '🌅',
    description: 'The tender first glimmer before the world awakens',
    color: '#EC4899',
    bg: '#FDF2F8',
  },
];

export function getAvatarMotif(avatarId?: string): AvatarMotif {
  if (!avatarId) return AVATAR_MOTIFS[0];
  const found = AVATAR_MOTIFS.find(a => a.id === avatarId);
  return found || AVATAR_MOTIFS[0];
}
