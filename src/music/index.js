import React, { useState } from 'react';
import {Note} from 'octavian';
import {
    Button,
    Slider,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import SoundElementContainer from './soundelement-container';

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

const moodsFromMood = (mood, n = 2) => {
    let moods = [];
    let count = 1;
    let nextMood;
    if(mood === TENSION) {
        while(count < n) {
            ++count;
            nextMood = Math.random() < 0.4 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
        moods.push(TENSION);
        console.log(TENSION, moods);
    } else if(mood === RELEASE) {
        while(count < n) {
            ++count;
            nextMood = Math.random() < 0.5 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
        moods.push(RELEASE);
        console.log(RELEASE, moods);
    } else {
        while(count <= n) {
            ++count;
            nextMood = Math.random() < 0.5 ? RELEASE : TENSION;
            moods.push(nextMood);
        }
        console.log(EITHER, moods);
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
            let next;
            if(mood === TENSION) {
                // Allow moving away from root for sake of tension
                next = f(accumulator[accumulator.length-1], mood);
            } else {
                next = f(rootNote, mood);
            }
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
    return newNotes;
}

const generateNotes = () => {
    const rootNote = new Note(pick(startingNotes));

    const notes = longPhrase(rootNote, TENSION);

    return repeatNotes(notes, 4);
}

const SoundControls = () => {
    const [notes, setNotes] = useState([]);
    const context = new AudioContext()


    const handlePlay = () => {
        const notes = generateNotes();
        setNotes(notes);
        playNotes(notes, context);
    }

    console.log(notes);

    return <Grid container spacing={2} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} >
            <SoundElementContainer />
        </Grid>
        <Grid item xs={12}>
            <Typography align={'center'}>
                { notes.map(note => `${note.letter}${note.modifier ? note.modifier : ''}${note.octave}`).join(' ') }
            </Typography>
        </Grid>
        <Grid item xs={1}>
            <Button color={'primary'} onClick={ handlePlay }>PLAY ➣</Button>
        </Grid>
    </Grid>;
}

export { SoundControls };