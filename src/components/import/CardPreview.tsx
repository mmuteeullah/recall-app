import { MarkdownPreview } from '../card/MarkdownPreview';
import type { ParsedCard } from '../../lib/markdown';

interface CardPreviewProps {
  cards: ParsedCard[];
  fileTags: string[];
}

export function CardPreview({ cards, fileTags }: CardPreviewProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preview ({cards.length} {cards.length === 1 ? 'card' : 'cards'})
        </h3>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {cards.map((card, index) => {
          const allTags = [...new Set([...fileTags, ...card.inlineTags])];

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Card {index + 1}
                </span>
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Front (Question)
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <MarkdownPreview content={card.front} />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Back (Answer)
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <MarkdownPreview content={card.back} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
