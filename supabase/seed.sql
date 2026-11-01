-- ====================================================================
-- NEXUS PORTFOLIO PLATFORM — DATABASE SEED DATA
-- Clearly marked editable placeholder records
-- ====================================================================

-- 1. Profile
INSERT INTO public.profiles (
  id,
  full_name,
  title,
  tagline,
  bio,
  avatar_url,
  location,
  email,
  phone,
  resume_url,
  interests,
  is_available_for_hire
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '[Placeholder — Your Name]',
  '[Placeholder — Systems Architect & Full-Stack Engineer]',
  'Architecting high-performance digital experiences, scalable cloud backends and immersive 3D graphics.',
  'Welcome to Nexus. I am a software engineer dedicated to building robust software architectures, elegant user interfaces and performant full-stack systems. This portfolio platform features my projects, technical proficiencies, verified certifications and educational credentials. All content here is fully editable via the secure Nexus Administrator Dashboard.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  '[Placeholder — City, Country]',
  '[placeholder.email@nexus-domain.com]',
  '[+1 (555) 019-2834]',
  '#resume-download',
  ARRAY['Distributed Systems', 'Real-time 3D Graphics', 'Cloud Native DevOps', 'Machine Learning Platforms', 'Secure Protocol Design'],
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 2. Projects
INSERT INTO public.projects (
  id,
  slug,
  title,
  short_description,
  full_description,
  cover_image,
  screenshots,
  technologies,
  category,
  github_url,
  demo_url,
  featured,
  is_published,
  architecture_notes,
  order_index
) VALUES 
(
  '10000000-0000-0000-0000-000000000001',
  'nexus-engine',
  '[Project Alpha: Real-Time Distributed Telemetry Engine]',
  'High-throughput telemetry ingestion pipeline processing over 100k events/sec with real-time WebGL visualization.',
  'Engineered an enterprise-grade distributed telemetry system designed to ingest, process, and visualize high-velocity streaming data. Features a custom event broker, microservice aggregation pipeline, and interactive Three.js 3D telemetry dashboard with zero-latency streaming over WebSockets.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Go', 'TypeScript', 'React', 'Three.js', 'PostgreSQL', 'Redis', 'Docker'],
  'Full-Stack',
  'https://github.com/placeholder-user/nexus-engine',
  'https://demo.nexus-engine.example.com',
  TRUE,
  TRUE,
  'Decoupled microservice architecture utilizing event-driven Pub/Sub queues, sub-millisecond in-memory cache, and client-side instanced mesh rendering in WebGL.',
  1
),
(
  '10000000-0000-0000-0000-000000000002',
  'aegis-mesh',
  '[Project Beta: Zero-Trust Mesh Gateway & Auth Cluster]',
  'Decentralized identity and access management system with cryptographically verified token issuance.',
  'A cloud-native security mesh providing fine-grained RBAC and ABAC authorization policies across microservices. Implements hardware-backed cryptographic signing, automated certificate renewal via ACME, and an administrative policy audit interface.',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Rust', 'TypeScript', 'Tailwind CSS', 'OAuth2 / OIDC', 'Kubernetes', 'PostgreSQL'],
  'Cybersecurity',
  'https://github.com/placeholder-user/aegis-mesh',
  'https://demo.aegis-mesh.example.com',
  TRUE,
  TRUE,
  'Zero-trust network layer deployed as an Envoy sidecar proxy with eBPF kernel tracing for malicious anomaly detection.',
  2
),
(
  '10000000-0000-0000-0000-000000000003',
  'hyperion-3d',
  '[Project Gamma: WebGL Celestial Simulation Suite]',
  'Interactive astrophysical orbital mechanics simulator with procedural planetary generation.',
  'A full-featured WebGL and WebAudio simulation engine modeling gravitational N-body interactions, atmospheric ray marching shaders, and procedural biome generation for planetary bodies directly in the browser.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Three.js', 'React Three Fiber', 'GLSL Shaders', 'Web Workers', 'Vite'],
  '3D & Graphics',
  'https://github.com/placeholder-user/hyperion-3d',
  'https://demo.hyperion-3d.example.com',
  TRUE,
  TRUE,
  'Custom compute shaders running on Web Workers and instanced buffer geometries achieving 60 FPS across desktop and mobile devices.',
  3
),
(
  '10000000-0000-0000-0000-000000000004',
  'cortex-flow',
  '[Project Delta: Autonomous Agent Evaluation Harness]',
  'Multi-agent benchmarking framework for verifying LLM reasoning steps with sandboxed execution.',
  'Automated evaluation pipeline designed to stress-test autonomous LLM agents across coding, security, and tool-use challenges with deterministic sandboxing and automated regression reporting.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  ],
  ARRAY['Python', 'FastAPI', 'React', 'Docker Sandboxes', 'PostgreSQL', 'LangGraph'],
  'AI & Machine Learning',
  'https://github.com/placeholder-user/cortex-flow',
  'https://demo.cortex-flow.example.com',
  FALSE,
  TRUE,
  'Asynchronous task orchestrator executing isolated Docker container tasks with memory/CPU limits and real-time output streaming.',
  4
) ON CONFLICT (id) DO NOTHING;

-- 3. Certificates
INSERT INTO public.certificates (
  id,
  name,
  issuing_organization,
  issue_date,
  expiration_date,
  credential_id,
  verification_url,
  pdf_url,
  image_preview,
  category,
  featured,
  is_published,
  skills_covered
) VALUES 
(
  '20000000-0000-0000-0000-000000000001',
  '[Placeholder — AWS Certified Solutions Architect Professional]',
  'Amazon Web Services',
  '2024-03-15',
  '2027-03-15',
  'AWS-PSA-94829104',
  'https://aws.amazon.com/verification?id=AWS-PSA-94829104',
  '#pdf-preview-link',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
  'Cloud Architecture',
  TRUE,
  TRUE,
  ARRAY['Multi-Region Architecture', 'Disaster Recovery', 'Serverless', 'VPC Peering', 'Cost Optimization']
),
(
  '20000000-0000-0000-0000-000000000002',
  '[Placeholder — Certified Kubernetes Security Specialist (CKS)]',
  'Linux Foundation / CNCF',
  '2024-06-20',
  '2027-06-20',
  'CNCF-CKS-8392019',
  'https://www.cncf.io/certification/verify?id=CNCF-CKS-8392019',
  '#pdf-preview-link',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'Cybersecurity',
  TRUE,
  TRUE,
  ARRAY['Cluster Hardening', 'Vulnerability Scanning', 'Pod Security Admission', 'mTLS', 'Falco Auditing']
),
(
  '20000000-0000-0000-0000-000000000003',
  '[Placeholder — Professional Machine Learning Engineer]',
  'Google Cloud',
  '2023-11-10',
  '2025-11-10',
  'GCP-MLE-48201938',
  'https://cloud.google.com/certification/verify?id=GCP-MLE-48201938',
  '#pdf-preview-link',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'Machine Learning',
  TRUE,
  TRUE,
  ARRAY['Vertex AI', 'TensorFlow', 'MLOps Pipelines', 'Feature Stores', 'Hyperparameter Tuning']
),
(
  '20000000-0000-0000-0000-000000000004',
  '[Placeholder — Meta Senior Frontend Engineer Professional]',
  'Meta / Coursera',
  '2023-08-01',
  NULL,
  'META-FE-71930284',
  'https://coursera.org/verify/professional-cert/META-FE-71930284',
  '#pdf-preview-link',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'Software Engineering',
  FALSE,
  TRUE,
  ARRAY['React Architecture', 'Performance Profiling', 'Design Systems', 'Web Accessibility (a11y)']
) ON CONFLICT (id) DO NOTHING;

-- 4. Skills
INSERT INTO public.skills (id, name, category, proficiency, years_of_experience, icon, description, featured, order_index) VALUES
('30000000-0000-0000-0000-000000000001', 'TypeScript / JavaScript', 'Frontend', 95, 5.0, 'Code2', 'Modern ESNext, strong typing, generics, AST transformations and modular architectures.', TRUE, 1),
('30000000-0000-0000-0000-000000000002', 'React & Next.js', 'Frontend', 94, 5.0, 'Layout', 'Concurrent features, server components, state management and atomic design systems.', TRUE, 2),
('30000000-0000-0000-0000-000000000003', 'Three.js & WebGL', 'Frontend', 88, 3.5, 'Sparkles', 'Custom GLSL shaders, camera controllers, lighting, geometry instancing and R3F scenes.', TRUE, 3),
('30000000-0000-0000-0000-000000000004', 'Node.js & Go', 'Backend', 90, 4.5, 'Server', 'Asynchronous event loops, concurrency primitives, REST, GraphQL and gRPC microservices.', TRUE, 4),
('30000000-0000-0000-0000-000000000005', 'PostgreSQL & Supabase', 'Databases & Cloud', 92, 4.0, 'Database', 'Relational design, query optimization, indexing strategies, RLS security policies.', TRUE, 5),
('30000000-0000-0000-0000-000000000006', 'Docker & Kubernetes', 'Tools & DevOps', 86, 3.5, 'Layers', 'Containerization, helm charts, CI/CD automated deployments, cluster ingress and service mesh.', TRUE, 6),
('30000000-0000-0000-0000-000000000007', 'Applied AI & LLMs', 'AI & Machine Learning', 84, 2.5, 'Cpu', 'Embedding generation, vector search (pgvector), RAG pipelines and autonomous agent orchestrations.', TRUE, 7),
('30000000-0000-0000-0000-000000000008', 'AppSec & Zero-Trust', 'Cybersecurity', 82, 3.0, 'ShieldCheck', 'OAuth2/OIDC, cryptographic token verification, TLS configuration, vulnerability remediation.', FALSE, 8)
ON CONFLICT (id) DO NOTHING;

-- 5. Education
INSERT INTO public.education (
  id,
  institution,
  degree,
  field_of_study,
  start_date,
  end_date,
  grade_or_gpa,
  description,
  achievements,
  location,
  order_index
) VALUES 
(
  '40000000-0000-0000-0000-000000000001',
  '[Placeholder — University Name / Institute of Technology]',
  '[Bachelor of Science / Master of Science]',
  'Computer Science & Software Engineering',
  '2019-09-01',
  '2023-06-30',
  '3.92 / 4.00 (Summa Cum Laude Honors)',
  'Specialized in Distributed Systems, Computer Graphics, Operating Systems, Algorithm Complexity, and Information Security.',
  ARRAY[
    'Dean’s Academic Honor List for 8 Consecutive Semesters',
    'Presidential Fellowship for Excellence in Scientific Research',
    'Published Peer-Reviewed Paper in Undergraduate Systems Journal',
    'Captain of Collegiate Competitive Programming Team'
  ],
  '[Placeholder — City, Country]',
  1
) ON CONFLICT (id) DO NOTHING;

-- 6. Achievements
INSERT INTO public.achievements (
  id,
  title,
  organization,
  date,
  description,
  category,
  badge_icon,
  url,
  featured
) VALUES 
(
  '50000000-0000-0000-0000-000000000001',
  '[Placeholder — 1st Place Grand Winner: Global Cloud Hackathon]',
  'Global Developer Foundation',
  '2024-05-18',
  'Awarded 1st place out of 1,200+ competing international teams for developing an automated zero-downtime disaster recovery failover platform.',
  'Hackathon',
  'Trophy',
  'https://hackathon.example.com/winner',
  TRUE
),
(
  '50000000-0000-0000-0000-000000000002',
  '[Placeholder — Outstanding Technical Innovation Award]',
  'National Engineering Council',
  '2023-12-10',
  'Honored for significant contributions to open-source developer tooling and accessible high-performance 3D visualization utilities.',
  'Award',
  'Award',
  'https://council.example.com/awards',
  TRUE
),
(
  '50000000-0000-0000-0000-000000000003',
  '[Placeholder — Open Source Impact Recognition]',
  'Open Collective / GitHub Community',
  '2023-07-22',
  'Recognized for maintaining high-impact community libraries exceeding 250,000 monthly downloads and mentoring junior engineers.',
  'Recognition',
  'Star',
  'https://github.com/placeholder-user',
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- 7. Social Links
INSERT INTO public.social_links (
  id,
  platform,
  label,
  url,
  icon,
  is_active,
  order_index
) VALUES 
('60000000-0000-0000-0000-000000000001', 'github', 'GitHub', 'https://github.com/placeholder-user', 'Github', TRUE, 1),
('60000000-0000-0000-0000-000000000002', 'linkedin', 'LinkedIn', 'https://linkedin.com/in/placeholder-profile', 'Linkedin', TRUE, 2),
('60000000-0000-0000-0000-000000000003', 'x', 'X / Twitter', 'https://x.com/placeholder-handle', 'Twitter', TRUE, 3),
('60000000-0000-0000-0000-000000000004', 'email', 'Direct Mail', 'mailto:contact@placeholder-nexus.com', 'Mail', TRUE, 4)
ON CONFLICT (id) DO NOTHING;
