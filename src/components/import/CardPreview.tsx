import { useState } from 'react';
import { MarkdownPreview } from '../card/MarkdownPreview';
import type { ParsedCard } from '../../lib/markdown';

interface FileWithCards {
  filename: string;
  cards: ParsedCard[];
  fileTags: string[];
}

interface CardPreviewProps {
  files: FileWithCards[];
}

export function CardPreview({ files }: CardPreviewProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(
    files.length === 1 ? files[0].filename : null
  );

  const totalCards = files.reduce((sum, f) => sum + f.cards.length, 0);

  if (totalCards === 0) {
    return null;
  }

  const toggleFile = (filename: string) => {
    setExpandedFile(expandedFile === filename ? null : filename);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Card Preview ({totalCards} {totalCards === 1 ? 'card' : 'cards'})
        </h3>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {files.map((file) => (
          <div key={file.filename} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* File header - clickable to expand/collapse */}
            <button
              onClick={() => toggleFile(file.filename)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm transform transition-transform duration-200" style={{
                  transform: expandedFile === file.filename ? 'rotate(90deg)' : 'rotate(0deg)'
                }}>
                  ▶
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.filename}
                </span>
              </div>
              <span className="text-xs px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">
                {file.cards.length} {file.cards.length === 1 ? 'card' : 'cards'}
              </span>
            </button>

            {/* Cards - expanded view */}
            {expandedFile === file.filename && (
              <div className="p-3 space-y-3 bg-white dark:bg-gray-900">
                {file.cards.map((card, index) => {
                  const allTags = [...new Set([...file.fileTags, ...card.inlineTags])];

                  return (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
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
                          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <MarkdownPreview content={card.front} />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Back (Answer)
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                            <MarkdownPreview content={card.back} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
