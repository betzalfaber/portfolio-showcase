export interface Profile {
  id: string;
  full_name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  location: string;
  email: string;
  phone?: string;
  resume_url: string;
  interests: string[];
  is_available_for_hire: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  screenshots: string[];
  technologies: string[];
  category: 'Full-Stack' | '3D & Graphics' | 'AI & Machine Learning' | 'Cloud & Systems' | 'Cybersecurity' | string;
  github_url: string;
  demo_url: string;
  featured: boolean;
  is_published: boolean;
  architecture_notes?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string | null;
  credential_id: string;
  verification_url: string;
  pdf_url?: string | null;
  image_preview: string;
  category: 'Cloud Architecture' | 'Cybersecurity' | 'Machine Learning' | 'Software Engineering' | 'DevOps' | string;
  featured: boolean;
  is_published: boolean;
  skills_covered?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Databases & Cloud' | 'AI & Machine Learning' | 'Cybersecurity' | 'Tools & DevOps';
  proficiency: number; // 0 - 100
  years_of_experience: number;
  icon?: string;
  description: string;
  featured: boolean;
  order_index: number;
  created_at?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string | null; // null if present
  grade_or_gpa?: string;
  description: string;
  achievements?: string[];
  location: string;
  order_index: number;
  created_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  category: 'Award' | 'Hackathon' | 'Publication' | 'Patent' | 'Recognition';
  badge_icon?: string;
  url?: string;
  featured: boolean;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'x' | 'discord' | 'email' | 'youtube' | string;
  label: string;
  url: string;
  icon?: string;
  is_active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'owner';
}

export interface FilterOptions {
  category?: string;
  search?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'name_asc' | 'featured';
}
