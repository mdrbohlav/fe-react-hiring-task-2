export type MouthCue = {
  end: number;
  start: number;
  value: string;
};

export type LipSync = {
  duration: number;
  mouthCues: Array<MouthCue>;
};

export type ConversationMessage = {
  __typename?: 'ConversationMessage';
  animation?: string | null;
  audio?: string | null;
  audioUrl?: string | null;
  facialExpression?: string | null;
  id: string;
  lipSync?: LipSync | null;
  role: ConversationRole;
  text: string;
  timestamp: string;
};

export const ConversationRole = {
  ASSISTANT: 'ASSISTANT',
  USER: 'USER',
} as const;

export const SystemConversationRole = {
  SYSTEM: 'system',
} as const;

export type SystemConversationRole = (typeof SystemConversationRole)[keyof typeof SystemConversationRole];

export type ConversationRole = (typeof ConversationRole)[keyof typeof ConversationRole];

export type Message = Omit<ConversationMessage, 'role'> & {
  translation?: string;
  role: ConversationRole | SystemConversationRole;
  rephrasedText?: string;
  rephrased?: boolean;
};

export const AvatarAnimations = {
  Animation_Idle_Orc: 'Animation_Idle_Orc',
  Action_Idle_Breathing: 'Action_Idle_Breathing',
  Action_Sad: 'Action_Sad',
  Face_Terror: 'Face_Terror',
  Pose_Static: 'Pose_Static',
} as const;

export type AvatarAnimations = (typeof AvatarAnimations)[keyof typeof AvatarAnimations];

export const LipSyncCorresponding = {
  A: 'viseme_PP',
  B: 'viseme_kk',
  C: 'viseme_I',
  D: 'viseme_AA',
  E: 'viseme_O',
  F: 'viseme_U',
  G: 'viseme_FF',
  H: 'viseme_TH',
  X: 'viseme_PP',
} as const;

export type LipSyncCorresponding = (typeof LipSyncCorresponding)[keyof typeof LipSyncCorresponding];

export const FacialExpressions = {
  Shock: 'Shock',
  Wonder: 'Wonder',
  Alertness: 'Alertness',
  Melancholy: 'Melancholy',
  Sadness: 'Sadness',
  Laughter: 'Laughter',
  Joy: 'Joy',
  Satisfaction: 'Satisfaction',
  Terror: 'Terror',
  Fear: 'Fear',
  Disgust: 'Disgust',
  Anger: 'Anger',
} as const;

export type FacialExpressions = (typeof FacialExpressions)[keyof typeof FacialExpressions];
