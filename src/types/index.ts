export type ExperienceType = 'text_only' | 'photo_only' | 'text_and_photo';
export type ExperienceStatus = 'published' | 'draft' | 'moderated_removed' | 'deleted';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'actioned';
export type ModerationDecision = 'dismissed' | 'removed' | 'warning';
export type DeletionRequestStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface AvatarMotif {
  id: string;
  name: string;
  symbol: string;
  description: string;
  color: string;
  bg: string;
}

export interface Profile {
  id: string;
  nickname: string;
  avatar: string;
  is_moderator: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ExperienceImage {
  id: string;
  experience_id: string;
  storage_path: string;
  image_url: string;
  caption?: string | null;
  created_at: string;
}

export interface Experience {
  id: string;
  user_id: string;
  title?: string | null;
  text_content?: string | null;
  experience_type: ExperienceType;
  status: ExperienceStatus;
  created_at: string;
  updated_at?: string;
  // Joined or enriched fields
  author_nickname?: string;
  author_avatar?: string;
  image?: ExperienceImage | null;
}

export interface Report {
  id: string;
  experience_id: string;
  reporting_user_id: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  // Enriched for moderator view
  experience?: Experience;
  reporting_user_nickname?: string;
}

export interface ModerationRecord {
  id: string;
  report_id?: string | null;
  experience_id: string;
  moderator_user_id: string;
  decision: ModerationDecision;
  notes?: string | null;
  created_at: string;
}

export interface AccountDeletionRequest {
  id: string;
  user_id: string;
  reason?: string | null;
  status: DeletionRequestStatus;
  created_at: string;
}

export interface UserSession {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: Profile | null;
}

