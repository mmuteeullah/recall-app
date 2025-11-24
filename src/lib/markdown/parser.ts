import type { CardType } from '../../types';

export interface ParsedCard {
  front: string;
  back: string;
  inlineTags: string[];
}

export interface ParsedMarkdown {
  deckPath: string;
  fileTags: string[];
  cardType: CardType;
  cards: ParsedCard[];
  errors: string[];
}

export function parseMarkdownFile(content: string): ParsedMarkdown {
  const result: ParsedMarkdown = {
    deckPath: '',
    fileTags: [],
    cardType: 'basic',
    cards: [],
    errors: [],
  };

  if (!content || !content.trim()) {
    result.errors.push('File is empty');
    return result;
  }

  const lines = content.split('\n');
  let lineIndex = 0;

  // Parse header information
  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim();

    // Extract deck name
    if (line.startsWith('# Deck Name:')) {
      result.deckPath = line.replace('# Deck Name:', '').trim();
      lineIndex++;
      continue;
    }

    // Extract file-level tags
    if (line.startsWith('## Tags:')) {
      const tagsStr = line.replace('## Tags:', '').trim();
      result.fileTags = tagsStr
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);
      lineIndex++;
      continue;
    }

    // Extract card type
    if (line.startsWith('## Type:')) {
      const typeStr = line.replace('## Type:', '').trim().toLowerCase();
      if (typeStr === 'basic' || typeStr === 'reverse') {
        result.cardType = typeStr;
      } else {
        result.errors.push(`Invalid card type "${typeStr}". Using "basic" as default.`);
      }
      lineIndex++;
      continue;
    }

    // Stop at first separator (start of cards)
    if (line === '---') {
      lineIndex++;
      break;
    }

    // Skip empty lines and other content
    if (line.length > 0 && !line.startsWith('#')) {
      // Ignore unknown content in header
    }
    lineIndex++;
  }

  // Validate deck name
  if (!result.deckPath) {
    result.errors.push('Missing "# Deck Name:" header');
    return result;
  }

  // Parse cards
  const cardSections: string[] = [];
  let currentSection = '';

  while (lineIndex < lines.length) {
    const line = lines[lineIndex];

    if (line.trim() === '---') {
      if (currentSection.trim()) {
        cardSections.push(currentSection);
        currentSection = '';
      }
    } else {
      currentSection += line + '\n';
    }

    lineIndex++;
  }

  // Add last section if exists
  if (currentSection.trim()) {
    cardSections.push(currentSection);
  }

  // Parse card pairs (Q, A, Q, A, ...)
  if (cardSections.length % 2 !== 0) {
    result.errors.push(`Unmatched Q&A pairs. Found ${cardSections.length} sections, expected even number.`);
  }

  for (let i = 0; i < cardSections.length - 1; i += 2) {
    const questionSection = cardSections[i].trim();
    const answerSection = cardSections[i + 1].trim();

    if (!questionSection || !answerSection) {
      result.errors.push(`Card ${Math.floor(i / 2) + 1}: Empty question or answer`);
      continue;
    }

    // Extract question
    let front = questionSection;
    if (front.startsWith('Q:')) {
      front = front.substring(2).trim();
    }

    // Extract answer and inline tags
    let back = answerSection;
    const inlineTags: string[] = [];

    if (back.startsWith('A:')) {
      back = back.substring(2).trim();
    }

    // Extract inline tags (lines starting with #tag)
    const backLines = back.split('\n');
    const contentLines: string[] = [];
    let foundTagSection = false;

    for (let j = backLines.length - 1; j >= 0; j--) {
      const line = backLines[j].trim();

      // Check if line contains only tags
      if (line && line.split(/\s+/).every(word => word.startsWith('#'))) {
        foundTagSection = true;
        const tags = line
          .split(/\s+/)
          .filter(word => word.startsWith('#'))
          .map(tag => tag.substring(1).toLowerCase())
          .filter(tag => tag.length > 0);
        inlineTags.unshift(...tags);
      } else if (foundTagSection) {
        // Once we hit non-tag content, add remaining lines
        contentLines.unshift(line);
      } else {
        contentLines.unshift(line);
      }
    }

    back = contentLines.join('\n').trim();

    if (!front || !back) {
      result.errors.push(`Card ${Math.floor(i / 2) + 1}: Question or answer is empty after parsing`);
      continue;
    }

    result.cards.push({
      front,
      back,
      inlineTags,
    });
  }

  return result;
}

export function validateDeckPath(deckPath: string): { valid: boolean; error?: string } {
  if (!deckPath || !deckPath.trim()) {
    return { valid: false, error: 'Deck path is empty' };
  }

  const parts = deckPath.split('/').map(p => p.trim()).filter(p => p.length > 0);

  if (parts.length === 0) {
    return { valid: false, error: 'Deck path contains no valid parts' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"|?*]/;
  for (const part of parts) {
    if (invalidChars.test(part)) {
      return { valid: false, error: `Invalid characters in deck name "${part}"` };
    }
  }

  return { valid: true };
}

export function parseDeckPath(deckPath: string): string[] {
  return deckPath.split('/').map(p => p.trim()).filter(p => p.length > 0);
}
