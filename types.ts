import type React from 'react';

export interface Platform {
  id: string;
  name: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  color: string;
  charLimit?: number;
}

export interface GeneratedPost {
  platform: string;
  content: string;
}

export interface UploadedMedia {
  base64: string;
  mimeType: string;
  name: string;
}

export interface ContentPlanDay {
  day: number;
  topic: string;
  snippet: string;
}