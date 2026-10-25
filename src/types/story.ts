export interface SceneCaption {
  text: string;
  startSec: number;
  endSec: number;
}

export interface StoryScene {
  id: number;
  title: string;
  duration: number; // in seconds
  timecode: string;
  imagePath: string;
  visualPrompt: string;
  visualDirection: string;
  cameraShot: string;
  voiceoverId: string;
  captions: SceneCaption[];
  sfxCues: string;
  aiVideoPromptEn: string;
  aiVideoPromptId: string;
  montessoriNote?: string;
}

export interface CustomStoryConfig {
  childName: string;
  childAge: number;
  theme: string;
  tone: 'heartwarming' | 'educational' | 'reflective';
}
