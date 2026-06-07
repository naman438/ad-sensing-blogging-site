import Groq from 'groq-sdk';
import slugify from 'slugify';
import { CATEGORIES, CATEGORY_TOPICS, type CategorySlug } from '@/types';

let _groq: Groq | null = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

const MODEL = 'llama-3.3-70b-versatile';

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

  const topicSeed = pickTopic(category);

  const topicPrompt = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: `Generate a compelling, specific blog post title about this topic: "${topicSeed}" (in the context of ${categoryInfo.label}).
Return ONLY the title — no quotes, no explanation, no numbering. Make it engaging and SEO-friendly.`,
      },
    ],
    max_tokens: 80,
    temperature: 0.85,
  });

  const title = topicPrompt.choices[0].message.content?.trim() ?? `${topicSeed} — Complete Guide`;

  const articlePrompt = await getGroq().chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are an expert writer and SEO specialist creating high-quality, authoritative blog articles that rank on Google.
Write in a clear, engaging, human style with deep practical value. Structure content for both readers and search engines.
Use markdown: ## for H2 headers, ### for H3 headers, **bold** for key terms, bullet lists, and numbered lists where helpful.
Aim for 900-1200 words — longer articles rank higher.`,
      },
      {
        role: 'user',
        content: `Write a complete, in-depth blog post titled: "${title}"

Category: ${categoryInfo.label}
Core topic: ${topicSeed}

SEO requirements:
- Start with a compelling 2-3 sentence introduction that hooks the reader and includes the main keyword naturally
- Use 4-6 ## section headers that include relevant keywords people search for
- Under each header, write 2-4 paragraphs with specific examples, data points, or actionable steps
- Include at least one ### sub-section under a main section
- Add a "Key Takeaways" or "Bottom Line" section at the end
- Use **bold** to highlight the most important terms and concepts
- Do NOT include the title at the top (it's added separately)
- Do NOT add meta commentary like "In this article..." or "As an AI..."
- Write as a confident subject-matter expert

After the article, on a new line write:
EXCERPT: [2-sentence SEO meta description, 140-160 characters, includes main keyword]
TAGS: [6 comma-separated keyword tags people actually search for]`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.7,
  });

  const raw = articlePrompt.choices[0].message.content ?? '';

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
