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

// Play helpers - Put these in their own folder
const getTimes = bpm => {
    const timeBeforeNewNote = Math.floor(60*1000/bpm)
    return {
        timeBeforeNewNote,
        lengthOfNote: timeBeforeNewNote + (timeBeforeNewNote*0.24)
    }
}

const playNote = (frequency, context, lengthOfNote, synth = SINE) => {
    synth.playNote(context, frequency, lengthOfNote);
}

const playNotes = (notes, context, synth, bpm) => {
    const { timeBeforeNewNote, lengthOfNote } = getTimes(bpm);
    notes.map((note, i) => {
        setTimeout(
            () => playNote(note.frequency, context, lengthOfNote, synth),
            i * timeBeforeNewNote
    )});
}

// Note helpers ends

//Config to go in own file
const soundControlsShouldUpdateOn = ['bpm'];

// Config ends

const context = new AudioContext();

const SoundControls = ({
    addNewSoundControls,
    primary,
    removeSelf,
    addToAdditionalNotes,
    playAdditionalNotes,
    setGlobalOption,
    globalOptions
}) => {
    const [notes, setNotes] = useState([]);
    const [defaultMood, setDefaultMood] = useState(RELEASE);
    const [defaultRootNote, setDefaultRootNote] = useState('C3');
    const [synth, setSynth] = useState(SAWTOOTH);
    const [lockedIndexes, setLocks] = useState([]);

    const [localOptions, setLocalOptions] = useState(globalOptions);
    const [deFactoOptions, setDeFactoOptions] = useState(globalOptions);
    const setLocalOption = (key) => ({ target: { value } }) => {
        setLocalOptions(prev => Object.assign(
      {...prev},
      { [key]: value }
    ));
    }
    const setDeFactoOption = (key, value) => {
        setDeFactoOptions(prev => Object.assign(
      {...prev},
      { [key]: value }
    ));
    }

    const { bpm } = deFactoOptions;
    const soundControlValues = soundControlsShouldUpdateOn.reduce((acc, curr) => {
        acc[curr] = deFactoOptions[curr];
        return acc;
    },{})

    const handlePlay = () => {
        playNotes(notes.flat(), context, synth, bpm);
    }

    const handleSetNotes = value => {
        addToAdditionalNotes({ value, context, synth, bpm });
        setNotes( value );
    }

    const handleSetSynth = value => {
        addToAdditionalNotes({ value: id=>id, context, synth: value, bpm });
        setSynth( value );
    }

    const handleSetDeFactoOption = key => ({ target: { value } }) => {
        if(soundControlsShouldUpdateOn.includes(key)) {
            addToAdditionalNotes(
                Object.assign({
                    value: id=>id,
                    context,
                    synth,
                    ...soundControlValues
                },{
                    [key]: value
                }
            ));
        }
        setDeFactoOption(key, value);
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
                setSynth={ handleSetSynth }
                defaultMood={ defaultMood }
                setDefaultMood={ setDefaultMood }
                defaultRootNote={ defaultRootNote }
                setDefaultRootNote={ setDefaultRootNote }
                setLocks={ setLocks }
                globalOptions={ globalOptions }
                setGlobalOption={ setGlobalOption }
                localOptions={ localOptions }
                setLocalOption={ setLocalOption }
                setDeFactoOption={ handleSetDeFactoOption }
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
            primary &&
            <Grid item xs={10}>
                <Button color={'primary'} onClick={ handlePlayAll }>PLAY ALL TRACKS ➣</Button>
            </Grid>
        }
        {
            primary ?
            <div id='remove-track-placeholde'></div> :
            <Grid item xs={10}>
                <Button color={'secondary'} onClick={ removeSelf }>REMOVE TRACK</Button>
            </Grid>
        }
    </Grid>
    </Box>;
}

export { SoundControls, playNotes };