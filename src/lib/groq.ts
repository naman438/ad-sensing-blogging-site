import { GoogleGenerativeAI } from '@google/generative-ai';
import slugify from 'slugify';
import { CATEGORIES, CATEGORY_TOPICS, type CategorySlug } from '@/types';

const MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are a sharp, opinionated writer with genuine expertise in finance, technology, AI, and productivity. You write like a knowledgeable colleague sharing real insight — direct, specific, and genuinely useful to the reader.

BANNED phrases (using any of these makes the article unpublishable):
- "It is important to note", "It's worth noting", "It is crucial to understand"
- "In today's rapidly evolving", "In the ever-changing landscape", "It cannot be overstated"
- "In this article, we will", "Are you looking for", "Have you ever wondered"
- "In conclusion", "To summarize", "As mentioned earlier", "As we have seen", "As discussed above"
- Starting consecutive paragraphs with "Furthermore,", "Moreover,", "Additionally,"

Formatting rules:
- Use ## for 4-5 main sections, ### for 1-2 sub-sections
- Write 2-4 paragraphs per section with real substance
- Use **bold** for maximum 5-6 terms total per article
- End with a real conclusion paragraph — NEVER a bullet list
- Target 1,100-1,400 words
- Use ₹ for Indian currency, reference Indian context naturally`;

export interface GeneratedPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: CategorySlug;
  tags: string[];
  reading_time: number;
  created_at: string;
}

function pickTopic(category: CategorySlug): string {
  const topics = CATEGORY_TOPICS[category] ?? [];
  return topics[Math.floor(Math.random() * topics.length)] ?? '';
}

export async function generatePost(category: CategorySlug): Promise<GeneratedPost> {
  const categoryInfo = CATEGORIES.find((c) => c.slug === category);
  if (!categoryInfo) throw new Error(`Unknown category: ${category}`);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  const topicSeed = pickTopic(category);

  const titleModel = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { maxOutputTokens: 80, temperature: 0.85 },
  });

  const titleResult = await titleModel.generateContent(
    `Write a blog post title about: "${topicSeed}" (${categoryInfo.label} category).
Rules:
- Do NOT start with: "Unlocking", "Unleashing", "Mastering", "Revolutionizing", "Harnessing", "Navigating", "Maximizing", "Leveraging", "Exploring", "Understanding", "Discovering"
- Do NOT use numbers at the start ("10 Ways to...", "5 Tips for...")
- Keep it under 65 characters if possible
- Return ONLY the title — no quotes, no punctuation at end, no explanation`
  );

  const title = titleResult.response.text().trim() ?? `${topicSeed} — Complete Guide`;

  const articleModel = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { maxOutputTokens: 4000, temperature: 0.75 },
  });

  const articleResult = await articleModel.generateContent(
    `Write a complete, in-depth blog post titled: "${title}"

Category: ${categoryInfo.label}
Core topic: ${topicSeed}

Requirements:
- Start with a bold statement or surprising fact — 2-3 sentences, no cliché openers
- 4-5 ## section headers with natural conversational language
- Each section: 2-4 paragraphs with specific data, real examples, or step-by-step guidance
- Include at least one ### sub-section
- Use real figures and comparisons throughout
- For finance topics: at least 2 India-specific references integrated naturally
- End with a 2-3 sentence conclusion paragraph — no bullet list
- Do NOT include the article title at the top

After the article, on a new line, write:
EXCERPT: [One natural 2-sentence description, 140-160 characters, includes the main keyword once]
TAGS: [6 specific keyword phrases people actually search for, comma-separated]`
  );

  const raw = articleResult.response.text() ?? '';

  const excerptMatch = raw.match(/EXCERPT:\s*([\s\S]+?)(?:\nTAGS:|$)/);
  const tagsMatch = raw.match(/TAGS:\s*(.+)$/m);

  const content = raw.replace(/EXCERPT:[\s\S]*$/, '').trim();
  const excerpt = excerptMatch?.[1]?.trim() ?? `${title} — an in-depth look at ${categoryInfo.label}.`;
  const tags = tagsMatch?.[1]
    ? tagsMatch[1].split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 6)
    : [categoryInfo.label, 'Guide'];

  const slug = slugify(title, { lower: true, strict: true }).slice(0, 80);
  const wordCount = content.split(/\s+/).length;
  const reading_time = Math.max(3, Math.round(wordCount / 200));
  const created_at = new Date().toISOString();

  return { title, slug, content, excerpt, category, tags, reading_time, created_at };
}

export function pickRandomCategory(): CategorySlug {
  const categories = CATEGORIES.map((c) => c.slug) as CategorySlug[];
  return categories[Math.floor(Math.random() * categories.length)];
}
