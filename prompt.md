Build “ResumeForge” — Elite SaaS Resume Builder Platform (MERN Stack)

You are a senior staff engineer and award-winning SaaS product architect with 20+ years of experience at companies like Google, Microsoft, Stripe, Notion, Linear, and Vercel.

Your task is to design and generate a production-grade full-stack SaaS platform called ResumeForge — a modern “Living Career Asset Platform” where users maintain one master career profile and dynamically generate multiple ATS-safe resumes in real-time.

The application must feel like a premium startup product funded by YC or backed by top-tier Silicon Valley VCs.

The product should NOT look like a generic AI-generated CRUD dashboard.

It should feel;

Elegant
Fast
Minimal
Intelligent
Highly interactive
Modern SaaS-grade
Beautifully animated
Performance-optimized
Clean developer architecture
Enterprise scalable
CORE PRODUCT VISION

ResumeForge is NOT just a resume builder.

It is:

a career operating system
a living profile engine
a multi-version resume management platform
an ATS optimization tool
an application tracking system
a personal branding platform

Users maintain ONE master profile and generate many tailored resumes from it.

The system dynamically merges:

master profile data
version-specific overrides
selected template styles
ATS keyword optimization

Everything updates in real-time.

PDF generation must happen entirely on the CLIENT SIDE to keep backend memory usage extremely low for free-tier deployments.

TECH STACK (STRICTLY FOLLOW)
FRONTEND
React 18+
Vite
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
GSAP (only where cinematic)
Zustand for state
React Hook Form
Zod validation
Axios
Lucide React
TipTap Editor
@dnd-kit
@react-pdf/renderer
file-saver
BACKEND
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Auth OR Clerk
REST API architecture
MVC pattern
DEPLOYMENT

Frontend:

Vercel

Backend:

Render Free Tier / Railway

Database:

MongoDB Atlas M0
IMPORTANT ARCHITECTURE RULES
VERY IMPORTANT:

Frontend and backend MUST be in separate folders.

Structure:

resume-forge/
│
├── client/ ← React frontend
├── server/ ← Express backend
├── shared/ ← shared TS types/interfaces
├── docs/
└── README.md

DO NOT mix frontend/backend.

DESIGN SYSTEM REQUIREMENTS

The UI should feel inspired by:

Linear
Notion
Stripe Dashboard
Raycast
Framer
Vercel
Arc Browser
Apple-level polish

The design should:

avoid generic Tailwind SaaS appearance
avoid overusing gradients
avoid template-looking cards
avoid AI-generated feel

Instead create:

subtle depth
soft glass morphism
intelligent spacing
smooth transitions
premium typography
micro-interactions
cinematic hover states
adaptive layout system

Use:

dark mode first
neutral grayscale palette
one elegant accent color
modern typography hierarchy
proper whitespace rhythm
ANIMATION SYSTEM

Animations must feel intentional and premium.

Use:

Framer Motion for UI interactions
GSAP ONLY for hero cinematic interactions
spring-based transitions
smooth stagger animations
subtle hover transforms
scroll-triggered reveals
animated layout transitions

Avoid:

excessive bouncing
flashy gradients
childish motion
over-animated dashboards
RESPONSIVE REQUIREMENTS

The platform must be:

fully responsive
mobile optimized
tablet optimized
desktop-first productivity layout

Special attention:

editor usability on tablets
collapsible panels on mobile
adaptive split layouts
smooth mobile navigation
CORE FEATURES
1. AUTHENTICATION

Implement:

Clerk OR JWT authentication
login
signup
forgot password
protected routes
session persistence
role support (future-ready)

Use:

middleware protection
auth context/store
secure token handling
2. MASTER PROFILE SYSTEM

The entire platform revolves around ONE Master Career Profile.

Users can:

add/edit experiences
education
projects
certifications
skills
links
custom sections
summaries
achievements

Changes should automatically reflect across resumes unless overridden.

3. RESUME VERSIONING ENGINE

Users can:

create multiple resume versions
tailor resumes per company/job
override sections locally
hide/show sections
customize summaries
customize bullets

Need:

deep merge logic
efficient state updates
optimistic UI
4. TEMPLATE ENGINE

Create a dynamic template architecture.

Templates should:

be modular
dynamically loaded
configurable
ATS-safe
customizable

Each template should support:

typography config
spacing config
section order
color system
line heights
margins

Templates stored in DB.

Frontend dynamically renders selected template.

5. LIVE RESUME PREVIEW

Critical feature.

Editor screen:

left panel = editing
right panel = live resume preview

Preview updates INSTANTLY.

Must feel:

smooth
lag-free
highly polished

Use:

memoization
optimized rendering
lazy loading
6. CLIENT-SIDE PDF EXPORT

IMPORTANT:
NO server-side PDF rendering.

PDF generation must happen entirely in browser using:

@react-pdf/renderer
file-saver

Requirements:

downloadable PDF
preview in new tab
loading states
export optimization
ATS-safe typography

Must support:

multi-page resumes
dynamic section heights
page wrapping
hyperlinks
7. ATS SCORE SYSTEM

Implement lightweight ATS scoring:

keyword matching
section completeness
readability checks
metrics usage detection
action verb detection

Display:

live ATS score
optimization suggestions
keyword coverage indicators
8. JOB DESCRIPTION ANALYZER

Users can paste job descriptions.

System should:

extract keywords
highlight missing skills
suggest bullet improvements
recommend summary changes

AI integration should be optional and abstracted.

9. APPLICATION TRACKER

Users can track:

applied jobs
interviews
offers
rejected applications
notes
dates

Need:

Kanban board
status filtering
timeline view
10. PUBLIC WEB RESUME

Generate:

shareable resume URL
SEO-friendly public page
responsive portfolio-style view

Need:

Open Graph support
metadata optimization
printable layout
DATABASE MODELS
User
{
  clerkId,
  email,
  name,
  avatar,
  createdAt
}
MasterProfile
{
  userId,
  personalInfo,
  experiences,
  education,
  skills,
  projects,
  certifications,
  customSections
}
ResumeVersion
{
  userId,
  masterProfileId,
  templateId,
  title,
  jobDescription,
  overrides,
  atsScore,
  applicationStatus,
  lastExportedAt
}
Template
{
  templateId,
  name,
  category,
  thumbnailUrl,
  sectionsOrder,
  styling,
  isAtsSafe
}
FRONTEND STRUCTURE

client/
│
├── src/
│ ├── app/
│ ├── pages/
│ ├── routes/
│ ├── layouts/
│ ├── components/
│ │ ├── dashboard/
│ │ ├── editor/
│ │ ├── preview/
│ │ ├── templates/
│ │ ├── forms/
│ │ ├── ui/
│ │ └── animations/
│ │
│ ├── store/
│ ├── hooks/
│ ├── services/
│ ├── lib/
│ ├── utils/
│ ├── types/
│ ├── styles/
│ └── assets/

BACKEND STRUCTURE

server/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── services/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ ├── validators/
│ ├── types/
│ ├── jobs/
│ └── app.ts

Use:

clean architecture
service layer abstraction
centralized error handling
async middleware
environment validation
modular route registration
API DESIGN

RESTful APIs:

/api/auth
/api/profile
/api/resumes
/api/templates
/api/ats
/api/applications

Requirements:

pagination
filtering
sorting
validation
rate limiting
sanitization
PERFORMANCE REQUIREMENTS

Critical.

Optimize:

React re-renders
bundle size
image loading
PDF generation
Mongo queries

Use:

lazy imports
code splitting
React.memo
Suspense
virtualization if needed
lean() in Mongoose

Backend must remain lightweight enough for:

512 MB Render free tier
SECURITY REQUIREMENTS

Implement:

Helmet
CORS
rate limiting
input sanitization
secure JWT handling
environment variable validation
Mongo injection prevention
XSS protection

Never expose secrets.

DEVELOPER EXPERIENCE

The codebase must feel enterprise-grade.

Need:

reusable architecture
clean naming
scalable folder structure
TypeScript everywhere
shared interfaces
utility abstractions
custom hooks
centralized configs

Code should look like:

senior engineer wrote it
production-ready
maintainable by large teams
ERROR HANDLING

Implement:

global API error handler
frontend error boundaries
toast notifications
loading skeletons
retry handling
graceful fallbacks
UX DETAILS

Need:

command palette
keyboard shortcuts
autosave
undo/redo
onboarding flow
contextual empty states
beautiful loading screens
subtle sounds optional
smart tooltips
LANDING PAGE REQUIREMENTS

The marketing site must feel elite.

Sections:

cinematic hero
interactive resume preview
feature showcase
ATS optimization demo
testimonials
pricing
FAQ
CTA

Hero should feel:

Apple + Linear + Framer inspired

Use:

animated typography
subtle grids
floating UI
premium transitions

NOT generic SaaS hero.

TEMPLATE REQUIREMENTS

Create at least:

Classic ATS
Minimal Modern
Executive
Creative Clean

All templates:

printable
ATS-safe
responsive preview
configurable
DARK MODE

Dark mode must feel premium.

Use:

layered surfaces
soft borders
subtle transparency
elevated panels

Avoid:

pure black backgrounds
neon overload
FINAL DEVELOPMENT EXPECTATIONS

Generate:

scalable architecture
real production patterns
reusable components
typed APIs
modular services
enterprise folder structure
elegant UI
beautiful UX
optimized performance

The output should feel like:

a real funded startup product
not a tutorial project
not boilerplate
not AI-generated

Every component, animation, interaction, spacing system, and architecture decision should feel deliberate and senior-level.

Build the platform as if it will support millions of users in the future while still being optimized for free-tier deployment today.
