import {
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    noteChange
} from '../../segments';

const SEGMENTS = {
    PIECE: {
        name: 'PIECE',
        action: piece,
        subsection: 'SECTION',
        defaultSubsections: 2,
        gridSize: 10
    },
    SECTION: {
        name: 'SECTION',
        action: section,
        subsection: 'PASSAGE',
        defaultSubsections: 2,
        gridSize: 10
    },
    PASSAGE: {
        name: 'PASSAGE',
        action: passage,
        subsection: 'LONG_PHRASE',
        defaultSubsections: 4,
        gridSize: 10
    },
    LONG_PHRASE: {
        name: 'LONG PHRASE',
        action: longPhrase,
        subsection: 'SHORT_PHRASE',
        defaultSubsections: 2,
        gridSize: 10
    },
    SHORT_PHRASE: {
        name: 'SHORT PHRASE',
        action: shortPhrase,
        subsection: 'NOTE_CHANGE',
        defaultSubsections: 2,
        gridSize: 10
    },
    NOTE_CHANGE: {
        name: 'NOTE CHANGE',
        action: noteChange,
        subsection: null,
        defaultSubsections: 2,
        gridSize: 10
    }
}

export { SEGMENTS };