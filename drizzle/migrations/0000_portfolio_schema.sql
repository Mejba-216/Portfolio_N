-- Portfolio schema: tables, grants, RLS, storage policies, seed data

-- ============ ROLES ============
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read their own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

-- ============ UPDATED_AT TRIGGER ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ PROFILE ============
create table public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default '',
  title text not null default '',
  bio text not null default '',
  summary text not null default '',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  photo_url text,
  resume_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.profile to anon;
grant select, insert, update, delete on public.profile to authenticated;
grant all on public.profile to service_role;

alter table public.profile enable row level security;

create policy "Public can read profile" on public.profile for select to anon using (true);
create policy "Authed can read profile" on public.profile for select to authenticated using (true);
create policy "Admins can modify profile" on public.profile for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger profile_updated_at before update on public.profile
  for each row execute function public.set_updated_at();

-- ============ SITE SETTINGS ============
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Portfolio',
  tagline text not null default '',
  footer_text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

create policy "Public can read settings" on public.site_settings for select to anon using (true);
create policy "Authed can read settings" on public.site_settings for select to authenticated using (true);
create policy "Admins can modify settings" on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============ EDUCATION ============
create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  location text not null default '',
  start_date date,
  end_date date,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.education to anon;
grant select, insert, update, delete on public.education to authenticated;
grant all on public.education to service_role;

alter table public.education enable row level security;

create policy "Public can read education" on public.education for select to anon using (true);
create policy "Authed can read education" on public.education for select to authenticated using (true);
create policy "Admins can modify education" on public.education for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger education_updated_at before update on public.education
  for each row execute function public.set_updated_at();

-- ============ EXPERIENCE ============
create table public.experience (
  id uuid primary key default gen_random_uuid(),
  position text not null,
  company text not null,
  location text not null default '',
  start_date date,
  end_date date,
  description text not null default '',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.experience to anon;
grant select, insert, update, delete on public.experience to authenticated;
grant all on public.experience to service_role;

alter table public.experience enable row level security;

create policy "Public can read experience" on public.experience for select to anon using (true);
create policy "Authed can read experience" on public.experience for select to authenticated using (true);
create policy "Admins can modify experience" on public.experience for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger experience_updated_at before update on public.experience
  for each row execute function public.set_updated_at();

-- ============ SKILLS ============
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  level int not null default 3 check (level between 1 and 5),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.skills to anon;
grant select, insert, update, delete on public.skills to authenticated;
grant all on public.skills to service_role;

alter table public.skills enable row level security;

create policy "Public can read skills" on public.skills for select to anon using (true);
create policy "Authed can read skills" on public.skills for select to authenticated using (true);
create policy "Admins can modify skills" on public.skills for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger skills_updated_at before update on public.skills
  for each row execute function public.set_updated_at();

-- ============ CERTIFICATIONS ============
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null default '',
  issue_date date,
  credential_id text not null default '',
  credential_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.certifications to anon;
grant select, insert, update, delete on public.certifications to authenticated;
grant all on public.certifications to service_role;

alter table public.certifications enable row level security;

create policy "Public can read certifications" on public.certifications for select to anon using (true);
create policy "Authed can read certifications" on public.certifications for select to authenticated using (true);
create policy "Admins can modify certifications" on public.certifications for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger certifications_updated_at before update on public.certifications
  for each row execute function public.set_updated_at();

-- ============ LANGUAGES ============
create table public.languages (
  id uuid primary key default gen_random_uuid(),
  language text not null,
  level text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.languages to anon;
grant select, insert, update, delete on public.languages to authenticated;
grant all on public.languages to service_role;

alter table public.languages enable row level security;

create policy "Public can read languages" on public.languages for select to anon using (true);
create policy "Authed can read languages" on public.languages for select to authenticated using (true);
create policy "Admins can modify languages" on public.languages for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger languages_updated_at before update on public.languages
  for each row execute function public.set_updated_at();

-- ============ AWARDS ============
create table public.awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null default '',
  award_date date,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.awards to anon;
grant select, insert, update, delete on public.awards to authenticated;
grant all on public.awards to service_role;

alter table public.awards enable row level security;

create policy "Public can read awards" on public.awards for select to anon using (true);
create policy "Authed can read awards" on public.awards for select to authenticated using (true);
create policy "Admins can modify awards" on public.awards for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger awards_updated_at before update on public.awards
  for each row execute function public.set_updated_at();

-- ============ PROJECTS ============
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  features text[] not null default '{}',
  technologies text[] not null default '{}',
  cover_image_url text,
  github_url text not null default '',
  live_url text not null default '',
  year int,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_slug_idx on public.projects (slug);
create index projects_published_idx on public.projects (published, sort_order);

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;

alter table public.projects enable row level security;

create policy "Public can read published projects" on public.projects for select to anon
  using (published = true);
create policy "Authed can read projects" on public.projects for select to authenticated using (true);
create policy "Admins can modify projects" on public.projects for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ============ PROJECT IMAGES ============
create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, sort_order);

grant select on public.project_images to anon;
grant select, insert, update, delete on public.project_images to authenticated;
grant all on public.project_images to service_role;

alter table public.project_images enable row level security;

create policy "Public can read project images" on public.project_images for select to anon using (true);
create policy "Authed can read project images" on public.project_images for select to authenticated using (true);
create policy "Admins can modify project images" on public.project_images for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ============ ACHIEVEMENTS ============
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null default '',
  category text not null default 'Other',
  achievement_date date,
  description text not null default '',
  certificate_url text,
  certificate_type text not null default '',
  credential_id text not null default '',
  credential_url text not null default '',
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.achievements to anon;
grant select, insert, update, delete on public.achievements to authenticated;
grant all on public.achievements to service_role;

alter table public.achievements enable row level security;

create policy "Public can read achievements" on public.achievements for select to anon using (true);
create policy "Authed can read achievements" on public.achievements for select to authenticated using (true);
create policy "Admins can modify achievements" on public.achievements for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger achievements_updated_at before update on public.achievements
  for each row execute function public.set_updated_at();

-- ============ SOCIAL LINKS ============
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.social_links to anon;
grant select, insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;

alter table public.social_links enable row level security;

create policy "Public can read social links" on public.social_links for select to anon using (true);
create policy "Authed can read social links" on public.social_links for select to authenticated using (true);
create policy "Admins can modify social links" on public.social_links for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger social_links_updated_at before update on public.social_links
  for each row execute function public.set_updated_at();

-- ============ MESSAGES ============
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

grant insert on public.messages to anon;
grant select, insert, update, delete on public.messages to authenticated;
grant all on public.messages to service_role;

alter table public.messages enable row level security;

create policy "Anyone can send a message" on public.messages for insert to anon
  with check (true);
create policy "Authed can send a message" on public.messages for insert to authenticated
  with check (true);
create policy "Admins can read messages" on public.messages for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update messages" on public.messages for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete messages" on public.messages for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ============ STORAGE POLICIES ============
create policy "Anyone can read portfolio files" on storage.objects for select
  using (bucket_id in ('profile-images', 'project-images', 'achievement-certificates', 'resume-files'));
create policy "Admins can upload portfolio files" on storage.objects for insert to authenticated
  with check (bucket_id in ('profile-images', 'project-images', 'achievement-certificates', 'resume-files')
    and public.has_role(auth.uid(), 'admin'));
create policy "Admins can update portfolio files" on storage.objects for update to authenticated
  using (bucket_id in ('profile-images', 'project-images', 'achievement-certificates', 'resume-files')
    and public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete portfolio files" on storage.objects for delete to authenticated
  using (bucket_id in ('profile-images', 'project-images', 'achievement-certificates', 'resume-files')
    and public.has_role(auth.uid(), 'admin'));

-- ============ SEED DATA ============
insert into public.profile (full_name, title, bio, summary, location, email, phone, photo_url, resume_url) values (
  'Md. Nahid Niaz Nayan',
  'Computer Science Undergraduate | IT & Digital Media Specialist',
  'Pursuing a Bachelor''s degree in Computer Science and Engineering at BRAC University. Serving as Director of IT at the BRAC University Natural Sciences Club and Assistant Director, HR at the BRAC University Response Team, with strong skills in Python, digital media creation, web platforms, and data management.',
  'Undergraduate student in Computer Science and Engineering at BRAC University with extensive hands-on experience in IT operations, digital branding, multimedia content creation, and team leadership. Skilled in Python, object-oriented programming, discrete mathematics, Canva Pro graphic design, CapCut video editing, and modern web tools.',
  'Dhaka, Bangladesh',
  'nahid.niaz.nayan@g.bracu.ac.bd',
  '01701664688',
  '/Picture/Nayan.jpg',
  '/Cv.pdf'
);

insert into public.site_settings (site_name, tagline, footer_text) values (
  'Md. Nahid Niaz Nayan',
  'Computer Science Undergraduate | IT & Digital Media Specialist',
  'Md. Nahid Niaz Nayan. All rights reserved.'
);

insert into public.education (degree, institution, location, start_date, end_date, description, sort_order) values
  ('B.Sc. in Computer Science & Engineering', 'BRAC University', 'Dhaka, Bangladesh', '2023-01-01', null, 'Undergraduate coursework focusing on Python, Object-Oriented Programming (OOP), Data Structures, Algorithms, and Discrete Mathematics while actively leading IT and HR operations in university student clubs.', 0),
  ('Higher Secondary Certificate (HSC) — Science', 'Govt. Edward College, Pabna', 'Pabna, Bangladesh', '2019-07-01', '2021-12-01', 'Completed Higher Secondary Certificate in Science division with a perfect GPA of 5.00/5.00.', 1),
  ('Secondary School Certificate (SSC) — Science', 'Bhangoora Biggan School & College', 'Pabna, Bangladesh', '2014-01-01', '2019-05-01', 'Completed Secondary School Certificate curriculum with strong foundations in science and mathematics.', 2);

insert into public.experience (position, company, location, start_date, end_date, description, technologies, sort_order) values
  ('Director of IT', 'BRAC University Natural Sciences Club (BUNSC)', 'Dhaka, Bangladesh', '2024-01-01', '2025-12-31', 'Created visually compelling posters for almost all BRAC University Natural Science Club events using Canva Pro, elevating the club''s branding and outreach. Led social media management and video editing with Canva & CapCut, ensuring consistent, high-quality content that effectively engaged the university community.', array['Canva Pro','CapCut','Social Media Strategy','Digital Branding','Content Planning','IT Operations'], 0),
  ('Assistant Director, Human Resources', 'BRAC University Response Team', 'Dhaka, Bangladesh', '2024-01-01', '2025-12-31', 'Efficiently managed organizational data and documentation using Google Sheets and Docs, ensuring high accuracy and smooth HR operations within the BRAC University Response Team. Strengthened team communication and relationships while consistently meeting deadlines.', array['Google Sheets','Google Docs','HR Operations','Data Management','Team Collaboration'], 1);

insert into public.skills (name, category, level, sort_order) values
  ('Python', 'Programming & Core CS', 4, 0),
  ('Object-Oriented Programming (OOP)', 'Programming & Core CS', 4, 1),
  ('Discrete Mathematics', 'Programming & Core CS', 4, 2),
  ('Data Structures & Algorithms', 'Programming & Core CS', 3, 3),
  ('WordPress Web Development', 'Web & Digital Platforms', 4, 4),
  ('Squarespace Web Design', 'Web & Digital Platforms', 4, 5),
  ('Search Engine Optimization (SEO)', 'Web & Digital Platforms', 4, 6),
  ('Google Ads Campaigns', 'Web & Digital Platforms', 4, 7),
  ('Canva Pro Poster & Graphic Design', 'Creative Media & Design', 5, 8),
  ('CapCut Video Editing & Production', 'Creative Media & Design', 5, 9),
  ('Digital Branding & Visual Identity', 'Creative Media & Design', 5, 10),
  ('Social Media Strategy & Growth', 'Creative Media & Design', 5, 11),
  ('Content Planning & Scheduling', 'Creative Media & Design', 5, 12),
  ('Google Sheets (Data Management)', 'Productivity & Operations', 5, 13),
  ('Microsoft Office (Word, Excel, PowerPoint)', 'Productivity & Operations', 5, 14),
  ('Professional Email Writing', 'Productivity & Operations', 5, 15),
  ('Team Leadership & Collaboration', 'Productivity & Operations', 5, 16);

insert into public.certifications (name, organization, issue_date, credential_id, credential_url, sort_order) values
  ('Build a free website with WordPress', 'Coursera Project Network', '2024-08-01', 'J711I5U5XB9H', 'https://www.coursera.org/account/accomplishments/records/J711I5U5XB9H', 0),
  ('Introduction to Microsoft Excel', 'Coursera Project Network', '2024-08-01', 'GR9LRG9EKF47', 'https://www.coursera.org/account/accomplishments/records/GR9LRG9EKF47', 1),
  ('Google Ads for Beginners', 'Coursera', '2024-08-01', '6HPC189OPD2N', 'https://www.coursera.org/account/accomplishments/records/6HPC189OPD2N', 2),
  ('Email Writing', '10 Minute School', '2024-08-01', '66c22fc3d7484', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', 3),
  ('Stage Drama (Residential Semester Extra-Curricular)', 'BRAC University', '2024-02-01', '', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', 4),
  ('Search Engine Optimization (SEO) with Squarespace', 'Coursera Project Network', '2024-04-10', 'COURSERA-SEO-02', 'https://www.coursera.org', 5);

insert into public.languages (language, level, sort_order) values
  ('Bengali', 'Native', 0),
  ('English', 'Professional Working Proficiency', 1);

insert into public.awards (title, organization, award_date, description, sort_order) values
  ('Academic Excellence — HSC GPA 5.00', 'Govt. Edward College, Pabna & Education Board', '2021-12-01', 'Achieved the highest distinction of GPA 5.00 (out of 5.00) in the Higher Secondary Certificate (HSC) in Science group.', 0);

insert into public.projects (title, slug, short_description, description, features, technologies, github_url, live_url, year, featured, published, sort_order) values
  ('BUNSC Event Branding & Digital Media Outreach', 'bunsc-branding-media', 'End-to-end digital branding, promotional poster design, and video campaigns for BRAC University Natural Sciences Club.', 'As Director of IT at the BRAC University Natural Sciences Club, directed and executed end-to-end digital branding and multimedia campaigns for major campus events, seminars, and science exhibitions. Created visually compelling posters using Canva Pro, edited dynamic video trailers with CapCut, and scheduled social media releases to maximize student engagement.', array['Complete event visual branding and themed poster suites created with Canva Pro','High-engagement video reels, trailers, and recap highlights produced using CapCut','Strategic multi-platform social media scheduling and community engagement','Coordinated with executive leadership to elevate club visibility across BRAC University'], array['Canva Pro','CapCut','Digital Branding','Social Media Strategy','Content Planning'], '', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', 2024, true, true, 0),
  ('HR & Operations Data Management System', 'response-team-hr-system', 'Structured operational data and documentation workflow for BRAC University Response Team.', 'Designed and managed structured operational data systems using Google Sheets and Google Workspace for the BRAC University Response Team. Maintained accurate member registries, tracked event logistics, scheduled shifts, and established standardized documentation protocols to ensure seamless HR operations and timely communications.', array['Structured member databases and operational records using Google Sheets','Attendance tracking and dynamic shift management for volunteer response teams','Standardized HR documentation templates and reporting workflows in Google Docs','Enhanced team communication channels to meet operational deadlines reliably'], array['Google Sheets','Google Docs','Data Management','Operations Management','Team Communication'], '', '', 2024, true, true, 1),
  ('Python Object-Oriented Software Projects', 'python-oop-projects', 'Modular software applications applying object-oriented design patterns and discrete mathematics in Python.', 'Developed modular software applications applying object-oriented programming principles (encapsulation, inheritance, polymorphism, and abstraction) alongside discrete mathematical algorithms. Focused on clean code organization, data modeling, and algorithmic problem solving as part of the Computer Science & Engineering curriculum at BRAC University.', array['Object-oriented class hierarchies and modular architectural components','Implementation of discrete mathematical concepts and algorithmic logic','Robust input validation, structured test cases, and exception handling','Emphasis on code reusability, maintainability, and clean architecture'], array['Python','OOP','Discrete Mathematics','Algorithms','Data Structures'], '', '', 2023, true, true, 2),
  ('Responsive CMS & SEO Web Development', 'responsive-web-seo-development', 'Responsive website design, CMS deployment, and on-page search engine optimization.', 'Designed and configured functional, mobile-friendly websites on WordPress and Squarespace. Implemented on-page search engine optimization (SEO) techniques, organized content hierarchies, optimized page loading speeds, and integrated marketing practices via Google Ads principles to drive discovery.', array['Fully responsive web layouts tailored for desktop, tablet, and mobile displays','Search engine optimization (SEO) including meta descriptions, headings, and semantic hierarchy','Intuitive navigation structure and content categorization','Integration of digital marketing and Google Ads best practices'], array['WordPress','Squarespace','SEO','Web Design','Google Ads'], '', '', 2024, true, true, 3);

insert into public.achievements (title, organization, category, achievement_date, description, credential_id, credential_url, featured, sort_order) values
  ('Director of IT Leadership Appointment', 'BRAC University Natural Sciences Club', 'Leadership', '2024-01-01', 'Appointed as Director of IT in recognition of exceptional contribution to digital branding, event promotions, and creative multimedia outreach for club initiatives.', '', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', true, 0),
  ('Stage Drama — Extra Curricular Activity', 'BRAC University', 'Leadership & Cultural', '2024-02-01', 'Successful completion of STAGE DRAMA as an Extra Curricular Activity at Residential Semester, BRAC University.', '', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', true, 1),
  ('Email Writing Professional Certification', '10 Minute School', 'Professional Certification', '2024-08-01', 'Certified professional competence in formal email writing, business communication, and professional correspondence.', '66c22fc3d7484', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', true, 2),
  ('Build a free website with WordPress', 'Coursera Project Network', 'Professional Certification', '2024-08-01', 'Guided project certification covering responsive website architecture, page design, themes, and content management on WordPress.', 'J711I5U5XB9H', 'https://www.coursera.org/account/accomplishments/records/J711I5U5XB9H', true, 3),
  ('Introduction to Microsoft Excel', 'Coursera Project Network', 'Professional Certification', '2024-08-01', 'Hands-on certification demonstrating spreadsheet data organization, formulas, functions, formatting, and analysis workflows.', 'GR9LRG9EKF47', 'https://www.coursera.org/account/accomplishments/records/GR9LRG9EKF47', true, 4),
  ('Google Ads for Beginners', 'Coursera', 'Professional Certification', '2024-08-01', 'Hands-on guided certification in search engine advertising, keyword targeting, ad campaign structure, and conversion bidding strategies.', '6HPC189OPD2N', 'https://www.coursera.org/account/accomplishments/records/6HPC189OPD2N', true, 5),
  ('Search Engine Optimization (SEO) Certification', 'Coursera Project Network', 'Professional Certification', '2024-04-10', 'Mastered on-page and architectural SEO strategies to elevate website visibility and search rankings.', 'COURSERA-SEO-02', 'https://www.coursera.org', false, 6),
  ('Assistant Director of Human Resources Appointment', 'BRAC University Response Team', 'Leadership & Management', '2024-01-01', 'Selected to lead HR operations, data management workflows, and internal team communication for the university emergency and response student organization.', '', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', false, 7),
  ('HSC GPA 5.00 Academic Excellence', 'Govt. Edward College, Pabna', 'Academic', '2021-12-01', 'Achieved maximum GPA 5.00 in the Higher Secondary Certificate (Science group), reflecting strong academic rigor in physics, chemistry, mathematics, and biology.', '', '', false, 8);

insert into public.social_links (platform, url, sort_order) values
  ('LinkedIn', 'https://www.linkedin.com/in/md-nahid-niaz-nayan', 0),
  ('Email', 'mailto:nahid.niaz.nayan@g.bracu.ac.bd', 1);