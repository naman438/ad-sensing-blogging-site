interface Heading {
  level: 2 | 3;
  text: string;
  id: string;
}

function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function extractHeadings(markdown: string): Heading[] {
  return markdown.split('\n').flatMap((line): Heading[] => {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h2) return [{ level: 2 as const, text: h2[1], id: headingId(h2[1]) }];
    if (h3) return [{ level: 3 as const, text: h3[1], id: headingId(h3[1]) }];
    return [];
  });
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="mb-6">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug block line-clamp-2"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
