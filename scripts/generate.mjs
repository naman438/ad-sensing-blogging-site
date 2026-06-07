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

const MODEL = 'llama-3.3-70b-versatile';

function pickTopic(categorySlug) {
  const topics = CATEGORY_TOPICS[categorySlug] ?? [];
  // Avoid topics already used (check existing filenames)
  if (!fs.existsSync(POSTS_DIR)) return topics[0] ?? '';
  const existing = fs.readdirSync(POSTS_DIR).join(' ');
  const unused = topics.filter(t => !existing.includes(slugify(t, { lower: true, strict: true }).slice(0, 20)));
  const pool = unused.length > 0 ? unused : topics;
  return pool[Math.floor(Math.random() * pool.length)];
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
      content: `Generate a compelling, specific blog post title about this topic: "${topicSeed}" (in the context of ${cat.label}).
Return ONLY the title — no quotes, no explanation, no numbering. Make it engaging and SEO-friendly.`,
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
        content: `You are an expert writer and SEO specialist creating high-quality, authoritative blog articles that rank on Google. Write in a clear, engaging, human style with deep practical value. Use markdown: ## for H2 headers, ### for H3 sub-headers, **bold** for key terms, bullet lists and numbered lists. Aim for 900-1200 words.`,
      },
      {
        role: 'user',
        content: `Write a complete, in-depth blog post titled: "${title}"\n\nCategory: ${cat.label}\nCore topic: ${topicSeed}\n\nSEO requirements:\n- Start with a compelling 2-3 sentence introduction that hooks the reader and includes the main keyword naturally\n- Use 4-6 ## section headers that include relevant keywords people search for\n- Under each header, write 2-4 paragraphs with specific examples, data points, or actionable steps\n- Include at least one ### sub-section under a main section\n- Add a "Key Takeaways" or "Bottom Line" section at the end\n- Use **bold** to highlight the most important terms\n- Do NOT include the title at the top\n- Do NOT add meta commentary like "In this article..." or "As an AI..."\n\nAfter the article write:\nEXCERPT: [2-sentence SEO meta description, 140-160 characters, includes main keyword]\nTAGS: [6 comma-separated keyword tags people actually search for]`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.7,
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
