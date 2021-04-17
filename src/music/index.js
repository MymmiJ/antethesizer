import React, { useState } from 'react';
import {Note} from 'octavian';
import {
    Button,
    Grid,
    Typography
} from '@material-ui/core';
import SoundElementContainer from './soundelement-container';
import {
    repeatNotes,
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    diatom,
    TENSION,
    RELEASE,
    EITHER,
    pick,
    startingNotes
} from './segments';

const withEnvelope = (context, oscillator, decayRate, gain) => {
    const envelope = context.createGain()
    envelope.gain.value = gain;
    oscillator.connect(envelope)
    envelope.connect(context.destination);
    envelope.gain.exponentialRampToValueAtTime(0.001, context.currentTime + decayRate)
    return envelope;
}

const playNote = (frequency, context, speed) => {
    const oscillator = context.createOscillator()
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sawtooth';

    // vampire castleish sound
    // const real = [0,0.8,-0.9,0.9,1,0.9,-0.8,0.8,-0.6,0.6,0,0,0.4,0.2,0.1,-1,1];
    // const imag = [0,0,0,0,0,0.9,-0.8,0.8,-0.6,0.6,0,0,0.2,0.4,0,1,-1];
    // const customWave = context.createPeriodicWave(real,imag);
    // oscillator.setPeriodicWave(customWave);

    const withEnv = withEnvelope(context, oscillator, 2, 0.3);
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

const generateNotes = () => {
    const rootNote = new Note(pick(startingNotes));

    const notes = piece(rootNote, TENSION, 2);

    return repeatNotes(notes, 3);
    // return notes;
}

const SoundControls = () => {
    const [notes, setNotes] = useState([]);
    const context = new AudioContext()

    const handlePlay = () => {
        const notes = generateNotes();
        setNotes(notes);
        playNotes(notes, context);
    }

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