export type DomainID = 'design' | 'development' | 'ai' | 'backend' | 'boilerplates' | (string & {});

export type SubcategoryID =
  // Design subcategories
  | 'ui-primitives'
  | 'motion-effects'
  | 'spatial-3d'
  | 'iconography'
  | 'color-gradients'
  | 'typography'
  // Development subcategories
  | 'css-engines'
  | 'state-url'
  | 'animation-engines'
  | 'webgl-shaders'
  | 'headless-hooks'
  // AI subcategories
  | 'gen-ui'
  | 'ai-editors'
  | 'ai-sdk'
  | 'client-ai'
  | 'gen-media'
  // Backend subcategories
  | 'serverless-db'
  | 'auth-identity'
  | 'orms-schemas'
  | 'hosting-edge'
  // Boilerplates subcategories
  | 'nextjs-starters'
  | 'ai-saas-kits'
  | 'mobile-starters'
  | (string & {});

export interface SubcategoryMeta {
  id: SubcategoryID;
  label: string;
  description: string;
}

export interface DomainTaxonomy {
  id: DomainID;
  title: string;
  subtitle: string;
  badge: string;
  tag: string;
  route: string;
  iconType: string;
  description: string;
  subcategories: SubcategoryMeta[];
}

export interface ToolItem {
  id: string;
  name: string;
  domain: DomainID;
  category: SubcategoryID;
  categoryLabel: string;
  description: string;
  stars: string;
  badge: string;
  subBadge?: string;
  version?: string;
  metaLeft: string;
  metaRight: string;
  url: string;
  image: string;
  accentColor?: string;
  previewType?: string;
  installCmd?: string;
  fullDescription?: string;
  features?: string[];
  docsUrl?: string;
  githubUrl?: string;
}

export const DOMAIN_TAXONOMY: Record<DomainID, DomainTaxonomy> = {
  design: {
    id: 'design',
    title: 'Design',
    subtitle: 'UI primitives, 3D canvases & motion',
    badge: 'Design',
    tag: 'UI & Visual Craft',
    route: '/design',
    iconType: 'palette',
    description: 'Curated collection of UI component primitives, 3D interaction canvases, motion engines, and design assets.',
    subcategories: [
      { id: 'ui-primitives', label: 'UI Primitives & Kits', description: 'Copy-paste accessible component foundations' },
      { id: 'motion-effects', label: 'Motion & Interactions', description: 'Kinetic animations and micro-interactions' },
      { id: 'spatial-3d', label: '3D & Spatial Canvases', description: 'Interactive 3D scenes and WebGL models' },
      { id: 'iconography', label: 'Iconography & Glyphs', description: 'Vector icon toolkits and SVG glyph systems' },
      { id: 'color-gradients', label: 'Color Systems & Mesh', description: 'Mesh gradients and HSL color palettes' },
      { id: 'typography', label: 'Modern Typography', description: 'Variable fonts, pairing guides, and type scales' },
    ],
  },
  development: {
    id: 'development',
    title: 'Development',
    subtitle: 'CSS engines, state & WebGL runtimes',
    badge: 'Development',
    tag: 'Frontend Architecture',
    route: '/development',
    iconType: 'terminal',
    description: 'High-performance developer utilities, state managers, WebGL pipelines, and modern CSS compilers.',
    subcategories: [
      { id: 'css-engines', label: 'CSS & Style Engines', description: 'Modern styling frameworks and variant compilers' },
      { id: 'state-url', label: 'State & URL Sync', description: 'Query parameters and lightweight reactive stores' },
      { id: 'animation-engines', label: 'Animation Pipelines', description: 'Core timeline animation engines and scroll physics' },
      { id: 'webgl-shaders', label: 'WebGL & Shader Runtimes', description: 'Canvas renderers and GPU shader engines' },
      { id: 'headless-hooks', label: 'Headless Utilities & Hooks', description: 'Virtualizers, floating UI, and command menus' },
    ],
  },
  ai: {
    id: 'ai',
    title: 'AI Tools',
    subtitle: 'Generative UI, IDEs & AI SDKs',
    badge: 'AI Tools',
    tag: 'AI Engineering',
    route: '/ai',
    iconType: 'sparkles',
    description: 'Leading generative UI engines, agentic code editors, in-browser AI, and LLM orchestration libraries.',
    subcategories: [
      { id: 'gen-ui', label: 'Generative UI & Prompts', description: 'Prompt-to-React and fullstack app generators' },
      { id: 'ai-editors', label: 'AI IDEs & Coding Agents', description: 'Agentic code editors and inline assistants' },
      { id: 'ai-sdk', label: 'AI Orchestration SDKs', description: 'Streaming LLM libraries and AI integration SDKs' },
      { id: 'client-ai', label: 'Client-Side AI & WebGPU', description: 'In-browser local LLM inference engines' },
      { id: 'gen-media', label: 'Generative Media & Assets', description: 'AI vector graphics and generative textures' },
    ],
  },
  backend: {
    id: 'backend',
    title: 'Cloud & DB',
    subtitle: 'Serverless databases, auth & edge runtimes',
    badge: 'Cloud & DB',
    tag: 'Backend Engineering',
    route: '/backend',
    iconType: 'database',
    description: 'Serverless databases, authentication systems, type-safe ORMs, and edge deployment platforms.',
    subcategories: [
      { id: 'serverless-db', label: 'Serverless Databases & BaaS', description: 'Hosted Postgres, vector stores, and realtime backends' },
      { id: 'auth-identity', label: 'Auth & Identity IAM', description: 'User authentication and session management SDKs' },
      { id: 'orms-schemas', label: 'ORMs & Data Schemas', description: 'Type-safe database ORMs and schema validators' },
      { id: 'hosting-edge', label: 'Hosting & Edge Runtimes', description: 'Serverless deployment and edge worker runtimes' },
    ],
  },
  boilerplates: {
    id: 'boilerplates',
    title: 'Boilerplates',
    subtitle: 'Production-ready Next.js & AI templates',
    badge: 'Boilerplates',
    tag: 'Launch Foundations',
    route: '/boilerplates',
    iconType: 'rocket',
    description: 'Production-ready starter kits, SaaS boilerplates, and cross-platform mobile foundations.',
    subcategories: [
      { id: 'nextjs-starters', label: 'Next.js & React Starters', description: 'Fullstack Next.js production boilerplates' },
      { id: 'ai-saas-kits', label: 'AI SaaS Foundations', description: 'Ready-to-ship AI wrapper starters with Stripe + Auth' },
      { id: 'mobile-starters', label: 'Mobile & Cross-Platform', description: 'Expo and React Native production starter kits' },
    ],
  },
};

export const DOMAIN_GROUPS = Object.values(DOMAIN_TAXONOMY);

export const POPULAR_SEARCH_TAGS = [
  'Design & UI Craft',
  'Web Architecture',
  'Generative AI',
  'Cloud & Backend',
  'SaaS Boilerplates',
  'Tailwind v4',
  'Shadcn Primitives',
  'Cursor AI',
  'Supabase',
  'Lucide Icons',
  'Framer Motion',
];

export const UNIVERSAL_CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'design', label: 'Design' },
  { id: 'development', label: 'Development' },
  { id: 'ai', label: 'AI Tools' },
  { id: 'backend', label: 'Cloud & DB' },
  { id: 'boilerplates', label: 'Boilerplates' },
  { id: 'bookmarks', label: 'Bookmarks' },
] as const;

export const CATEGORIES = UNIVERSAL_CATEGORIES;

export const TOOLS_DATA: ToolItem[] = [];
