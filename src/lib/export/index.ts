import { db } from '../db';
import type { Card, Deck, Review, Settings, DailyStats } from '../../types';

export interface ExportData {
  version: string;
  exportDate: string;
  data: {
    decks: Deck[];
    cards: Card[];
    reviews: Review[];
    settings: Settings[];
    stats: DailyStats[];
  };
}

export interface ImportResult {
  success: boolean;
  message: string;
  counts?: {
    decks: number;
    cards: number;
    reviews: number;
    settings: number;
    stats: number;
  };
  errors?: string[];
}

const CURRENT_VERSION = '1.0.0';

/**
 * Export all data from the database to JSON
 */
export async function exportAllData(): Promise<ExportData> {
  try {
    const [decks, cards, reviews, settings, stats] = await Promise.all([
      db.decks.toArray(),
      db.cards.toArray(),
      db.reviews.toArray(),
      db.settings.toArray(),
      db.stats.toArray(),
    ]);

    return {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      data: {
        decks,
        cards,
        reviews,
        settings,
        stats,
      },
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
}

/**
 * Download exported data as JSON file
 */
export async function downloadExport(): Promise<void> {
  const exportData = await exportAllData();
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `recall-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate import data structure
 */
function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const d = data as Partial<ExportData>;

  if (!d.version || typeof d.version !== 'string') {
    return false;
  }

  if (!d.data || typeof d.data !== 'object') {
    return false;
  }

  const requiredArrays = ['decks', 'cards', 'reviews', 'settings', 'stats'];
  for (const key of requiredArrays) {
    if (!Array.isArray((d.data as any)[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Import data from JSON, optionally clearing existing data
 */
export async function importData(
  jsonData: string | ExportData,
  clearExisting = false
): Promise<ImportResult> {
  const errors: string[] = [];

  try {
    // Parse JSON if string
    const data: unknown = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    // Validate structure
    if (!validateImportData(data)) {
      return {
        success: false,
        message: 'Invalid import file format',
        errors: ['The file does not match the expected RE-CA-LL backup format'],
      };
    }

    // Check version compatibility
    if (data.version !== CURRENT_VERSION) {
      errors.push(
        `Version mismatch: Export is v${data.version}, current version is v${CURRENT_VERSION}. Attempting import anyway...`
      );
    }

    // Clear existing data if requested
    if (clearExisting) {
      await Promise.all([
        db.decks.clear(),
        db.cards.clear(),
        db.reviews.clear(),
        db.stats.clear(),
        // Don't clear settings by default
      ]);
    }

    // Import data
    const counts = {
      decks: 0,
      cards: 0,
      reviews: 0,
      settings: 0,
      stats: 0,
    };

    try {
      // Import decks
      if (data.data.decks.length > 0) {
        await db.decks.bulkAdd(data.data.decks);
        counts.decks = data.data.decks.length;
      }
    } catch (err) {
      errors.push(`Error importing decks: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      // Import cards
      if (data.data.cards.length > 0) {
        await db.cards.bulkAdd(data.data.cards);
        counts.cards = data.data.cards.length;
      }
    } catch (err) {
      errors.push(`Error importing cards: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      // Import reviews
      if (data.data.reviews.length > 0) {
        await db.reviews.bulkAdd(data.data.reviews);
        counts.reviews = data.data.reviews.length;
      }
    } catch (err) {
      errors.push(`Error importing reviews: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      // Import settings
      if (data.data.settings.length > 0) {
        await db.settings.bulkPut(data.data.settings);
        counts.settings = data.data.settings.length;
      }
    } catch (err) {
      errors.push(`Error importing settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    try {
      // Import stats
      if (data.data.stats.length > 0) {
        await db.stats.bulkPut(data.data.stats);
        counts.stats = data.data.stats.length;
      }
    } catch (err) {
      errors.push(`Error importing stats: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    const totalImported = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (totalImported === 0) {
      return {
        success: false,
        message: 'No data was imported',
        errors: ['The import file appears to be empty or all imports failed'],
      };
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully imported ${totalImported} items`
        : `Imported ${totalImported} items with some errors`,
      counts,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to import data',
      errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
    };
  }
}

/**
 * Read and import from file
 */
export async function importFromFile(file: File, clearExisting = false): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const result = await importData(content, clearExisting);
        resolve(result);
      } catch (error) {
        resolve({
          success: false,
          message: 'Failed to read file',
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file',
        errors: ['File reading error'],
      });
    };

    reader.readAsText(file);
  });
}
