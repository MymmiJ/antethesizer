import React, { useState } from 'react'
import {
    Button,
    Grid,
    Tooltip,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Typography
} from '@material-ui/core';
import {
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE, DRUM, WINE_GLASS
} from '../presets';
import { RELEASE, TENSION } from '../segments';
import Option from './global';

const OptionMenu = ({
    synth,
    setSynth,
    defaultMood,
    setDefaultMood,
    globalOptions,
    setGlobalOption,
    localOptions,
    setLocalOption,
    setOpt
}) => {
    const { bpm } = globalOptions;
    const { bpm: localBPM } = localOptions;
    return <Grid container spacing={4} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item>
            <Tooltip
                placement={ 'top' }
                title={ 'SELECT A SYNTH TYPE' }
                aria-label={ 'select a synth type' }>
                <InputLabel id="synth-select">SYNTHESIZER:</InputLabel>
            </Tooltip>
            <Select
                labelId="synth-select"
                id="synth-selector"
                value={ synth }
                onChange={ ({ target: { value }}) => setSynth( value ) }
            >
                <MenuItem value={SINE}>SINE</MenuItem>
                <MenuItem value={SAWTOOTH}>SAWTOOTH</MenuItem>
                <MenuItem value={SQUARE}>SQUARE</MenuItem>
                <MenuItem value={TRIANGLE}>TRIANGLE</MenuItem>
                <MenuItem value={BOWED}>BOWED</MenuItem>
                <MenuItem value={PLUCKED}>PLUCKED</MenuItem>
                <MenuItem value={VAMPIRE_CASTLE}>VAMPIRE CASTLE</MenuItem>
                <MenuItem value={BIT_VOICE}>8 BIT VOICE</MenuItem>
                <MenuItem value={DRUM}>PERCUSSIVE</MenuItem>
                <MenuItem value={WINE_GLASS}>WINE GLASS</MenuItem>
            </Select>
        </Grid>
        <Grid item>
            <Tooltip
                placement={ 'top' }
                title={ 'SELECT DEFAULT MOOD' }
                aria-label={ 'select default mood' }>
                <InputLabel id="mood-select">DEFAULT MOOD:</InputLabel>
            </Tooltip>
            <Select
                labelId="mood-select"
                id="mood-selector"
                value={ defaultMood }
                onChange={ ({ target: { value }}) => setDefaultMood( value ) }
            >
                <MenuItem value={TENSION}>TENSION</MenuItem>
                <MenuItem value={RELEASE}>RELEASE</MenuItem>
            </Select>
        </Grid>
        <Grid item xs={ 2 }>
            <Option
                Type={ TextField }
                global={ bpm }
                setGlobal={ setGlobalOption('bpm') }
                tooltipDetails={{ placement: 'top', title: 'Beats Per Minute', label: 'BPM:', aria_label: 'beats per minute' }}
                setLocal={ setLocalOption('bpm') } local={ localBPM } type={ 'number' }
                setOpt={ setOpt('bpm') }/>
        </Grid>
    </Grid>;
};

export default OptionMenu;