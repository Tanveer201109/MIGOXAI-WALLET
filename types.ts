
export enum AppView {
  IMAGE_EDIT = 'image_edit',
  VOICE = 'voice',
  VIDEO_GEN = 'video_gen',
  VIDEO_ANALYZE = 'video_analyze',
  AUDIO_TRANSCRIBE = 'audio_transcribe',
  CHAT = 'chat',
  MAPS = 'maps',
  WALLET = 'wallet',
  RPC_ENDPOINTS = 'rpc_endpoints',
  ADMIN = 'admin',
  HOME = 'home'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  thinking?: string;
  groundingUrls?: Array<{ title: string; uri: string }>;
}

export interface VideoGenerationState {
  status: 'idle' | 'loading' | 'completed' | 'error';
  videoUrl?: string;
  error?: string;
  message?: string;
}
