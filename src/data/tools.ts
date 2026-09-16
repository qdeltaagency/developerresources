export interface ToolItem {
  id: string;
  name: string;
  category: 'react' | 'motion' | 'tailwind' | 'boilerplates' | 'icons' | 'foss';
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
  previewType: 
    | 'shadcn'
    | 'waveform'
    | 'code-pill'
    | 'shader'
    | 'spline-3d'
    | 'magic-bento'
    | 'lucide-grid'
    | 'url-params'
    | 'cva-syntax'
    | 'three-cube'
    | 'gsap-timeline'
    | 'framer-motion'
    | 'tailwind-v4';
  installCmd?: string;
  fullDescription?: string;
  features?: string[];
  docsUrl?: string;
  githubUrl?: string;
}

export const POPULAR_SEARCH_TAGS = [
  'Tailwind v4',
  'Framer Motion',
  'Lucide Icons',
  'Shadcn Primitives',
  'WebGL Shaders',
  'GSAP',
  'Three.js',
  '3D Runtime',
  'React Components',
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'react', label: 'React Components' },
  { id: 'motion', label: 'Motion & 3D' },
  { id: 'tailwind', label: 'CSS & Tailwind' },
  { id: 'boilerplates', label: 'Boilerplates' },
  { id: 'icons', label: 'Icons' },
  { id: 'foss', label: 'Open Source' },
  { id: 'bookmarks', label: 'Bookmarks' },
] as const;

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'shadcn-ui',
    name: 'shadcn/ui',
    category: 'react',
    categoryLabel: 'React',
    description: 'Copy-paste UI component primitives with full customizability.',
    stars: '78k stars',
    badge: 'v0.9.4',
    metaLeft: '78k stars',
    metaRight: 'radix-ui core',
    url: 'https://ui.shadcn.com',
    image: '/previews/shadcn-ui.png',
    previewType: 'shadcn',
    installCmd: 'npx shadcn@latest init',
    fullDescription: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    features: ['Accessible Radix primitives', 'Tailwind CSS styled', 'Full source code ownership', 'CLI component adder'],
    docsUrl: 'https://ui.shadcn.com/docs',
    githubUrl: 'https://github.com/shadcn-ui/ui'
  },
  {
    id: '21st-dev',
    name: '21st.dev',
    category: 'motion',
    categoryLabel: 'Motion',
    description: 'The npm registry for animated Tailwind and modern interactive UI.',
    stars: '12k components',
    badge: 'Registry',
    metaLeft: '900+ blocks',
    metaRight: 'Tailwind v4',
    url: 'https://21st.dev',
    image: '/previews/21st-dev.png',
    previewType: 'waveform',
    installCmd: 'npx 21st@latest add [component-name]',
    fullDescription: 'Curated design engineer marketplace and registry for production-ready components, kinetic typography, and motion blocks.',
    features: ['Next.js 15 Ready', 'Interactive Waveforms & Shaders', 'Copy-paste CLI commands', 'Community component showcases'],
    docsUrl: 'https://21st.dev/docs',
    githubUrl: 'https://github.com/21st-dev'
  },
  {
    id: 'react-bits',
    name: 'React Bits',
    category: 'motion',
    categoryLabel: 'Kinetic',
    description: 'Kinetic micro-components, animations, and text effects with zero extra dependencies.',
    stars: '15k stars',
    badge: 'Micro-Lib',
    metaLeft: 'Zero-dep',
    metaRight: '60+ Animations',
    url: 'https://reactbits.dev',
    image: '/previews/react-bits.png',
    previewType: 'code-pill',
    installCmd: 'npm install react-bits',
    fullDescription: 'A lightweight collection of kinetic animations, text scrambles, cursor effects, and subtle micro-interactions built for React.',
    features: ['Sub-1kb component modules', 'Zero runtime dependencies', 'TypeScript native', 'Pure CSS + Spring math'],
    docsUrl: 'https://reactbits.dev/docs',
    githubUrl: 'https://github.com/DavidHDev/react-bits'
  },
  {
    id: 'aceternity-ui',
    name: 'Aceternity UI',
    category: 'motion',
    categoryLabel: 'Shaders',
    description: 'High-end canvas and WebGL shader effects with Framer Motion.',
    stars: '45k stars',
    badge: 'Shaders',
    metaLeft: 'Next.js 15 Ready',
    metaRight: 'Tailwind v4',
    url: 'https://ui.aceternity.com',
    image: '/previews/aceternity-ui.png',
    previewType: 'shader',
    installCmd: 'npm i framer-motion clsx tailwind-merge',
    fullDescription: 'Make your websites look 10x better with high quality, copy-paste React + Tailwind + Framer Motion components.',
    features: ['Canvas Reveal effects', '3D Card Parallax', 'Lamp Hero sections', 'Background Beams & Vortex'],
    docsUrl: 'https://ui.aceternity.com/components',
    githubUrl: 'https://github.com/aceternity/ui'
  },
  {
    id: 'spline',
    name: 'Spline',
    category: 'motion',
    categoryLabel: '3D Web',
    description: 'Intuitive 3D web design tool with real-time interactive exports.',
    stars: '1.2M users',
    badge: '3D Runtime',
    metaLeft: 'Interactive 3D',
    metaRight: 'Zero-code Export',
    url: 'https://spline.design',
    image: '/previews/spline.png',
    previewType: 'spline-3d',
    installCmd: 'npm install @splinetool/react-spline @splinetool/runtime',
    fullDescription: 'Spline allows designers and engineers to collaborate in real-time on 3D scenes, physics simulations, and web embeds.',
    features: ['Real-time raytracing', 'React runtime component', 'Event listeners & mouse tracking', 'Physics simulation engine'],
    docsUrl: 'https://docs.spline.design',
    githubUrl: 'https://github.com/splinetool'
  },
  {
    id: 'magic-ui',
    name: 'Magic UI',
    category: 'react',
    categoryLabel: 'Landing',
    description: 'Animated UI primitives specifically crafted for high-conversion landing pages.',
    stars: '18k stars',
    badge: 'Landing Kit',
    metaLeft: '50+ Primitives',
    metaRight: 'Marketing Ready',
    url: 'https://magicui.design',
    image: '/previews/magic-ui.png',
    previewType: 'magic-bento',
    installCmd: 'npx magicui-cli@latest add [component]',
    fullDescription: '50+ free and open-source animated components built with React, Typescript, Tailwind CSS, and Framer Motion.',
    features: ['Bento Grids & Marquees', 'Animated Beams & Borders', 'Particle effects', 'Interactive globes & terminal widgets'],
    docsUrl: 'https://magicui.design/docs',
    githubUrl: 'https://github.com/magicuidesign/magicui'
  },
  {
    id: 'lucide',
    name: 'Lucide',
    category: 'icons',
    categoryLabel: 'Assets',
    description: 'Beautiful, clean, and consistent open-source icon toolkit with 1,450+ glyphs.',
    stars: '14k stars',
    badge: 'Vector System',
    metaLeft: '1,450+ Icons',
    metaRight: 'Tree-shakeable',
    url: 'https://lucide.dev',
    image: '/previews/lucide.png',
    previewType: 'lucide-grid',
    installCmd: 'npm install lucide-react',
    fullDescription: 'An open-source, community-run fork of Feather Icons. Clean, consistent SVG icons packaged for React, Vue, Svelte, and vanilla HTML.',
    features: ['100% vector based', 'Zero config tree-shaking', 'Customizable stroke & size', 'React 19 & Next.js ready'],
    docsUrl: 'https://lucide.dev/guide',
    githubUrl: 'https://github.com/lucide-icons/lucide'
  },
  {
    id: 'nuqs',
    name: 'nuqs',
    category: 'react',
    categoryLabel: 'Utility',
    description: 'Type-safe URL search params state manager for Next.js App Router.',
    stars: '4.2k stars',
    badge: 'State Sync',
    metaLeft: 'Type-safe',
    metaRight: 'App Router',
    url: 'https://nuqs.47ng.com',
    image: '/previews/nuqs.png',
    previewType: 'url-params',
    installCmd: 'npm install nuqs',
    fullDescription: 'Like `useState`, but stored in the URL query string. Provides type safety, automatic JSON/date parsing, and shallow routing.',
    features: ['Type-safe parsers', 'Next.js App & Pages router', 'Batched URL updates', 'Server-side rendering support'],
    docsUrl: 'https://nuqs.47ng.com/docs',
    githubUrl: 'https://github.com/47ng/nuqs'
  },
  {
    id: 'cva',
    name: 'cva',
    category: 'tailwind',
    categoryLabel: 'CSS',
    description: 'Declarative UI component variants builder for Tailwind and CSS-in-JS.',
    stars: '6.8k stars',
    badge: 'Primitives',
    metaLeft: 'CSS in JS',
    metaRight: '120k DL/day',
    url: 'https://cva.style',
    image: '/previews/cva.png',
    previewType: 'cva-syntax',
    installCmd: 'npm install class-variance-authority',
    fullDescription: 'Class Variance Authority makes building component variants easy and type-safe, preventing messy template literals.',
    features: ['Strict TypeScript autocomplete', 'Zero dependencies', 'Compound variant rules', 'Universal CSS framework compatibility'],
    docsUrl: 'https://cva.style/docs',
    githubUrl: 'https://github.com/joe-bell/cva'
  },
  {
    id: 'threejs',
    name: 'Three.js',
    category: 'motion',
    categoryLabel: '3D Canvas',
    description: 'Standard JavaScript 3D library for WebGL and WebGPU rendering.',
    stars: '102k stars',
    badge: 'WebGL Core',
    metaLeft: '102k stars',
    metaRight: 'WebGPU Ready',
    url: 'https://threejs.org',
    image: '/previews/threejs.png',
    previewType: 'three-cube',
    installCmd: 'npm install three @types/three',
    fullDescription: 'The premier open-source JavaScript 3D library. Enables complex 3D scenes, shaders, camera rigs, and GPU acceleration in the browser.',
    features: ['WebGL 2.0 & WebGPU pipelines', 'GLTF/GLB loader ecosystem', 'Post-processing filters', 'Physics engine bridges'],
    docsUrl: 'https://threejs.org/docs',
    githubUrl: 'https://github.com/mrdoob/three.js'
  },
  {
    id: 'gsap',
    name: 'GSAP',
    category: 'motion',
    categoryLabel: 'Timeline',
    description: 'Professional-grade high performance web animation library.',
    stars: '18k stars',
    badge: 'Animation',
    metaLeft: 'ScrollTrigger',
    metaRight: 'Standard',
    url: 'https://gsap.com',
    image: '/previews/gsap.png',
    previewType: 'gsap-timeline',
    installCmd: 'npm install gsap',
    fullDescription: 'Ultra high-performance JavaScript animation engine trusted by 11+ million sites worldwide. Unrivaled control over SVG, DOM, and Canvas.',
    features: ['ScrollTrigger pin & scrub', 'Flip plugin for layout morphing', 'Draggable & Inertia physics', 'Sub-millisecond timeline precision'],
    docsUrl: 'https://gsap.com/docs',
    githubUrl: 'https://github.com/greensock/GSAP'
  },
  {
    id: 'framer-motion',
    name: 'Framer Motion',
    category: 'motion',
    categoryLabel: 'Motion',
    description: 'Production-ready motion library for React with gesture recognition and layout morphs.',
    stars: '24k stars',
    badge: 'React Motion',
    metaLeft: 'Declarative',
    metaRight: 'Spring Physics',
    url: 'https://motion.dev',
    image: '/previews/framer-motion.png',
    previewType: 'framer-motion',
    installCmd: 'npm install motion',
    fullDescription: 'A complete animation library for React that powers buttery smooth spring physics, layout animations, exit transitions, and gestures.',
    features: ['AnimatePresence layout morphs', 'Drag & Pan gestures', 'Scroll-linked keyframes', 'Hardware accelerated transforms'],
    docsUrl: 'https://motion.dev/docs',
    githubUrl: 'https://github.com/motiondivision/motion'
  },
  {
    id: 'tailwind-v4',
    name: 'Tailwind CSS v4',
    category: 'tailwind',
    categoryLabel: 'Utility CSS',
    description: 'Next-generation utility-first CSS framework built with a lightning-fast Rust engine.',
    stars: '82k stars',
    badge: 'v4.0 Alpha',
    metaLeft: 'Rust Engine',
    metaRight: 'CSS-first Config',
    url: 'https://tailwindcss.com',
    image: '/previews/tailwind-v4.png',
    previewType: 'tailwind-v4',
    installCmd: 'npm install tailwindcss @tailwindcss/postcss',
    fullDescription: 'The next evolution of Tailwind CSS. Features 10x faster build speeds, native Cascade Layers, and zero-configuration CSS variables.',
    features: ['Oxide Rust-powered compiler', 'Native `@theme` CSS directive', 'Modern color-mix & OKLCH support', 'Zero config setup'],
    docsUrl: 'https://tailwindcss.com/docs',
    githubUrl: 'https://github.com/tailwindlabs/tailwindcss'
  }
];
