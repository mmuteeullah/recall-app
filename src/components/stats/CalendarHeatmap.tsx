import type { DailyStats } from '../../types';

interface CalendarHeatmapProps {
  data: DailyStats[];
}

export function CalendarHeatmap({ data }: CalendarHeatmapProps) {
  // Find max cards for normalization
  const maxCards = Math.max(
    ...data.map(d => d.newCards + d.reviewedCards),
    1
  );

  const getColor = (stats: DailyStats): string => {
    const total = stats.newCards + stats.reviewedCards;

    if (total === 0) {
      return 'bg-gray-100 dark:bg-gray-800';
    }

    const intensity = total / maxCards;

    if (intensity > 0.75) {
      return 'bg-green-500 dark:bg-green-600';
    } else if (intensity > 0.5) {
      return 'bg-green-400 dark:bg-green-500';
    } else if (intensity > 0.25) {
      return 'bg-green-300 dark:bg-green-400';
    } else {
      return 'bg-green-200 dark:bg-green-300';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        30-Day Activity
      </h3>

      <div className="space-y-2">
        {/* Grid of days */}
        <div className="grid grid-cols-10 sm:grid-cols-15 lg:grid-cols-30 gap-1">
          {data.map((stats) => {
            const total = stats.newCards + stats.reviewedCards;
            return (
              <div
                key={stats.date}
                className={`aspect-square rounded ${getColor(stats)} border border-gray-200 dark:border-gray-700 relative group cursor-pointer transition-transform hover:scale-110`}
                title={`${formatDate(stats.date)}\n${total} cards\n${Math.round(stats.retentionRate)}% retention`}
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10 transition-opacity">
                  <div className="font-semibold">{formatDate(stats.date)}</div>
                  <div>{total} cards</div>
                  {total > 0 && <div>{Math.round(stats.retentionRate)}% retention</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
            <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-300 border border-gray-200 dark:border-gray-700" />
            <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-400 border border-gray-200 dark:border-gray-700" />
            <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-500 border border-gray-200 dark:border-gray-700" />
            <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600 border border-gray-200 dark:border-gray-700" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
}
