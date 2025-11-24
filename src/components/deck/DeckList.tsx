import { useState, useEffect } from 'react';
import { Button, DeckListSkeleton } from '../common';
import { DeckCard } from './DeckCard';
import { DeckGridCard } from './DeckGridCard';
import { DeckEditor } from './DeckEditor';
import { useDecks } from '../../hooks';
import { db } from '../../lib/db';
import type { Deck } from '../../types';

interface DeckWithStats extends Deck {
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
  };
}

type ViewMode = 'grid' | 'list';

export function DeckList() {
  const { decks, loading, error, createDeck, updateDeck, deleteDeck } = useDecks();
  const [decksWithStats, setDecksWithStats] = useState<DeckWithStats[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>();
  const [loadingStats, setLoadingStats] = useState(true);
  const [expandedDecks, setExpandedDecks] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('deckViewMode');
    return (saved as ViewMode) || 'grid';
  });

  // Load stats for all decks
  useEffect(() => {
    const loadStats = async () => {
      if (decks.length === 0) {
        setDecksWithStats([]);
        setLoadingStats(false);
        return;
      }

      try {
        setLoadingStats(true);
        const now = Date.now();

        const decksWithStatsData = await Promise.all(
          decks.map(async (deck) => {
            const cards = await db.cards.where('deckId').equals(deck.id!).toArray();

            return {
              ...deck,
              stats: {
                totalCards: cards.length,
                newCards: cards.filter(c => c.state === 'new' && !c.suspended).length,
                dueCards: cards.filter(c => !c.suspended && c.due <= now && c.state !== 'new').length,
              },
            };
          })
        );

        setDecksWithStats(decksWithStatsData);
      } catch (err) {
        console.error('Error loading deck stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [decks]);

  const handleCreate = () => {
    setEditingDeck(undefined);
    setIsEditorOpen(true);
  };

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsEditorOpen(true);
  };

  const handleDelete = async (deck: Deck) => {
    if (!confirm(`Are you sure you want to delete "${deck.name}"? This will also delete all cards in this deck.`)) {
      return;
    }

    try {
      await deleteDeck(deck.id!);
    } catch (err) {
      alert('Failed to delete deck. Please try again.');
    }
  };

  const handleSave = async (deckData: Omit<Deck, 'id' | 'created' | 'modified' | 'position'>) => {
    if (editingDeck) {
      await updateDeck(editingDeck.id!, deckData);
    } else {
      await createDeck(deckData);
    }
  };

  const toggleDeck = (deckId: number) => {
    setExpandedDecks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deckId)) {
        newSet.delete(deckId);
      } else {
        newSet.add(deckId);
      }
      return newSet;
    });
  };

  const switchViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('deckViewMode', mode);
  };

  // Organize decks into hierarchy with expand/collapse
  const organizeDecks = () => {
    const rootDecks = decksWithStats.filter(d => d.parentId === null);
    const childDecks = decksWithStats.filter(d => d.parentId !== null);

    const organized: Array<{
      deck: DeckWithStats;
      level: number;
      hasChildren: boolean;
      isExpanded: boolean;
      isLastChild: boolean;
    }> = [];

    const addDeckAndChildren = (deck: DeckWithStats, level: number, isLastChild: boolean) => {
      const children = childDecks.filter(d => d.parentId === deck.id);
      const hasChildDecks = children.length > 0;
      const isExpanded = expandedDecks.has(deck.id!);

      organized.push({
        deck,
        level,
        hasChildren: hasChildDecks,
        isExpanded,
        isLastChild
      });

      // Only add children if deck is expanded
      if (isExpanded && hasChildDecks) {
        children.forEach((child, index) =>
          addDeckAndChildren(child, level + 1, index === children.length - 1)
        );
      }
    };

    rootDecks.forEach((deck, index) =>
      addDeckAndChildren(deck, 0, index === rootDecks.length - 1)
    );

    return organized;
  };

  if (loading || loadingStats) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Decks</h2>
        </div>
        <DeckListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  const organizedDecks = organizeDecks();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {/* View toggle buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => switchViewMode('grid')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'grid'
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }
            `}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => switchViewMode('list')}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${viewMode === 'list'
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
              }
            `}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <Button onClick={handleCreate}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Deck
        </Button>
      </div>

      {decksWithStats.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No decks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first deck to start organizing your flashcards
          </p>
          <Button onClick={handleCreate}>Create Deck</Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View - Only show decks with cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decksWithStats
            .filter(deck => deck.stats.totalCards > 0) // Only show decks with cards
            .map((deck, index) => (
              <DeckGridCard
                key={deck.id}
                deck={deck}
                stats={deck.stats}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {organizedDecks.map(({ deck, level, hasChildren, isExpanded, isLastChild }, index) => (
            <DeckCard
              key={deck.id}
              deck={deck}
              stats={deck.stats}
              level={level}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              isLastChild={isLastChild}
              index={index}
              onToggle={() => toggleDeck(deck.id!)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <DeckEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        deck={editingDeck}
        allDecks={decks}
      />
    </div>
  );
}
