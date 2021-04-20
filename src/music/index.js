import React, { useState } from 'react';
import {
    Button,
    Grid,
    Typography
} from '@material-ui/core';
import SoundElementContainer from './soundelement-container';
import {
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE
} from './presets';

const playNote = (frequency, context, lengthOfNote, synth = SINE) => {
    SAWTOOTH.playNote(context, frequency, lengthOfNote);
}

const playNotes = (notes, context, synth) => {
    const timeBeforeNewNote = 500;
    const lengthOfNote = 620;
    notes.map((note, i) => {
        setTimeout(
            () => playNote(note.frequency, context, lengthOfNote, synth),
            i * timeBeforeNewNote
    )});
}

const context = new AudioContext();

const SoundControls = () => {
    const [notes, setNotes] = useState([]);
    const [synth, setSynth] = useState(BOWED);
    const [lockedIndexes, setLocks] = useState([]);

    const handlePlay = () => {
        playNotes(notes.flat(), context, synth);
    }

    return <Grid container spacing={2} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item xs={12} >
            <SoundElementContainer setNotes={ setNotes } setLocks={ setLocks }/>
        </Grid>
        <Grid item xs={10}>
            <Typography align={'left'}>
                { notes.map((noteSegment, i) => {
                    let color;
                    switch(i % 3) {
                        case 0:
                            color = '#EF4646';
                            break;
                        case 1:
                            color = '#A2A2EF';
                            break;
                        case 2:
                        default:
                            color = '#A2EFA2';
                            break;
                    }
                    return <span key={ `text-${i}` } style={{ color }}>
                    { noteSegment.map(note =>`${note.letter}${note.modifier ? note.modifier : ''}${note.octave}`).join(' ') }&nbsp;
                </span>
                }) }
            </Typography>
        </Grid>
        <Grid item xs={10}>
            <Button color={'primary'} onClick={ handlePlay }>PLAY ➣</Button>
        </Grid>
    </Grid>;
}

export { SoundControls };