import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return '';

    try {
      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      const rawHtml = marked(content);
      // Sanitize HTML to prevent XSS
      return DOMPurify.sanitize(rawHtml as string);
    } catch (err) {
      console.error('Error parsing markdown:', err);
      return '<p class="text-red-600">Error parsing markdown</p>';
    }
  }, [content]);

  if (!content) {
    return (
      <div className={`text-gray-400 dark:text-gray-500 italic ${className}`}>
        Preview will appear here...
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
