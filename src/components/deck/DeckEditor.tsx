import { useState, useEffect } from 'react';
import { Modal, Button, Input, TextArea, Select } from '../common';
import type { Deck } from '../../types';

interface DeckEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deckData: Omit<Deck, 'id' | 'created' | 'modified' | 'position'>) => Promise<void>;
  deck?: Deck;
  allDecks: Deck[];
}

export function DeckEditor({ isOpen, onClose, onSave, deck, allDecks }: DeckEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setDescription(deck.description || '');
      setParentId(deck.parentId);
    } else {
      setName('');
      setDescription('');
      setParentId(null);
    }
    setError('');
  }, [deck, isOpen]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Deck name is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        parentId,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deck');
    } finally {
      setSaving(false);
    }
  };

  // Filter out the current deck and its descendants from parent options
  const availableParents = allDecks.filter(d => {
    if (!deck) return true;
    if (d.id === deck.id) return false;
    // TODO: Add logic to prevent circular dependencies
    return true;
  });

  const parentOptions = [
    { value: '', label: 'None (Root level)' },
    ...availableParents.map(d => ({ value: String(d.id), label: d.name })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deck ? 'Edit Deck' : 'Create New Deck'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Deck Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Kubernetes Basics"
          fullWidth
          autoFocus
          error={error}
        />

        <TextArea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this deck..."
          rows={3}
          fullWidth
        />

        <Select
          label="Parent Deck (optional)"
          value={parentId === null ? '' : String(parentId)}
          onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
          options={parentOptions}
          fullWidth
        />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Create nested decks to organize your cards hierarchically.</p>
          <p className="mt-1">Example: Knowledge → Kubernetes → Pods</p>
        </div>
      </div>
    </Modal>
  );
}
