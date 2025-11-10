import type { Platform } from './types';
import { TwitterIcon } from './components/icons/TwitterIcon';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { InstagramIcon } from './components/icons/InstagramIcon';
import { FacebookIcon } from './components/icons/FacebookIcon';

export const PLATFORMS: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    Icon: TwitterIcon,
    description: 'Keep it concise, under 280 characters. Use relevant hashtags and an engaging, punchy tone. Emojis are good.',
    color: '#1DA1F2',
    charLimit: 280,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    Icon: LinkedInIcon,
    description: 'Professional tone. Can be longer and more detailed. Focus on industry insights, professional achievements, or thought leadership. Use professional hashtags.',
    color: '#0A66C2',
    charLimit: 3000,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    Icon: InstagramIcon,
    description: 'Focus on a visually appealing and engaging caption. Start with a strong hook. Use plenty of relevant, popular hashtags. Emojis are encouraged.',
    color: '#E4405F',
    charLimit: 2200,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    Icon: FacebookIcon,
    description: 'A friendly and conversational tone. Can be medium to long length. Ask questions to encourage engagement. More casual than LinkedIn.',
    color: '#1877F2'
  }
];
