#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/generate.mjs              # random category
 *   node scripts/generate.mjs finance      # specific category
 *   node scripts/generate.mjs llm 3        # 3 posts in llm category
 */

import Groq from 'groq-sdk';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const TRACKER_FILE = path.join(__dirname, '..', 'content', 'used-topics.json');

const CATEGORIES = [
  { slug: 'llm',          label: 'AI & LLMs',      description: 'large language models, generative AI, and machine learning' },
  { slug: 'finance',      label: 'Finance',         description: 'personal finance, investing, markets, and economics' },
  { slug: 'tech',         label: 'Technology',      description: 'software, hardware, startups, and the tech industry' },
  { slug: 'crypto',       label: 'Crypto & Web3',   description: 'blockchain, DeFi, NFTs, and digital assets' },
  { slug: 'productivity', label: 'Productivity',    description: 'tools, habits, and strategies to get more done' },
];

const CATEGORY_TOPICS = {
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
    'vector embeddings and semantic search explained',
    'how LLMs are changing software development',
    'top use cases for LLMs in enterprise',
    'LLM tokenization and why it matters',
    'chain-of-thought prompting explained',
    'mixture of experts architecture in AI',
    'how AI models are trained on human feedback',
    'distillation — making large models smaller',
    'LLMs for data analysis and insights',
    'AI memory — how agents remember across sessions',
    'structured output and JSON mode in LLMs',
    'building a RAG pipeline from scratch',
    'comparing GPT-4, Claude, Gemini, and Llama',
    'AI guardrails and content moderation',
    'on-device AI vs cloud AI models',
    'how LLMs handle code generation',
    'temperature and sampling in language models',
    'function calling and tool use in LLMs',
    'AI in healthcare — opportunities and risks',
    'LLM red-teaming and adversarial prompts',
    'the economics of training frontier AI models',
    'synthetic data generation with LLMs',
    'AI agents that browse the web',
    'long-context models vs chunking strategies',
    'how search engines are integrating AI',
    'AI for customer support — build vs buy',
    'system prompts and how they shape AI behavior',
    'LLMs for legal document analysis',
    'AI model compression techniques',
    'open weights vs open source AI models',
    'real-time AI with streaming APIs',
    'AI hallucination detection and mitigation',
    'LLM benchmarks — what they measure and what they miss',
    'building AI pipelines with LangChain vs LlamaIndex',
    'the carbon footprint of training large AI models',
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
    'understanding your credit score and how to improve it',
    'how to negotiate a higher salary',
    'the basics of options trading',
    'ETFs vs mutual funds — which is better',
    'how to invest your first $1000',
    'side hustles that generate real income',
    'understanding bond markets and interest rates',
    'how to save for a house down payment',
    'the psychology of money and spending habits',
    'international diversification in your portfolio',
    'how to protect wealth during a recession',
    'small business tax deductions you might be missing',
    'the FIRE movement explained',
    'how to read a balance sheet',
    'value investing vs growth investing',
    'understanding P/E ratios and stock valuation',
    'how to build a rental property portfolio',
    'backdoor Roth IRA strategy explained',
    'how to handle a financial windfall',
    'the true cost of buying vs renting',
    'asset allocation by age and risk tolerance',
    'how to invest in index funds on autopilot',
    'understanding Medicare and Social Security',
    'tax-advantaged accounts beyond the 401k',
    'how to build multiple income streams',
    'the snowball method for paying off debt',
    'rebalancing your portfolio — when and how',
    'how to evaluate REITs as an investment',
    'understanding market cycles — bull vs bear',
    'frugal living without feeling deprived',
    'how to teach kids about money',
    'the hidden costs of homeownership',
    'how to build credit from scratch',
    'understanding stock market volatility',
    'investing during high inflation environments',
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
    'the rise of platform engineering',
    'GraphQL vs REST — which to choose',
    'how CI/CD pipelines work',
    'understanding technical debt and how to manage it',
    'the future of low-code and no-code tools',
    'how HTTPS and TLS work under the hood',
    'database indexing strategies for performance',
    'event-driven architecture explained',
    'how to scale a web app to millions of users',
    'the shift from cloud to edge computing',
    'how DNS works — a developer explainer',
    'understanding OAuth 2.0 and JWT tokens',
    'the best programming languages to learn in 2025',
    'how caching works — Redis and Memcached',
    'software architecture patterns every dev should know',
    'how to do a proper code review',
    'feature flags and progressive deployments',
    'the state of WebSockets and real-time apps',
    'how search engines index and rank content',
    'building secure APIs — common vulnerabilities',
    'the rise of Rust in systems programming',
    'how to choose a database for your startup',
    'understanding rate limiting and API throttling',
    'how to design a URL shortener — system design',
    'the best tools for API testing',
    'developer experience (DX) — why it matters',
    'how to reduce cloud costs as a startup',
    'progressive web apps vs native apps',
    'understanding CORS and why it exists',
    'how to write better documentation',
    'the evolution of frontend frameworks',
    'chaos engineering — testing system resilience',
    'how to conduct a security audit',
    'SLAs, SLOs, and SLIs explained simply',
    'infrastructure as code with Terraform',
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
    'how Ethereum proof-of-stake works',
    'understanding liquidity pools in DeFi',
    'crypto portfolio diversification strategies',
    'how to store crypto safely — cold vs hot wallets',
    'the future of stablecoins',
    'blockchain use cases in supply chain',
    'how smart contracts work',
    'understanding gas fees on Ethereum',
    'Bitcoin as digital gold — store of value thesis',
    'how crypto derivatives and futures work',
    'the basics of yield farming',
    'decentralized exchanges vs centralized exchanges',
    'how blockchain is used in healthcare',
    'understanding crypto market cycles',
    'NFT royalties and creator economics',
    'how to avoid crypto scams',
    'Solana vs Ethereum — which wins',
    'the role of oracles in blockchain',
    'how Web3 wallets work',
    'understanding impermanent loss in DeFi',
    'crypto regulation — what is coming',
    'real-world asset tokenization explained',
    'how the Lightning Network scales Bitcoin',
    'institutional crypto adoption trends',
    'understanding blockchain consensus mechanisms',
    'crypto airdrops — how to find and claim them',
    'how to read a crypto whitepaper',
    'gaming and crypto — play-to-earn explained',
    'decentralized storage — IPFS and Filecoin',
    'how crypto lending works',
    'the history of major crypto crashes',
    'zero-knowledge proofs explained simply',
    'how to analyze on-chain data',
    'crypto ETFs — what they mean for investors',
    'privacy coins and anonymous transactions',
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
    'how to build habits that actually stick',
    'the Eisenhower Matrix for priority setting',
    'how to say no without damaging relationships',
    'batch processing — grouping similar tasks',
    'the best keyboard shortcuts to save hours per week',
    'how to create a personal operating system',
    'managing notifications for deep focus',
    'the art of delegation for busy leaders',
    'how to write faster and better',
    'productive remote work habits',
    'how to structure your ideal work day',
    'the myth of multitasking — science explained',
    'how to use templates to speed up repetitive work',
    'the best project management tools compared',
    'how to do a personal productivity audit',
    'reducing decision fatigue in daily life',
    'how to learn new skills faster',
    'the power of a shutdown ritual at end of day',
    'how to manage your energy not just your time',
    'using journaling for clarity and focus',
    'how to get into flow state on demand',
    'the best apps for focus and concentration',
    'how to prioritize when everything feels urgent',
    'time auditing — where your hours actually go',
    'building a reading habit that sticks',
    'how to run a productive solo brainstorm',
    'the best ways to take meeting notes',
    'automating your personal finances',
    'how to avoid burnout as a knowledge worker',
    'the science of breaks and recovery for peak performance',
    'how to set goals that you actually achieve',
    'building a personal knowledge management system',
    'the best ways to capture ideas on the go',
    'how to speed-read without losing comprehension',
    'creating standard operating procedures for your life',
  ],
};

const MODEL = 'llama-3.3-70b-versatile';

// --- Topic tracker ---
function loadTracker() {
  if (!fs.existsSync(TRACKER_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8')); } catch { return {}; }
}

function saveTracker(tracker) {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf-8');
}

function pickTopic(categorySlug) {
  const topics = CATEGORY_TOPICS[categorySlug] ?? [];
  const tracker = loadTracker();
  const used = new Set(tracker[categorySlug] ?? []);

  // Find unused topics
  let available = topics.filter(t => !used.has(t));

  // All topics exhausted — reset this category and start fresh
  if (available.length === 0) {
    console.log(`[tracker] All topics used for "${categorySlug}" — resetting`);
    tracker[categorySlug] = [];
    saveTracker(tracker);
    available = topics;
  }

  // Pick a random unused topic
  const topic = available[Math.floor(Math.random() * available.length)];

  // Mark it as used
  tracker[categorySlug] = [...(tracker[categorySlug] ?? []), topic];
  saveTracker(tracker);

  return topic;
}

function uniqueFilePath(slug, datePrefix) {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
  let filename = `${datePrefix}-${slug}.md`;
  let filepath = path.join(POSTS_DIR, filename);
  let counter = 2;
  while (fs.existsSync(filepath)) {
    filename = `${datePrefix}-${slug}-${counter}.md`;
    filepath = path.join(POSTS_DIR, filename);
    counter++;
  }
  return { filename, filepath };
}

async function generate(categorySlug) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const cat = CATEGORIES.find(c => c.slug === categorySlug);
  if (!cat) throw new Error(`Unknown category: ${categorySlug}`);

  const topicSeed = pickTopic(categorySlug);
  console.log(`\n[groq] Category: ${cat.label} | Topic: "${topicSeed}"`);

  const titleRes = await groq.chat.completions.create({
    model: MODEL,
    messages: [{
      role: 'user',
      content: `Generate a compelling blog post title about this topic: "${topicSeed}" (in the context of ${cat.label}).

Rules:
- Do NOT start with "Unlocking", "Unleashing", "Mastering", "Revolutionizing", or "Harnessing"
- Make it specific and practical — something a real person would search for
- Keep it under 70 characters if possible
- Sound like a helpful expert, not a marketing brochure
- Return ONLY the title — no quotes, no explanation, no numbering`,
    }],
    max_tokens: 80,
    temperature: 0.85,
  });

  const title = titleRes.choices[0].message.content?.trim() ?? `${topicSeed} — Complete Guide`;
  console.log(`[groq] Title: "${title}"`);
  console.log(`[groq] Writing article...`);

  const articleRes = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an experienced journalist and subject matter expert writing for a general audience. Your writing style is:
- Conversational and engaging — like explaining to a smart friend
- Direct and confident — no fluff, no filler sentences
- Specific — use real numbers, real examples, real comparisons
- Human — vary sentence length, use contractions, avoid robotic phrasing

Formatting rules (STRICT):
- Use ## for main section headers (4-6 sections)
- Use ### for sub-sections (1-2 per article)
- Use **bold** sparingly — maximum 8-10 bold phrases per article, only for truly critical terms
- Use bullet points or numbered lists where they genuinely help
- Do NOT bold every other phrase — this looks spammy
- Target 1,100-1,400 words — longer articles rank better on Google
- Write for an Indian and global English-speaking audience
- For finance topics: include Indian context (SIP, mutual funds, SEBI, RBI, Indian tax rules) where relevant`,
      },
      {
        role: 'user',
        content: `Write a complete, in-depth blog post titled: "${title}"

Category: ${cat.label}
Core topic: ${topicSeed}

Requirements:
- Open with a strong 2-3 sentence hook that immediately addresses the reader's pain point or curiosity
- Do NOT start with "In this article" or "Are you looking for" — get straight to the point
- Use 4-6 ## section headers with natural language (not keyword-stuffed)
- Under each header write 2-4 paragraphs with specific data points, real examples, or step-by-step guidance
- Include at least one ### sub-section
- Add concrete numbers and comparisons wherever possible (e.g. "Index funds return 12-15% annually on average in India")
- End with a practical "Bottom Line" or "Key Takeaways" section with 3-5 bullet points
- For finance topics: make examples relevant to Indian investors (mention SIP, Zerodha, Groww, SEBI, etc. where natural)
- For crypto topics: mention Indian exchanges and regulations where relevant
- Do NOT include the title at the top of the article
- Do NOT add commentary like "As an AI" or "In conclusion, it is clear that"
- Write as if you are a knowledgeable person genuinely helping the reader

After the article write:
EXCERPT: [A natural 2-sentence description, 140-160 characters, includes the main keyword once]
TAGS: [6 specific keyword phrases people actually search for, comma-separated]`,
      },
    ],
    max_tokens: 4000,
    temperature: 0.75,
  });

  const raw = articleRes.choices[0].message.content ?? '';
  const excerptMatch = raw.match(/EXCERPT:\s*([\s\S]+?)(?:\nTAGS:|$)/);
  const tagsMatch = raw.match(/TAGS:\s*(.+)$/m);
  const content = raw.replace(/EXCERPT:[\s\S]*$/, '').trim();
  const excerpt = excerptMatch?.[1]?.trim() ?? `${title} — an in-depth look at ${cat.label}.`;
  const tags = tagsMatch?.[1] ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean).slice(0, 6) : [cat.label];

  const slug = slugify(title, { lower: true, strict: true }).slice(0, 80);
  const wordCount = content.split(/\s+/).length;
  const reading_time = Math.max(3, Math.round(wordCount / 200));
  const now = new Date().toISOString();
  const datePrefix = now.slice(0, 10);

  const { filename, filepath } = uniqueFilePath(slug, datePrefix);

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `category: "${cat.slug}"`,
    `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
    `tags: [${tags.map(t => `"${t}"`).join(', ')}]`,
    `reading_time: ${reading_time}`,
    `created_at: "${now}"`,
    `updated_at: "${now}"`,
    `published: true`,
    '---',
    '',
    content,
  ].join('\n');

  fs.writeFileSync(filepath, frontmatter, 'utf-8');
  console.log(`✓ Saved: content/posts/${filename} (${wordCount} words, ~${reading_time} min read)`);
  return { title, slug, filename };
}

// --- CLI ---
const args = process.argv.slice(2);
const categoryArg = args[0];
const count = parseInt(args[1] ?? '1', 10);
const validSlugs = CATEGORIES.map(c => c.slug);

async function main() {
  for (let i = 0; i < count; i++) {
    const cat = categoryArg && validSlugs.includes(categoryArg)
      ? categoryArg
      : validSlugs[Math.floor(Math.random() * validSlugs.length)];
    await generate(cat);
    if (i < count - 1) {
      console.log('\n[waiting 2s...]');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log(`\nDone! ${count} post(s) generated. Run \`npm run dev\` to see them.`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
