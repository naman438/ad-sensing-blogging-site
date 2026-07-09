#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/generate.mjs              # random category
 *   node scripts/generate.mjs finance      # specific category
 *   node scripts/generate.mjs llm 3        # 3 posts in llm category
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
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

const MODEL = 'gemini-2.5-flash';

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

const SYSTEM_PROMPT = `You are a sharp, opinionated writer with genuine expertise in finance, technology, AI, and productivity. You write like a knowledgeable colleague sharing real insight — direct, specific, and genuinely useful to the reader.

BANNED phrases (using any of these makes the article unpublishable):
- "It is important to note", "It's worth noting", "It is crucial to understand"
- "In today's rapidly evolving", "In the ever-changing landscape", "It cannot be overstated"
- "In this article, we will", "Are you looking for", "Have you ever wondered"
- "In conclusion", "To summarize", "As mentioned earlier", "As we have seen", "As discussed above"
- Starting consecutive paragraphs with "Furthermore,", "Moreover,", "Additionally," — use once per article at most

Formatting rules:
- Use ## for 4-5 main sections, ### for 1-2 sub-sections
- Write 2-4 paragraphs per section with real substance
- Use **bold** for maximum 5-6 terms total per article — only genuinely technical or critical terms
- End the article with a real conclusion paragraph (2-3 sentences) — NEVER a "Key Takeaways:" or "Bottom Line:" bullet list
- Target 1,100-1,400 words
- Vary sentence length — mix short punchy sentences with longer explanations
- Use ₹ for Indian currency, reference Indian context naturally

India context to weave in (not as a separate section, but naturally throughout):
- Finance: SIP, CIBIL score, Zerodha, Groww, SEBI, NSE/BSE, PPF, NPS, ITR, FD interest rates
- Crypto: WazirX, CoinDCX, CoinSwitch, RBI's stance, India's 30% flat crypto tax
- Tech: Indian startup scene, Bengaluru tech hub, Indian FAANG engineers
- Productivity: Indian work culture, remote work in India`;

function loadUsedImageUrls() {
  const used = new Set();
  try {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
      const m = raw.match(/^image_url:\s*"(.+?)"\s*$/m);
      if (m) used.add(m[1]);
    }
  } catch {}
  return used;
}

async function fetchPexelsImage(keywords, usedUrls, page = 1) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;
  try {
    const query = encodeURIComponent(keywords);
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${page}&orientation=landscape`, {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const photos = data.photos ?? [];
    if (photos.length === 0) return null;
    const shuffled = photos.sort(() => Math.random() - 0.5);
    for (const photo of shuffled) {
      const url = photo.src.large2x ?? photo.src.large ?? photo.src.medium ?? null;
      if (url && !usedUrls.has(url)) return url;
    }
    if (page < 3) return fetchPexelsImage(keywords, usedUrls, page + 1);
    return null;
  } catch {
    return null;
  }
}

const CATEGORY_KEYWORDS = {
  finance:      'finance investing money stock market',
  llm:          'artificial intelligence technology data science',
  tech:         'technology software coding computer',
  crypto:       'cryptocurrency blockchain digital currency bitcoin',
  productivity: 'productivity workspace office focus work',
};

async function generate(categorySlug) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const cat = CATEGORIES.find(c => c.slug === categorySlug);
  if (!cat) throw new Error(`Unknown category: ${categorySlug}`);

  const topicSeed = pickTopic(categorySlug);
  console.log(`\n[gemini] Category: ${cat.label} | Topic: "${topicSeed}"`);

  // Generate title
  const titleModel = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { maxOutputTokens: 80, temperature: 0.85 },
  });

  const titleResult = await titleModel.generateContent(
    `Write a blog post title about: "${topicSeed}" (${cat.label} category).

Rules:
- Do NOT start with: "Unlocking", "Unleashing", "Mastering", "Revolutionizing", "Harnessing", "Navigating", "Maximizing", "Leveraging", "Exploring", "Understanding", "Discovering"
- Do NOT use numbers at the start ("10 Ways to...", "5 Tips for...", "7 Reasons why...")
- No listicle format ("X Things You Need to Know About Y")
- Keep it under 65 characters if possible
- Sound like a real expert writing for curious readers — not a marketing brochure
- Be specific and direct about what the reader will learn
- Return ONLY the title — no quotes, no punctuation at end, no explanation`
  );

  const title = titleResult.response.text().trim() ?? `${topicSeed} — Complete Guide`;
  console.log(`[gemini] Title: "${title}"`);
  console.log(`[gemini] Writing article...`);

  // Generate article
  const articleModel = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { maxOutputTokens: 4000, temperature: 0.75 },
  });

  const articleResult = await articleModel.generateContent(
    `Write a complete, in-depth blog post titled: "${title}"

Category: ${cat.label}
Core topic: ${topicSeed}

Requirements:
- Start with a bold statement, a surprising fact, or a counterintuitive insight — 2-3 sentences max, no cliché openers
- 4-5 ## section headers with natural conversational language
- Each section: 2-4 paragraphs with specific data, real examples, or step-by-step guidance
- Include at least one ### sub-section with deeper detail
- Use real figures and comparisons throughout (e.g., "Index funds on NSE returned 12.3% CAGR over the last decade")
- For finance topics: at least 2 India-specific references integrated naturally into the text
- For crypto topics: mention Indian exchange or regulatory angle where it genuinely fits
- End with a 2-3 sentence conclusion paragraph that gives the reader something to think about — absolutely no bullet list at the end
- Do NOT include the article title at the top
- Do NOT write as if you are an AI or add any meta-commentary about the article

After the article, on a new line, write:
EXCERPT: [One natural 2-sentence description, 140-160 characters, includes the main keyword once]
TAGS: [6 specific keyword phrases people actually search for, comma-separated]`
  );

  const raw = articleResult.response.text() ?? '';
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

  // Fetch a relevant photo from Pexels, avoiding already-used URLs
  const usedImageUrls = loadUsedImageUrls();
  const imageKeywords = `${title} ${CATEGORY_KEYWORDS[categorySlug] ?? cat.label}`;
  const imageUrl = await fetchPexelsImage(imageKeywords, usedImageUrls);
  if (imageUrl) console.log(`[pexels] Image found for "${title}"`);
  else console.log(`[pexels] No image found — using fallback`);

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
    ...(imageUrl ? [`image_url: "${imageUrl}"`] : []),
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
