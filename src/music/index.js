import React, { useState } from 'react';
import {
    Button,
    Box,
    Grid,
    Typography
} from '@material-ui/core';
import SoundElementContainer from './soundelement-container';
import {
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE, DRUM, WINE_GLASS
} from './presets';
import { RELEASE } from './segments';

const playNote = (frequency, context, lengthOfNote, synth = SINE) => {
    synth.playNote(context, frequency, lengthOfNote);
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

const SoundControls = ({
    addNewSoundControls,
    removable,
    removeSelf,
    addToAdditionalNotes,
    playAdditionalNotes,
    setGlobalOption,
    globalOptions
}) => {
    const [notes, setNotes] = useState([]);
    const [defaultMood, setDefaultMood] = useState(RELEASE);
    const [synth, setSynth] = useState(SAWTOOTH);
    const [lockedIndexes, setLocks] = useState([]);

    const handlePlay = () => {
        playNotes(notes.flat(), context, synth);
    }

    const handleSetNotes = value => {
        addToAdditionalNotes( value, context, synth );
        setNotes( value );
    }
    
    const handlePlayAll = () => {
        handlePlay();
        playAdditionalNotes();
    }

    return <Box
        boxShadow={20}
        border={4}
        borderTop={0}
        borderLeft={0}
        borderRight={0}
        borderColor="secondary.main">
    <Grid container spacing={2} alignContent={'center'} alignItems={'center'} justify={'center'} borderbottom={1}>
        <Grid item xs={12} >
            <SoundElementContainer
                setNotes={ handleSetNotes }
                synth={ synth }
                setSynth={ setSynth }
                defaultMood={ defaultMood }
                setDefaultMood={ setDefaultMood }
                setLocks={ setLocks }
                globalOptions={ globalOptions }
                setGlobalOption={ setGlobalOption }
                addNewSoundControls={ addNewSoundControls }
                />
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
        {
            removable ||
            <Grid item xs={10}>
                <Button color={'primary'} onClick={ handlePlayAll }>PLAY ALL TRACKS ➣</Button>
            </Grid>
        }
        {
            removable &&
            <Grid item xs={10}>
                <Button color={'secondary'} onClick={ removeSelf }>REMOVE TRACK</Button>
            </Grid>
        }
    </Grid>
    </Box>;
}

export { SoundControls, playNotes };