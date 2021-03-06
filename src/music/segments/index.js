import { Chord } from 'octavian';
import {
    TENSION, RELEASE,
    startingNotes,
    tenseMoves, releaseMoves, octaveMoves } from './constants';
import { getStrategy } from './chords';

// Move to utilities folder
const pick = (array) => array[Math.floor(Math.random()*array.length)];
const getRandBias = (length, bias, influence) => {
    const rawBias = Math.floor((Math.random() * length) *
        (1 - (Math.random() * influence)) +
        (bias * (Math.random() * influence)));
    const clamped = rawBias >= length ? length-1 : rawBias < 0 ? 0 : rawBias;
    return clamped;
}
const pickBiasEarly = (array) => {
    const picked = getRandBias(array.length, 0, 2);
    let result = array[picked];
    if(typeof(result) === 'undefined') {
        console.log('error selecting: ', picked, array);
        // Try one more time
        const pickedSecond = getRandBias(array.length, 0, 1.1);
        result = array[pickedSecond];
    }
    return result;
}
const pickBiasLate = (array) => {
    const picked = getRandBias(array.length, array.length-1, 1.1);
    let result = array[picked];
    if(typeof(result) === 'undefined') {
        console.log('error selecting: ', picked, array);
        // Try one more time
        const pickedSecond = getRandBias(array.length, array.length-1, 1.1);
        result = array[pickedSecond];
    }
    return result;
}
// utilities

const diatom = (root, mood, chordStrategy='none,default', chordOptions) => {
    let method, alterMethod;
    // Determine this with a max octave setting
    const aboveMiddle = root.octave > 5 ? root.octave - 2 : 0;
    const octaveDropChance = aboveMiddle / 6;
    if(mood === TENSION) {
        if(Math.random() < octaveDropChance) {
            // console.log('Dropping: octave, chance', root.octave, octaveDropChance);
            alterMethod = 'downOctave';
            method = pickBiasLate(tenseMoves);
        } else {
            method = pickBiasEarly(tenseMoves);
        }
    } else if(mood === RELEASE) {
        // Falling more likely for release
        if(root.octave > 1 && Math.random() < 0.5) {
            alterMethod = 'downOctave';
            method = pickBiasLate(releaseMoves.slice(0,-1)) // Hack to ignore root note, replace later
        } else {
            method = pickBiasEarly(releaseMoves);
        }
        if(method === false) {
            console.log('false; selecting root',  root);
            let next = root.toChord();
            next = getStrategy(chordStrategy)({ ...chordOptions, mood })( next );
            return [root, next];
        }
    }
    let next;
    const alteredRoot = alterMethod ? root[alterMethod]() : root;
    try {
        next = alteredRoot[method]().toChord();
        next = getStrategy(chordStrategy)({...chordOptions, mood })(next);
    } catch (error) {
        console.log('error, method:', method, alteredRoot);
        const safeNote = new Chord(pick(startingNotes));
        return [safeNote, safeNote];
    }
    return [root,next];
}

const createDiatoms = (rootNote, endNote, moods = [], chordStrategy, chordOptions) => {
    const notes = moods.reduce(
        (accumulator, mood) => {
            const next = diatom(accumulator[accumulator.length-1].notes[0], mood, chordStrategy, chordOptions);
            return [...accumulator, next[1]];
        },
        [rootNote]
    );
    return notes;
}

const moodsFromMood = (mood, n = 2) => {
    if(Array.isArray(mood)) {
        return mood;
    }
    let moods = [];
    let count = 1;
    let nextMood;
    if(mood === TENSION) {
        while(count < n) {
            ++count;
            nextMood = Math.random() < 0.3 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
        moods.push(TENSION);
    } else if(mood === RELEASE) {
        while(count < n) {
            ++count;
            nextMood = Math.random() < 0.7 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
        moods.push(RELEASE);
    } else {
        while(count <= n) {
            ++count;
            nextMood = Math.random() < 0.5 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
    }
    return moods;
}

const noteChange = (rootNote, mood, endNote, chordStrategy, chordOptions) => {
    return createDiatoms(rootNote, endNote, [mood], chordStrategy, chordOptions);
}

const shortPhrase = (rootNote, endNote, mood, chordStrategy, chordOptions, n = 4, first = true) => {
    if(first) n--;
    const moods = moodsFromMood(mood, n);
    return createDiatoms(rootNote, endNote, moods, chordStrategy, chordOptions);
}

const createComplex = (rootNote, endNote, moods, chordStrategy, chordOptions, f, n, first = false) => {
    // TODO: If endNote octave is specified, make sure the last few notes 'point' in that direction

    const notes = moods.reduce(
        (accumulator, mood) => {
            let next;
            // Allow moving away from root for sake of tension
            next = f(accumulator[accumulator.length-1], false, mood, chordStrategy, chordOptions, n, first);
            first = false;
            return [...accumulator, ...next.slice(1)];
        },
        [rootNote]
    );

    // If octave is not on endNote, get octave from previous note and;
    //    if tension, move up to closest correct note, if release move down to closest correct note
    let endNoteChord;
    try {
        if(!(/[\w|#]+\d$/.test(endNote))) {
            const previousChord = notes[notes.length-2];
            const octave = previousChord.notes[0].octave;
            const letter = previousChord.notes[0].letter;
            // If e.g. G > A, we would like to move from e.g. G4 -> A5
            // and would not like to move from e.g. G4 -> A3
            let octaveModifier = letter > endNote;
            if(octave) {
                switch(moods[moods.length-1]) {
                    case RELEASE:
                        octaveModifier -= Math.round(Math.random(0.5));
                        endNoteChord = new Chord(`${endNote}${octave+octaveModifier}`)
                        break;
                    case TENSION:
                        octaveModifier += Math.round(Math.random(0.5));
                        endNoteChord = new Chord(`${endNote}${octave+octaveModifier}`)
                        break;
                    default:
                        endNoteChord = new Chord(`${endNote}${octave}`)
                        break;
                }
            }
        } else {
            endNoteChord = new Chord(endNote);
        }
        notes[notes.length-1] = endNoteChord;
    } catch(e) {
        console.error('Error trying to create end note chord, leaving it alone:', endNote, e);
    }

    console.log(f.name, notes.length);
    return notes;
}

const longPhrase = (rootNote, endNote, mood, chordStrategy, chordOptions, n = 2, first = true) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, endNote, moods, chordStrategy, chordOptions, shortPhrase, 4, first);
}

const passage = (rootNote, endNote, mood, chordStrategy, chordOptions, n = 2, first = true) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, endNote, moods, chordStrategy, chordOptions, longPhrase, 4, first);
}

const section = (rootNote, endNote, mood, chordStrategy, chordOptions, n = 2, first = true) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, endNote, moods, chordStrategy, chordOptions, passage, 2, first);
}

const piece = (rootNote, endNote, mood, chordStrategy, chordOptions, n = 2, first = true) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, endNote, moods, chordStrategy, chordOptions, section, 2, first);
}

const repeatNotes = (notes, n) => {
    const newNotes = [...notes];
    while(--n > 0) newNotes.push(...notes);
    return newNotes;
}

export {
    repeatNotes,
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    noteChange,
    pick,
    startingNotes
};