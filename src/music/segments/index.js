import { Chord } from 'octavian';
import {
    TENSION, RELEASE,
    startingNotes,
    tenseMoves, releaseMoves } from './constants';
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
        method = pickBiasEarly(releaseMoves);
        if(method === false) {
            console.log('false; selecting root',  root);
            let next = root.toChord();
            next = getStrategy(chordStrategy)({ ...chordOptions, mood })( next );
            return [root, next];
        }
        // Falling more likely for release
        if(!method.includes('Octave')
            && root.octave > 1
            && Math.random() < 0.5) {
            alterMethod = 'downOctave';
        }
    }
    let next;
    const alteredRoot = alterMethod ? root[alterMethod]() : root;
    try {
        next = alteredRoot[method]().toChord();
        next = getStrategy(chordStrategy)({...chordOptions, mood })(next);
    } catch (error) {
        console.log('error, method:', method, alteredRoot, error);
        const safeNote = new Chord(pick(startingNotes));
        return [safeNote, safeNote];
    }
    return [root,next];
}

const createDiatoms = (rootNote, moods = [], chordStrategy, chordOptions) => {
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

const noteChange = (rootNote, mood, chordStrategy, chordOptions) => {
    return createDiatoms(rootNote, [mood], chordStrategy, chordOptions);
}

const shortPhrase = (rootNote, mood, chordStrategy, chordOptions) => {
    const moods = moodsFromMood(mood);
    return createDiatoms(rootNote, moods, chordStrategy, chordOptions);
}

const createComplex = (rootNote, moods, chordStrategy, chordOptions, f) => {
    const notes = moods.reduce(
        (accumulator, mood) => {
            let next;
            if(mood === TENSION) {
                // Allow moving away from root for sake of tension
                next = f(accumulator[accumulator.length-1], mood, chordStrategy, chordOptions);
            } else {
                // Check with both these; else revert to using rootNote
                next = f(accumulator[accumulator.length-1], mood, chordStrategy, chordOptions);
            }
            return [...accumulator, ...next.slice(1)];
        },
        [rootNote]
    );
    return notes;
}

const longPhrase = (rootNote, mood, chordStrategy, chordOptions) => {
    const moods = moodsFromMood(mood);
    return createComplex(rootNote, moods, chordStrategy, chordOptions, shortPhrase);
}

const passage = (rootNote, mood, chordStrategy, chordOptions, n = 4) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, moods, chordStrategy, chordOptions, longPhrase);
}

const section = (rootNote, mood, chordStrategy, chordOptions, n = 2) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, moods, chordStrategy, chordOptions, passage);
}

const piece = (rootNote, mood, chordStrategy, chordOptions, n = 2) => {
    const moods = moodsFromMood(mood, n);
    return createComplex(rootNote, moods, chordStrategy, chordOptions, section);
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