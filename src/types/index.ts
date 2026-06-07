export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  reading_time: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES = [
  { slug: 'llm', label: 'AI & LLMs', description: 'Large language models, generative AI, and machine learning' },
  { slug: 'finance', label: 'Finance', description: 'Personal finance, investing, markets, and economics' },
  { slug: 'tech', label: 'Technology', description: 'Software, hardware, startups, and the tech industry' },
  { slug: 'crypto', label: 'Crypto & Web3', description: 'Blockchain, DeFi, NFTs, and digital assets' },
  { slug: 'productivity', label: 'Productivity', description: 'Tools, habits, and strategies to get more done' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

// Rotating topic seeds — keeps generated titles varied across runs
export const CATEGORY_TOPICS: Record<string, string[]> = {
  llm: [
    'prompt engineering techniques for better results',
    'how RAG (Retrieval-Augmented Generation) works',
    'fine-tuning vs in-context learning tradeoffs',
    'AI agents and autonomous task execution',
    'open-source LLMs vs closed-source models',
    'hallucination in LLMs and how to reduce it',
    'multimodal AI models that process images and text',
    'context window size and why it matters',
    'LLM evaluation benchmarks explained',
    'how transformer architecture powers modern AI',
    'cost of running LLMs in production',
    'AI coding assistants compared',
    'the future of AI reasoning models',
    'small language models vs large ones',
    'LLM safety alignment and RLHF',
  ],
  finance: [
    'index fund investing for beginners',
    'how to build a 6-month emergency fund',
    'Roth IRA vs traditional IRA decision guide',
    'dollar-cost averaging in volatile markets',
    'how inflation erodes savings over time',
    'real estate vs stock market returns',
    'understanding compound interest',
    'tax-loss harvesting strategies',
    'passive income streams that actually work',
    'how to pay off debt fast using the avalanche method',
    'high-yield savings accounts in 2025',
    'dividend investing for long-term wealth',
    'the 4% rule for early retirement',
    'how to read a company earnings report',
    'budgeting methods that work for busy people',
  ],
  tech: [
    'how Kubernetes simplifies container orchestration',
    'WebAssembly and the future of the browser',
    'edge computing vs cloud computing',
    'why TypeScript is taking over JavaScript',
    'the rise of AI-native software startups',
    'how vector databases power AI search',
    'open source vs SaaS for developer tools',
    'API design best practices in 2025',
    'how serverless architecture saves money',
    'the best developer productivity tools',
    'how to read tech company valuations',
    'microservices vs monolith architecture',
    'observability and monitoring in production',
    'zero-trust security architecture explained',
    'how recommender systems work',
  ],
  crypto: [
    'how Bitcoin halving affects price cycles',
    'DeFi lending protocols explained simply',
    'what is a blockchain validator and how staking works',
    'NFTs beyond art — real-world use cases',
    'how crypto exchanges make money',
    'understanding crypto wallet security',
    'layer 2 scaling solutions for Ethereum',
    'how DAOs are changing organizational governance',
    'central bank digital currencies vs crypto',
    'crypto tax reporting basics',
    'what is tokenomics and why it matters',
    'how to evaluate a new crypto project',
    'decentralized identity and self-sovereign data',
    'crypto bear market survival strategies',
    'cross-chain bridges and interoperability',
  ],
  productivity: [
    'the Pomodoro technique and why it works',
    'how to design a distraction-free workspace',
    'time blocking vs to-do lists',
    'the best note-taking apps for knowledge workers',
    'how to run meetings that actually end on time',
    'building a second brain with Obsidian or Notion',
    'async communication habits for remote teams',
    'the 2-minute rule for task management',
    'how to stop procrastinating with implementation intentions',
    'morning routines of high performers',
    'using AI tools to automate repetitive tasks',
    'inbox zero — realistic strategies that work',
    'how to deep work in an open office',
    'energy management vs time management',
    'the weekly review habit explained',
  ],
};
