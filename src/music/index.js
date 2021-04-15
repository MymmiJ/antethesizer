import {Note} from 'octavian';

const TENSION = 'tension';
const RELEASE = 'release';
const EITHER = 'either';

const startingNotes = ['C4','D4','E4','F4','G4','A4','B4','C5'];

const tenseMoves = [
    'minorSecond',
    'majorSecond',
    'perfectFourth',
    'diminishedFifth',
    'minorSixth',
    'majorSixth',
    'minorSeventh',
    'majorSeventh'
];

const releaseMoves = [
    false,
    'minorThird',
    'majorThird',
    'perfectFifth',
    'downOctave',
    'perfectOctave'
];

const octaveMoves = [
    'downOctave',
    'perfectOctave'
]

const pick = (array) => array[Math.floor(Math.random()*array.length)]
const secondHalf = (array) => array.splice(-Math.ceil(array.length / 2))

const playNote = (frequency, context, speed) => {
    const oscillator = context.createOscillator()
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine'
    
    const withEnv = withEnvelope(context, oscillator, 1.5, 1);
    withEnv.connect(context.destination)

    oscillator.start(context.currentTime)

    setTimeout(() => oscillator.stop(context.currentTime), speed)
}

const playNotes = (notes, context) => {
    notes.map((note, i) => setTimeout(
        () => playNote(note.frequency, context, 500),
        i * 500
    ));
}

const diatom = (root, mood) => {
    let method, alterMethod;
    if(mood === TENSION) {
        method = pick(tenseMoves);
    } else if(mood === RELEASE) {
        method = pick(releaseMoves);
        if(method === false) {
            return [root, root];
        }
        // Falling more likely for release
        if(!method.includes('Octave') && Math.random() > 0.5) {
            alterMethod = 'downOctave';
        }
    }
    const next = root[method]();
    const alteredNext = alterMethod ? next[alterMethod]() : next;
    console.log(alteredNext);
    return [root,alteredNext];
}

const createDiatoms = (rootNote, moods = []) => {
    const notes = moods.reduce(
        (accumulator, mood) => {
            const next = diatom(rootNote, mood);
            return [...accumulator, next[1]];
        },
        [rootNote]
    );
    return notes;
}

const moodsFromMood = (mood) => {
    let moods;
    if(mood === TENSION) {
        moods = pick([
            [TENSION, TENSION],
            [RELEASE, TENSION]
        ]);
    } else if(mood === RELEASE) {
        moods = pick([
            [TENSION, RELEASE],
            [RELEASE, RELEASE]
        ]);
    } else {
        moods = pick([
            [TENSION, TENSION],
            [RELEASE, TENSION],
            [TENSION, RELEASE],
            [RELEASE, RELEASE]
        ]);
    }
    return moods;
}

const shortPhrase = (rootNote, mood) => {
    const moods = moodsFromMood(mood);
    return createDiatoms(rootNote, moods);
}

const createComplex = (rootNote, moods, f) => {
    const notes = moods.reduce(
        (accumulator, mood) => {
            const next = f(rootNote, mood);
            console.log(next[1]);
            return [...accumulator, ...secondHalf(next)];
        },
        [rootNote]
    );
    return notes;
}

const longPhrase = (rootNote, mood) => {
    const moods = moodsFromMood(mood);
    return createComplex(rootNote, moods, shortPhrase);
}

const riff = (rootNote, mood, f) => {
    const riff = f(rootNote, mood);
    riff.push(rootNote);
    return riff;
}

const withEnvelope = (context, oscillator, decayRate, gain) => {
    const envelope = context.createGain()
    envelope.gain.value = gain;
    oscillator.connect(envelope)
    envelope.connect(context.destination);
    envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayRate)
    return envelope;
}

const repeatNotes = (notes, n) => {
    const newNotes = [];
    while(--n) newNotes.push(...notes);
    console.log(newNotes);
    return newNotes;
}

const generateNotes = () => {
    const rootNote = new Note(pick(startingNotes));

    const notes = riff(rootNote, TENSION, longPhrase);

    return repeatNotes(notes, 10);
}

const SoundButton = () => {
    const context = new AudioContext()

    return <button onClick={ () => playNotes(generateNotes(), context) }>Click Here</button>;
}

export { SoundButton };