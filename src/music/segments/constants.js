const TENSION = 'tension';
const RELEASE = 'release';
const EITHER = 'either';

const ACCURATE = 'accurate';
const SLOPPY = 'sloppy';

const startingNotes = ['C3','D3','E3','F3','G3','A3','B3','C4'];

const tenseMoves = [
    'minorSecond',
    'majorSecond',
    'minorThird',
    'perfectFourth',
    'diminishedFifth',
    'minorSixth',
    'majorSixth',
    'minorSeventh'
];

const releaseMoves = [
    'majorThird',
    'perfectFifth',
    'majorSeventh',
    false
];

const octaveMoves = [
    'downOctave',
    'perfectOctave'
]

export {
    TENSION, RELEASE, EITHER,
    ACCURATE, SLOPPY,
    startingNotes,
    tenseMoves, releaseMoves, octaveMoves
}