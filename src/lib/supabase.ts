import type { Experience, Profile, Report, ModerationRecord, AccountDeletionRequest, ExperienceType } from '../types/index.ts';
import { INITIAL_EXPERIENCES, DEMO_PROFILES } from './seedData.ts';

// Read configuration from Vite or Node environment variables safely
const rawUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || '';
const rawAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || '';

const SUPABASE_URL = rawUrl.replace(/\/$/, '');
const SUPABASE_ANON_KEY = rawAnonKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_URL.includes('your-id') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key') &&
    SUPABASE_ANON_KEY.length > 20 &&
    SUPABASE_URL.startsWith('http')
  );
};

export const getSupabaseConfig = () => ({
  url: SUPABASE_URL,
  isConfigured: isSupabaseConfigured(),
});

// Storage keys for persistent local fallback
const STORAGE_KEY_AUTH = 'tor_auth_session';
const STORAGE_KEY_EXPERIENCES = 'tor_experiences';
const STORAGE_KEY_PROFILES = 'tor_profiles';
const STORAGE_KEY_REPORTS = 'tor_reports';
const STORAGE_KEY_MODERATION = 'tor_moderation_records';
const STORAGE_KEY_DELETIONS = 'tor_deletion_requests';

// Initialize local storage state if needed
function getStoredExperiences(): Experience[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_EXPERIENCES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed reading experiences from localStorage', e);
  }
  // Default to initial seed
  localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(INITIAL_EXPERIENCES));
  return INITIAL_EXPERIENCES;
}

function setStoredExperiences(experiences: Experience[]) {
  try {
    localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(experiences));
  } catch (e) {
    console.error('Failed writing experiences to localStorage', e);
  }
}

function getStoredProfiles(): Profile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed reading profiles from localStorage', e);
  }
  localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(DEMO_PROFILES));
  return DEMO_PROFILES;
}

function setStoredProfiles(profiles: Profile[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Failed writing profiles to localStorage', e);
  }
}

function getStoredReports(): Report[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed reading reports from localStorage', e);
  }
  return [];
}

function setStoredReports(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed writing reports to localStorage', e);
  }
}

// REST helper for real Supabase
async function supabaseFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getLocalAccessToken();
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw new Error(`Unable to reach Supabase at "${SUPABASE_URL}". Please check that your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env are correct.`);
    }
    throw err;
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errJson = await response.json();
      errorDetail = errJson.message || errJson.error_description || JSON.stringify(errJson);
    } catch {}
    throw new Error(errorDetail || `Supabase request failed with status ${response.status}`);
  }

  // If 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

function getLocalAccessToken(): string | null {
  try {
    const session = localStorage.getItem(STORAGE_KEY_AUTH);
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.access_token || null;
    }
  } catch {}
  return null;
}

export const supabaseApi = {
  // --------------------------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------------------------
  async signUp(params: {
    email: string;
    password: string;
    nickname: string;
    avatar: string;
    is_moderator?: boolean;
  }): Promise<{ user: any; profile: Profile }> {
    if (isSupabaseConfigured()) {
      // Real Supabase Auth API
      const res = await supabaseFetch<any>('/auth/v1/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: params.email,
          password: params.password,
          data: {
            nickname: params.nickname,
            avatar: params.avatar,
            is_moderator: params.is_moderator || false,
          },
        }),
      });

      const user = res.user;
      if (res.access_token) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(res));
      }

      // Fetch or construct profile
      const profile: Profile = {
        id: user.id,
        nickname: params.nickname,
        avatar: params.avatar,
        is_moderator: params.is_moderator || false,
        created_at: new Date().toISOString(),
      };

      return { user, profile };
    }

    // Local persistent fallback
    const mockId = 'usr-' + Math.random().toString(36).substring(2, 9);
    const user = {
      id: mockId,
      email: params.email,
    };
    const profile: Profile = {
      id: mockId,
      nickname: params.nickname,
      avatar: params.avatar,
      is_moderator: params.is_moderator || false,
      created_at: new Date().toISOString(),
    };

    const profiles = getStoredProfiles();
    profiles.push(profile);
    setStoredProfiles(profiles);

    const sessionData = {
      access_token: 'mock-token-' + mockId,
      user,
      profile,
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionData));

    return { user, profile };
  },

  async signIn(params: { email: string; password: string }): Promise<{ user: any; profile: Profile }> {
    if (isSupabaseConfigured()) {
      const res = await supabaseFetch<any>('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: JSON.stringify({
          email: params.email,
          password: params.password,
        }),
      });

      const user = res.user;
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(res));

      // Fetch profile
      let profile: Profile;
      try {
        const profiles = await supabaseFetch<Profile[]>(`/rest/v1/profiles?id=eq.${user.id}&select=*`);
        if (profiles && profiles.length > 0) {
          profile = profiles[0];
        } else {
          profile = {
            id: user.id,
            nickname: user.user_metadata?.nickname || 'silent_wanderer',
            avatar: user.user_metadata?.avatar || 'wanderer',
            is_moderator: Boolean(user.user_metadata?.is_moderator),
            created_at: user.created_at || new Date().toISOString(),
          };
        }
      } catch {
        profile = {
          id: user.id,
          nickname: user.user_metadata?.nickname || 'silent_wanderer',
          avatar: user.user_metadata?.avatar || 'wanderer',
          is_moderator: Boolean(user.user_metadata?.is_moderator),
          created_at: user.created_at || new Date().toISOString(),
        };
      }

      return { user, profile };
    }

    // Local fallback: match by email prefix, stored session, or silent_wanderer
    const profiles = getStoredProfiles();
    const emailPrefix = params.email.split('@')[0].toLowerCase();
    let profile = profiles.find(p => emailPrefix.includes(p.nickname.toLowerCase()) || p.nickname.toLowerCase().includes(emailPrefix)) ||
      profiles.find(p => p.nickname === 'silent_wanderer') ||
      profiles[0];
    const user = {
      id: profile.id,
      email: params.email,
    };

    const sessionData = {
      access_token: 'mock-token-' + profile.id,
      user,
      profile,
    };
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionData));

    return { user, profile };
  },

  async resetPassword(email: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await supabaseFetch('/auth/v1/recover', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return true;
    }
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        await supabaseFetch('/auth/v1/logout', { method: 'POST' });
      } catch (e) {
        console.warn('Logout request warning:', e);
      }
    }
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  getCurrentSession(): { user: any; profile: Profile } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTH);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed.user && parsed.profile) {
        return { user: parsed.user, profile: parsed.profile };
      }
    } catch {}
    return null;
  },

  // --------------------------------------------------------------------------
  // DISCOVERY & EXPERIENCES
  // --------------------------------------------------------------------------
  async getDiscoverExperiences(): Promise<Experience[]> {
    if (isSupabaseConfigured()) {
      // Query published experiences with associated image and profile
      const endpoint = '/rest/v1/experiences?select=*,image:experience_images(*),author:profiles(*)&status=eq.published&order=created_at.desc';
      const raw = await supabaseFetch<any[]>(endpoint);
      return raw.map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        text_content: item.text_content,
        experience_type: item.experience_type,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        author_nickname: item.author?.nickname || 'pseudonymous_voice',
        author_avatar: item.author?.avatar || 'wanderer',
        image: item.image && item.image.length > 0 ? item.image[0] : null,
      }));
    }

    // Local fallback: uncurated chronology
    const list = getStoredExperiences();
    const profiles = getStoredProfiles();
    const profileMap = new Map(profiles.map(p => [p.id, p]));

    return list
      .filter(exp => exp.status === 'published')
      .map(exp => {
        const author = profileMap.get(exp.user_id);
        return {
          ...exp,
          author_nickname: exp.author_nickname || author?.nickname || 'pseudonymous_voice',
          author_avatar: exp.author_avatar || author?.avatar || 'wanderer',
        };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getMySubmissions(userId: string): Promise<Experience[]> {
    if (isSupabaseConfigured()) {
      const endpoint = `/rest/v1/experiences?user_id=eq.${userId}&select=*,image:experience_images(*)&order=created_at.desc`;
      const raw = await supabaseFetch<any[]>(endpoint);
      return raw.map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        text_content: item.text_content,
        experience_type: item.experience_type,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        image: item.image && item.image.length > 0 ? item.image[0] : null,
      }));
    }

    const list = getStoredExperiences();
    return list
      .filter(exp => exp.user_id === userId && exp.status !== 'deleted')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async createExperience(params: {
    userId: string;
    authorNickname: string;
    authorAvatar: string;
    title?: string | null;
    textContent?: string | null;
    experienceType: ExperienceType;
    imageFile?: File | null;
    imageCaption?: string | null;
  }): Promise<Experience> {
    if (isSupabaseConfigured()) {
      // 1. Insert experience record
      const [newExp] = await supabaseFetch<any[]>('/rest/v1/experiences', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
          user_id: params.userId,
          title: params.title || null,
          text_content: params.textContent || null,
          experience_type: params.experienceType,
          status: 'published',
        }),
      });

      // 2. Upload image if present
      let uploadedImage = null;
      if (params.imageFile) {
        const fileExt = params.imageFile.name.split('.').pop() || 'jpg';
        const fileName = `${params.userId}/${newExp.id}-${Date.now()}.${fileExt}`;
        
        // Supabase Storage Upload
        await fetch(`${SUPABASE_URL}/storage/v1/object/experience-images/${fileName}`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${getLocalAccessToken() || SUPABASE_ANON_KEY}`,
            'Content-Type': params.imageFile.type,
          },
          body: params.imageFile,
        });

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/experience-images/${fileName}`;

        const [imgRecord] = await supabaseFetch<any[]>('/rest/v1/experience_images', {
          method: 'POST',
          headers: { 'Prefer': 'return=representation' },
          body: JSON.stringify({
            experience_id: newExp.id,
            storage_path: fileName,
            image_url: publicUrl,
            caption: params.imageCaption || null,
          }),
        });

        uploadedImage = imgRecord;
      }

      return {
        ...newExp,
        author_nickname: params.authorNickname,
        author_avatar: params.authorAvatar,
        image: uploadedImage,
      };
    }

    // Local fallback
    const expId = 'exp-' + Math.random().toString(36).substring(2, 9);
    let imageUrl = '';
    if (params.imageFile) {
      imageUrl = URL.createObjectURL(params.imageFile);
    }

    const newExperience: Experience = {
      id: expId,
      user_id: params.userId,
      author_nickname: params.authorNickname,
      author_avatar: params.authorAvatar,
      title: params.title || null,
      text_content: params.textContent || null,
      experience_type: params.experienceType,
      status: 'published',
      created_at: new Date().toISOString(),
      image: params.imageFile
        ? {
            id: 'img-' + expId,
            experience_id: expId,
            storage_path: `experiences/${expId}.jpg`,
            image_url: imageUrl,
            caption: params.imageCaption || null,
            created_at: new Date().toISOString(),
          }
        : null,
    };

    const experiences = getStoredExperiences();
    experiences.unshift(newExperience);
    setStoredExperiences(experiences);

    return newExperience;
  },

  async deleteExperience(experienceId: string, userId: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      // Backend enforces auth.uid() = user_id via RLS
      await supabaseFetch(`/rest/v1/experiences?id=eq.${experienceId}&user_id=eq.${userId}`, {
        method: 'DELETE',
      });
      return true;
    }

    const experiences = getStoredExperiences();
    const index = experiences.findIndex(e => e.id === experienceId);
    if (index === -1) throw new Error('Experience not found');

    if (experiences[index].user_id !== userId) {
      throw new Error('Unauthorized: You can only delete your own submissions.');
    }

    // Mark as deleted or remove
    experiences.splice(index, 1);
    setStoredExperiences(experiences);
    return true;
  },

  // --------------------------------------------------------------------------
  // REPORTING & MODERATION
  // --------------------------------------------------------------------------
  async submitReport(params: {
    experienceId: string;
    reportingUserId: string;
    reason: string;
    details?: string;
  }): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await supabaseFetch('/rest/v1/reports', {
        method: 'POST',
        headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          experience_id: params.experienceId,
          reporting_user_id: params.reportingUserId,
          reason: params.reason,
          details: params.details || null,
          status: 'pending',
        }),
      });
      return true;
    }

    const reports = getStoredReports();
    const newReport: Report = {
      id: 'rep-' + Math.random().toString(36).substring(2, 9),
      experience_id: params.experienceId,
      reporting_user_id: params.reportingUserId,
      reason: params.reason,
      details: params.details || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    reports.unshift(newReport);
    setStoredReports(reports);
    return true;
  },

  async getModerationReports(): Promise<Report[]> {
    if (isSupabaseConfigured()) {
      const endpoint = '/rest/v1/reports?select=*,experience:experiences(*,image:experience_images(*))&status=eq.pending&order=created_at.desc';
      const raw = await supabaseFetch<any[]>(endpoint);
      return raw.map(r => ({
        id: r.id,
        experience_id: r.experience_id,
        reporting_user_id: r.reporting_user_id,
        reason: r.reason,
        details: r.details,
        status: r.status,
        created_at: r.created_at,
        experience: r.experience ? {
          ...r.experience,
          image: r.experience.image && r.experience.image.length > 0 ? r.experience.image[0] : null,
        } : undefined,
      }));
    }

    const reports = getStoredReports();
    const experiences = getStoredExperiences();
    const expMap = new Map(experiences.map(e => [e.id, e]));

    return reports
      .filter(r => r.status === 'pending')
      .map(r => ({
        ...r,
        experience: expMap.get(r.experience_id),
      }));
  },

  async submitModerationDecision(params: {
    reportId?: string;
    experienceId: string;
    moderatorUserId: string;
    decision: 'dismissed' | 'removed' | 'warning';
    notes?: string;
  }): Promise<boolean> {
    if (isSupabaseConfigured()) {
      // 1. Insert record in moderation_records
      await supabaseFetch('/rest/v1/moderation_records', {
        method: 'POST',
        body: JSON.stringify({
          report_id: params.reportId || null,
          experience_id: params.experienceId,
          moderator_user_id: params.moderatorUserId,
          decision: params.decision,
          notes: params.notes || null,
        }),
      });

      // 2. Update report status if reportId exists
      if (params.reportId) {
        await supabaseFetch(`/rest/v1/reports?id=eq.${params.reportId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: params.decision === 'dismissed' ? 'dismissed' : 'actioned',
          }),
        });
      }

      // 3. If decision is 'removed', set experience status to 'moderated_removed'
      if (params.decision === 'removed') {
        await supabaseFetch(`/rest/v1/experiences?id=eq.${params.experienceId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'moderated_removed' }),
        });
      }

      return true;
    }

    // Local fallback
    if (params.reportId) {
      const reports = getStoredReports();
      const report = reports.find(r => r.id === params.reportId);
      if (report) {
        report.status = params.decision === 'dismissed' ? 'dismissed' : 'actioned';
        setStoredReports(reports);
      }
    }

    if (params.decision === 'removed') {
      const experiences = getStoredExperiences();
      const exp = experiences.find(e => e.id === params.experienceId);
      if (exp) {
        exp.status = 'moderated_removed';
        setStoredExperiences(experiences);
      }
    }

    return true;
  },

  // --------------------------------------------------------------------------
  // ACCOUNT & PROFILE
  // --------------------------------------------------------------------------
  async updateProfile(userId: string, data: { nickname: string; avatar: string }): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const [updated] = await supabaseFetch<Profile[]>(`/rest/v1/profiles?id=eq.${userId}`, {
        method: 'PATCH',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
          nickname: data.nickname,
          avatar: data.avatar,
        }),
      });

      // Update local storage cache
      const session = this.getCurrentSession();
      if (session && session.user.id === userId) {
        session.profile = updated;
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
      }

      return updated;
    }

    const profiles = getStoredProfiles();
    const p = profiles.find(item => item.id === userId);
    if (!p) throw new Error('Profile not found');
    p.nickname = data.nickname;
    p.avatar = data.avatar;
    setStoredProfiles(profiles);

    const session = this.getCurrentSession();
    if (session && session.user.id === userId) {
      session.profile = p;
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session));
    }

    return p;
  },

  async requestAccountDeletion(userId: string, reason?: string): Promise<AccountDeletionRequest> {
    if (isSupabaseConfigured()) {
      const [req] = await supabaseFetch<AccountDeletionRequest[]>('/rest/v1/account_deletion_requests', {
        method: 'POST',
        headers: { 'Prefer': 'return=representation' },
        body: JSON.stringify({
          user_id: userId,
          reason: reason || null,
          status: 'pending',
        }),
      });
      return req;
    }

    const newReq: AccountDeletionRequest = {
      id: 'del-' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      reason: reason || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    return newReq;
  },
};
