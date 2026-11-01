import { supabase, isSupabaseConfigured } from './supabase';
import {
  Profile,
  Project,
  Certificate,
  Skill,
  Education,
  Achievement,
  SocialLink,
  ContactMessage,
  FilterOptions
} from '../types';
import {
  initialProfile,
  initialProjects,
  initialCertificates,
  initialSkills,
  initialEducation,
  initialAchievements,
  initialSocialLinks
} from './mockData';

// Storage helper for local fallback persistence
const LOCAL_STORAGE_KEYS = {
  PROFILE: 'nexus_profile',
  PROJECTS: 'nexus_projects',
  CERTIFICATES: 'nexus_certificates',
  SKILLS: 'nexus_skills',
  EDUCATION: 'nexus_education',
  ACHIEVEMENTS: 'nexus_achievements',
  SOCIAL_LINKS: 'nexus_social_links',
  MESSAGES: 'nexus_messages',
};

function getLocalData<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving to localStorage [${key}]`, err);
  }
}

// ----------------------------------------------------------------------
// Profile API
// ----------------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
      if (!error && data) return data as Profile;
    } catch (err) {
      console.warn('Failed to fetch profile from Supabase, falling back to local data.', err);
    }
  }
  return getLocalData<Profile>(LOCAL_STORAGE_KEYS.PROFILE, initialProfile);
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ ...profile, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Profile;
  }
  const current = getLocalData<Profile>(LOCAL_STORAGE_KEYS.PROFILE, initialProfile);
  const updated = { ...current, ...profile, updated_at: new Date().toISOString() };
  setLocalData(LOCAL_STORAGE_KEYS.PROFILE, updated);
  return updated;
}

// ----------------------------------------------------------------------
// Projects API
// ----------------------------------------------------------------------
export async function getProjects(options: { onlyPublished?: boolean; category?: string; search?: string } = {}): Promise<Project[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('projects').select('*').order('order_index', { ascending: true });
      if (options.onlyPublished) {
        query = query.eq('is_published', true);
      }
      if (options.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }
      if (options.search) {
        query = query.ilike('title', `%${options.search}%`);
      }
      const { data, error } = await query;
      if (!error && data) return data as Project[];
    } catch (err) {
      console.warn('Projects fetch failed from Supabase, falling back.', err);
    }
  }

  let projects = getLocalData<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS, initialProjects);
  if (options.onlyPublished) {
    projects = projects.filter((p) => p.is_published);
  }
  if (options.category && options.category !== 'All') {
    projects = projects.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options.search) {
    const term = options.search.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.short_description.toLowerCase().includes(term) ||
        p.technologies.some((t) => t.toLowerCase().includes(term))
    );
  }
  return projects.sort((a, b) => a.order_index - b.order_index);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.warn('Project by slug failed from Supabase, falling back.', err);
    }
  }

  const projects = getLocalData<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS, initialProjects);
  const found = projects.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const isNew = !project.id;
  const projectToSave = {
    ...project,
    id: project.id || crypto.randomUUID(),
    updated_at: new Date().toISOString(),
    created_at: project.created_at || new Date().toISOString(),
    order_index: project.order_index ?? 0,
    screenshots: project.screenshots || [],
    technologies: project.technologies || [],
  } as Project;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('projects').upsert(projectToSave).select().single();
    if (error) throw new Error(error.message);
    return data as Project;
  }

  const projects = getLocalData<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS, initialProjects);
  let updatedList: Project[];
  if (isNew) {
    updatedList = [...projects, projectToSave];
  } else {
    updatedList = projects.map((p) => (p.id === projectToSave.id ? projectToSave : p));
  }
  setLocalData(LOCAL_STORAGE_KEYS.PROJECTS, updatedList);
  return projectToSave;
}

export async function deleteProject(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const projects = getLocalData<Project[]>(LOCAL_STORAGE_KEYS.PROJECTS, initialProjects);
  setLocalData(
    LOCAL_STORAGE_KEYS.PROJECTS,
    projects.filter((p) => p.id !== id)
  );
}

// ----------------------------------------------------------------------
// Certificates API
// ----------------------------------------------------------------------
export async function getCertificates(options: FilterOptions & { onlyPublished?: boolean } = {}): Promise<Certificate[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('certificates').select('*');
      if (options.onlyPublished) {
        query = query.eq('is_published', true);
      }
      if (options.category && options.category !== 'All') {
        query = query.eq('category', options.category);
      }
      if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
      }
      const { data, error } = await query;
      if (!error && data) {
        let certs = data as Certificate[];
        if (options.sortBy === 'date_asc') {
          certs.sort((a, b) => new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime());
        } else if (options.sortBy === 'name_asc') {
          certs.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          // default date_desc
          certs.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
        }
        return certs;
      }
    } catch (err) {
      console.warn('Certificates fetch failed from Supabase, falling back.', err);
    }
  }

  let certs = getLocalData<Certificate[]>(LOCAL_STORAGE_KEYS.CERTIFICATES, initialCertificates);
  if (options.onlyPublished) {
    certs = certs.filter((c) => c.is_published);
  }
  if (options.category && options.category !== 'All') {
    certs = certs.filter((c) => c.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options.search) {
    const term = options.search.toLowerCase();
    certs = certs.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.issuing_organization.toLowerCase().includes(term) ||
        c.credential_id.toLowerCase().includes(term) ||
        c.skills_covered?.some((s) => s.toLowerCase().includes(term))
    );
  }
  if (options.sortBy === 'date_asc') {
    certs.sort((a, b) => new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime());
  } else if (options.sortBy === 'name_asc') {
    certs.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    certs.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
  }
  return certs;
}

export async function saveCertificate(certificate: Partial<Certificate>): Promise<Certificate> {
  const isNew = !certificate.id;
  const certToSave = {
    ...certificate,
    id: certificate.id || crypto.randomUUID(),
    updated_at: new Date().toISOString(),
    created_at: certificate.created_at || new Date().toISOString(),
    skills_covered: certificate.skills_covered || [],
  } as Certificate;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('certificates').upsert(certToSave).select().single();
    if (error) throw new Error(error.message);
    return data as Certificate;
  }

  const certs = getLocalData<Certificate[]>(LOCAL_STORAGE_KEYS.CERTIFICATES, initialCertificates);
  const updatedList = isNew ? [...certs, certToSave] : certs.map((c) => (c.id === certToSave.id ? certToSave : c));
  setLocalData(LOCAL_STORAGE_KEYS.CERTIFICATES, updatedList);
  return certToSave;
}

export async function deleteCertificate(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const certs = getLocalData<Certificate[]>(LOCAL_STORAGE_KEYS.CERTIFICATES, initialCertificates);
  setLocalData(
    LOCAL_STORAGE_KEYS.CERTIFICATES,
    certs.filter((c) => c.id !== id)
  );
}

// ----------------------------------------------------------------------
// Skills API
// ----------------------------------------------------------------------
export async function getSkills(category?: string): Promise<Skill[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('skills').select('*').order('order_index', { ascending: true });
      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data) return data as Skill[];
    } catch (err) {
      console.warn('Skills fetch failed from Supabase, falling back.', err);
    }
  }

  let skills = getLocalData<Skill[]>(LOCAL_STORAGE_KEYS.SKILLS, initialSkills);
  if (category && category !== 'All') {
    skills = skills.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }
  return skills.sort((a, b) => a.order_index - b.order_index);
}

export async function saveSkill(skill: Partial<Skill>): Promise<Skill> {
  const isNew = !skill.id;
  const skillToSave = {
    ...skill,
    id: skill.id || crypto.randomUUID(),
    proficiency: skill.proficiency ?? 80,
    years_of_experience: skill.years_of_experience ?? 1,
    order_index: skill.order_index ?? 0,
    created_at: skill.created_at || new Date().toISOString(),
  } as Skill;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('skills').upsert(skillToSave).select().single();
    if (error) throw new Error(error.message);
    return data as Skill;
  }

  const list = getLocalData<Skill[]>(LOCAL_STORAGE_KEYS.SKILLS, initialSkills);
  const updatedList = isNew ? [...list, skillToSave] : list.map((s) => (s.id === skillToSave.id ? skillToSave : s));
  setLocalData(LOCAL_STORAGE_KEYS.SKILLS, updatedList);
  return skillToSave;
}

export async function deleteSkill(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const list = getLocalData<Skill[]>(LOCAL_STORAGE_KEYS.SKILLS, initialSkills);
  setLocalData(
    LOCAL_STORAGE_KEYS.SKILLS,
    list.filter((s) => s.id !== id)
  );
}

// ----------------------------------------------------------------------
// Education API
// ----------------------------------------------------------------------
export async function getEducation(): Promise<Education[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('education').select('*').order('order_index', { ascending: true });
      if (!error && data) return data as Education[];
    } catch (err) {
      console.warn('Education fetch failed from Supabase, falling back.', err);
    }
  }
  return getLocalData<Education[]>(LOCAL_STORAGE_KEYS.EDUCATION, initialEducation);
}

export async function saveEducation(edu: Partial<Education>): Promise<Education> {
  const isNew = !edu.id;
  const eduToSave = {
    ...edu,
    id: edu.id || crypto.randomUUID(),
    order_index: edu.order_index ?? 0,
    achievements: edu.achievements || [],
    created_at: edu.created_at || new Date().toISOString(),
  } as Education;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('education').upsert(eduToSave).select().single();
    if (error) throw new Error(error.message);
    return data as Education;
  }

  const list = getLocalData<Education[]>(LOCAL_STORAGE_KEYS.EDUCATION, initialEducation);
  const updatedList = isNew ? [...list, eduToSave] : list.map((e) => (e.id === eduToSave.id ? eduToSave : e));
  setLocalData(LOCAL_STORAGE_KEYS.EDUCATION, updatedList);
  return eduToSave;
}

export async function deleteEducation(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const list = getLocalData<Education[]>(LOCAL_STORAGE_KEYS.EDUCATION, initialEducation);
  setLocalData(
    LOCAL_STORAGE_KEYS.EDUCATION,
    list.filter((e) => e.id !== id)
  );
}

// ----------------------------------------------------------------------
// Achievements API
// ----------------------------------------------------------------------
export async function getAchievements(): Promise<Achievement[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('achievements').select('*').order('date', { ascending: false });
      if (!error && data) return data as Achievement[];
    } catch (err) {
      console.warn('Achievements fetch failed from Supabase, falling back.', err);
    }
  }
  return getLocalData<Achievement[]>(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
}

export async function saveAchievement(ach: Partial<Achievement>): Promise<Achievement> {
  const isNew = !ach.id;
  const toSave = {
    ...ach,
    id: ach.id || crypto.randomUUID(),
    created_at: ach.created_at || new Date().toISOString(),
  } as Achievement;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('achievements').upsert(toSave).select().single();
    if (error) throw new Error(error.message);
    return data as Achievement;
  }

  const list = getLocalData<Achievement[]>(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
  const updatedList = isNew ? [...list, toSave] : list.map((a) => (a.id === toSave.id ? toSave : a));
  setLocalData(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, updatedList);
  return toSave;
}

export async function deleteAchievement(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const list = getLocalData<Achievement[]>(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
  setLocalData(
    LOCAL_STORAGE_KEYS.ACHIEVEMENTS,
    list.filter((a) => a.id !== id)
  );
}

// ----------------------------------------------------------------------
// Social Links API
// ----------------------------------------------------------------------
export async function getSocialLinks(): Promise<SocialLink[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('social_links').select('*').eq('is_active', true).order('order_index', { ascending: true });
      if (!error && data) return data as SocialLink[];
    } catch (err) {
      console.warn('Social links fetch failed from Supabase, falling back.', err);
    }
  }
  return getLocalData<SocialLink[]>(LOCAL_STORAGE_KEYS.SOCIAL_LINKS, initialSocialLinks);
}

export async function saveSocialLink(link: Partial<SocialLink>): Promise<SocialLink> {
  const isNew = !link.id;
  const toSave = {
    ...link,
    id: link.id || crypto.randomUUID(),
    is_active: link.is_active ?? true,
  } as SocialLink;

  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('social_links').upsert(toSave).select().single();
    if (error) throw new Error(error.message);
    return data as SocialLink;
  }

  const list = getLocalData<SocialLink[]>(LOCAL_STORAGE_KEYS.SOCIAL_LINKS, initialSocialLinks);
  const updatedList = isNew ? [...list, toSave] : list.map((s) => (s.id === toSave.id ? toSave : s));
  setLocalData(LOCAL_STORAGE_KEYS.SOCIAL_LINKS, updatedList);
  return toSave;
}

// ----------------------------------------------------------------------
// Contact Messages API
// ----------------------------------------------------------------------
export async function submitContactMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('contact_messages').insert({
      name: msg.name.trim(),
      email: msg.email.trim(),
      subject: msg.subject.trim(),
      message: msg.message.trim(),
    });
    if (error) throw new Error(error.message);
    return;
  }

  // Local fallback
  const messages = getLocalData<ContactMessage[]>(LOCAL_STORAGE_KEYS.MESSAGES, []);
  const newMsg: ContactMessage = {
    id: crypto.randomUUID(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  setLocalData(LOCAL_STORAGE_KEYS.MESSAGES, [newMsg, ...messages]);
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (err) {
      console.warn('Contact messages fetch error from Supabase, falling back.', err);
    }
  }
  return getLocalData<ContactMessage[]>(LOCAL_STORAGE_KEYS.MESSAGES, []);
}

export async function deleteContactMessage(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return;
  }
  const messages = getLocalData<ContactMessage[]>(LOCAL_STORAGE_KEYS.MESSAGES, []);
  setLocalData(
    LOCAL_STORAGE_KEYS.MESSAGES,
    messages.filter((m) => m.id !== id)
  );
}

// ----------------------------------------------------------------------
// File Storage Upload API
// ----------------------------------------------------------------------
export async function uploadPortfolioMedia(file: File, bucket = 'portfolio-media'): Promise<string> {
  // Validate file size (< 10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds the 10MB limit.');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not supported. Allowed: JPEG, PNG, WEBP, GIF, SVG, PDF.');
  }

  if (isSupabaseConfigured) {
    const ext = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Fallback: convert to Object URL or Data URL for previewing
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
