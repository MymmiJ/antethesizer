import React, { useState } from 'react';
import {
    Button,
    Box,
    Grid,
} from '@material-ui/core';
import SegmentContainer from './segment-components/segment-container';
import { SINE, TRIANGLE } from './presets';
import { ACCURATE, RELEASE } from './segments/constants';
import SegmentNoteDisplay from './segments/segment-note-display';
import accurateSetTimeout from '../timing/set-timeout';

// Play helpers - Put these in their own folder
const getTimes = bpm => {
    const timeBeforeNewNote = Math.floor(60*1000/bpm)
    return {
        timeBeforeNewNote,
        lengthOfNote: timeBeforeNewNote + (timeBeforeNewNote*0.24)
    }
}

const playNote = (frequency, context, lengthOfNote, synth = SINE, modifiedSetTimeout, useOscillator=()=>{}) => {
    return synth.playNote(context, frequency, lengthOfNote, modifiedSetTimeout, useOscillator);
}

const playNotes = (
        notes,
        context,
        synth,
        { bpm, timekeeping},
    useOscillator=()=>{}
) => {
    const { timeBeforeNewNote, lengthOfNote } = getTimes(bpm);
    let modifiedSetTimeout = setTimeout;
    if(timekeeping === ACCURATE) {
        modifiedSetTimeout = accurateSetTimeout;
    }
    return notes.map((chord, i) => chord.frequencies.map(
            frequency => modifiedSetTimeout(
                () => {
                    playNote(frequency, context, lengthOfNote, synth, modifiedSetTimeout, useOscillator)
                },
                i * timeBeforeNewNote
        )));
}

// Note helpers ends

//Config to go in own file
const soundControlsShouldUpdateOn = ['bpm', 'useGlobalBPM', 'timekeeping', 'useGlobalTimekeeping' ];
// Config ends

const SoundControls = ({
    description: { notes, synth, locked },
    context,
    customSynths,
    synthControls,
    addNewSoundControls,
    primary,
    removeSelf,
    addToAdditionalNotes,
    toggleLock,
    playAdditionalNotes,
    playIndexedNotes,
    setGlobalOption,
    globalOptions
}) => {
    const [defaultMood, setDefaultMood] = useState(RELEASE);
    const [defaultRootNote, setDefaultRootNote] = useState('C3');

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

    const { bpm, useGlobalBPM, timekeeping, useGlobalTimekeeping } = deFactoOptions;
    const soundControlValues = soundControlsShouldUpdateOn.reduce((acc, curr) => {
        acc[curr] = deFactoOptions[curr];
        return acc;
    },{})

    const handleSetNotes = value => {
        addToAdditionalNotes({ value, context, synth, bpm, useGlobalBPM, timekeeping, useGlobalTimekeeping });
    }

    const handleSetSynth = value => {
        addToAdditionalNotes({ value: id=>id, context, synth: value, bpm, useGlobalBPM, timekeeping, useGlobalTimekeeping });
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
    const setDefactoOptions = (opts) => {
        const updateObject = Object.entries(opts).reduce((acc, [key, value]) => {
            setDeFactoOption(key, value);
            if(soundControlsShouldUpdateOn.includes(key)) {
                return Object.assign(acc, { [key]: value });
            }
            return acc;
        }, {
            value: id=>id,
            context,
            synth,
            ...soundControlValues
        });
        addToAdditionalNotes(updateObject);
    }
    
    const handlePlayAll = () => {
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
            <SegmentContainer
                setNotes={ handleSetNotes }
                synth={ synth }
                setSynth={ handleSetSynth }
                defaultMood={ defaultMood }
                setDefaultMood={ setDefaultMood }
                defaultRootNote={ defaultRootNote }
                setDefaultRootNote={ setDefaultRootNote }
                locked={ locked }
                toggleLock={ toggleLock }
                customSynths={ customSynths }
                synthControls={ synthControls }
                globalOptions={ globalOptions }
                setGlobalOption={ setGlobalOption }
                useGlobalBPM={ useGlobalBPM }
                useGlobalTimekeeping={ useGlobalTimekeeping }
                localOptions={ localOptions }
                setLocalOption={ setLocalOption }
                setDeFactoOption={ handleSetDeFactoOption }
                setDeFactoOptions={ setDefactoOptions }
                addNewSoundControls={ addNewSoundControls }
                />
        </Grid>
        <Grid item xs={10}>
            <SegmentNoteDisplay notes={ notes } />
        </Grid>
        <Grid item xs={10}>
            <Button color={'primary'} onClick={ playIndexedNotes }>PLAY ➣</Button>
        </Grid>
        {
            primary &&
            <Grid item xs={10}>
                <Button color={'primary'} onClick={ handlePlayAll }>PLAY ALL TRACKS ➣</Button>
            </Grid>
        }
        {
            primary ?
            <div id='remove-track-placeholder'></div> :
            <Grid item xs={10}>
                <Button color={'secondary'} onClick={ removeSelf }>REMOVE TRACK</Button>
            </Grid>
        }
    </Grid>
    </Box>;
}

export { SoundControls, playNotes };