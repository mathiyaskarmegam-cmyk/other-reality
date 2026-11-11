import type { Experience, Profile } from '../types/index.ts';

export const DEMO_PROFILES: Profile[] = [
  {
    id: 'usr-silent-wanderer',
    nickname: 'silent_wanderer',
    avatar: 'wanderer',
    is_moderator: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'usr-ordinary-gull',
    nickname: 'ordinary_gull',
    avatar: 'fog',
    is_moderator: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'usr-quiet-diver',
    nickname: 'quiet_diver',
    avatar: 'river',
    is_moderator: false,
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'usr-timid-dreamer',
    nickname: 'timid_dreamer',
    avatar: 'quill',
    is_moderator: false,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'usr-night-wanderer',
    nickname: 'night_wanderer',
    avatar: 'hearth',
    is_moderator: false,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    user_id: 'usr-ordinary-gull',
    author_nickname: 'ordinary_gull',
    author_avatar: 'fog',
    title: 'On sitting in the 6 AM train and watching commuters stare out into the morning fog.',
    text_content: `"There is an unspoken treaty signed by everyone boarding the commuter line before sunrise. Nobody speaks above a murmur. The neon overheads hum with a damp resonance, reflecting off the condensed window panes.

Across from me, an older man in an oiled wool overcoat slowly peeled a clementine, neatly laying the orange skin curls onto a paper napkin. He offered half to the tired stranger sitting beside him without saying a single syllable. The stranger paused, nodded with deep grace, and accepted it. For four stops, they simply chewed in silence, united in the gray vapor rolling past the tracks."`,
    experience_type: 'text_only',
    status: 'published',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
  },
  {
    id: 'exp-2',
    user_id: 'usr-quiet-diver',
    author_nickname: 'quiet_diver',
    author_avatar: 'river',
    title: null,
    text_content: null,
    experience_type: 'photo_only',
    status: 'published',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(), // Yesterday
    image: {
      id: 'img-2',
      experience_id: 'exp-2',
      storage_path: 'experiences/foggy-coast-road.jpg',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      caption: '"The quiet stretch of coast road right as the mist cleared."',
      created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  },
  {
    id: 'exp-3',
    user_id: 'usr-timid-dreamer',
    author_nickname: 'timid_dreamer',
    author_avatar: 'quill',
    title: null,
    text_content: `"I haven't told anyone I know, but I decided to quit law school this afternoon. Saying it here makes it feel real without the panic."`,
    experience_type: 'text_only',
    status: 'published',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
  },
  {
    id: 'exp-4',
    user_id: 'usr-night-wanderer',
    author_nickname: 'night_wanderer',
    author_avatar: 'hearth',
    title: null,
    text_content: null,
    experience_type: 'photo_only',
    status: 'published',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    image: {
      id: 'img-4',
      experience_id: 'exp-4',
      storage_path: 'experiences/cottage-window.jpg',
      image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=80',
      caption: null,
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  },
  // Submissions for silent_wanderer (matching My Submissions screenshot!)
  {
    id: 'exp-silent-1',
    user_id: 'usr-silent-wanderer',
    author_nickname: 'silent_wanderer',
    author_avatar: 'wanderer',
    title: 'Walking through the old neighborhood',
    text_content: 'The familiar brick walls had collected another decade of ivy. Passing the corner store with the weathered teal awning, I remembered the sound of our summer bicycles skid-stopping on loose gravel.',
    experience_type: 'text_and_photo',
    status: 'published',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    image: {
      id: 'img-silent-1',
      experience_id: 'exp-silent-1',
      storage_path: 'experiences/old-neighborhood.jpg',
      image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80',
      caption: 'The old neighborhood in golden lantern light',
      created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
  },
  {
    id: 'exp-silent-2',
    user_id: 'usr-silent-wanderer',
    author_nickname: 'silent_wanderer',
    author_avatar: 'wanderer',
    title: 'Late night realization about forgiving old friends',
    text_content: 'At 3 a.m. it struck me that holding on to grievances is mostly just rehearsing speeches to an audience that has long since packed up and left the theater. The weight was never theirs to carry anyway.',
    experience_type: 'text_only',
    status: 'published',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(), // 2 weeks ago
  },
  {
    id: 'exp-silent-3',
    user_id: 'usr-silent-wanderer',
    author_nickname: 'silent_wanderer',
    author_avatar: 'wanderer',
    title: 'Autumn morning fog over the reservoir',
    text_content: null,
    experience_type: 'photo_only',
    status: 'published',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(), // 1 month ago
    image: {
      id: 'img-silent-3',
      experience_id: 'exp-silent-3',
      storage_path: 'experiences/autumn-fog.jpg',
      image_url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1400&q=80',
      caption: null,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  },
];
