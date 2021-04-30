import React, { useState } from 'react'
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    Tooltip,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Box,
    Typography,
} from '@material-ui/core';
import {
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE, WINE_GLASS
} from '../presets';
import { RELEASE, TENSION } from '../segments/constants';
import { Chord } from 'octavian';
import Option from './global';

const OptionMenu = ({
    synth,
    setSynth,
    defaultMood,
    setDefaultMood,
    defaultRootNote,
    setDefaultRootNote,
    globalOptions,
    setGlobalOption,
    localOptions,
    setLocalOption,
    setOpt
}) => {
    const [ customSynthOpen, setCustomSynthOpen ] = useState(false);
    const closeCustomSynthDialogue = () => setCustomSynthOpen(false);
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
                onChange={ ({ target: { value }}) => setSynth( value ) }>
                <MenuItem value={SINE}>SINE</MenuItem>
                <MenuItem value={SAWTOOTH}>SAWTOOTH</MenuItem>
                <MenuItem value={SQUARE}>SQUARE</MenuItem>
                <MenuItem value={TRIANGLE}>TRIANGLE</MenuItem>
                <MenuItem value={BOWED}>BOWED</MenuItem>
                <MenuItem value={PLUCKED}>PLUCKED</MenuItem>
                <MenuItem value={VAMPIRE_CASTLE}>VAMPIRE CASTLE</MenuItem>
                <MenuItem value={BIT_VOICE}>8 BIT VOICE</MenuItem>
                <MenuItem value={WINE_GLASS}>WINE GLASS</MenuItem>
                {/* Put customized synths here once created */}
                <MenuItem value={SINE}>
                    CUSTOM: <Button
                        value={SINE}
                        onClick={() => setCustomSynthOpen(true)}>
                            CUSTOMIZE
                        </Button>
                </MenuItem>
            </Select>
        </Grid>
        <Dialog open={customSynthOpen} onClose={closeCustomSynthDialogue} aria-labelledby="custom-synthesizer-form">
            <DialogTitle id="custom-synthesizer-form">CUSTOM SYNTHESIZER</DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Use the form below to implement a custom synthesizer.
                </DialogContentText>
            <Typography>CORE DETAILS</Typography>
            <TextField autoFocus id="name" label="NAME" fullWidth />
            <TextField value={0.3} type={ 'number' } placeholder={'0.3'} id="gain" label="GAIN" />
            <TextField value={0.01} type={ 'number' } placeholder={'0.01'} id="attack" label="ATTACK" />
            <Box>
                <Tooltip
                    placement={ 'top' }
                    title={ 'SELECT HOW EACH NOTE SHOULD RAMP UP' }
                    aria-label={ 'select how each note should ramp up' }>
                    <InputLabel id="ramp-pattern">RAMP PATTERN:</InputLabel>
                </Tooltip>
                <Select
                    labelId="ramp-pattern"
                    id="ramp-pattern-selector"
                    value={ 'EXP' }
                    onChange={ ()=>{} }>
                    <MenuItem value={'LIN'}>LINEAR</MenuItem>
                    <MenuItem value={'EXP'}>EXPONENTIAL</MenuItem>
                </Select>
            </Box>
            <TextField value={2} type={ 'number' } placeholder={'2'} id="decay" label="DECAY" />
            <Box>
                <Tooltip
                    placement={ 'top' }
                    title={ 'SELECT HOW EACH NOTE SHOULD RAMP DOWN' }
                    aria-label={ 'select how each note should ramp down' }>
                    <InputLabel id="decay-pattern">DECAY PATTERN:</InputLabel>
                </Tooltip>
                <Select
                    labelId="decay-pattern"
                    id="decay-pattern-selector"
                    value={ 'EXP' }
                    onChange={ ()=>{} }>
                    <MenuItem value={'LIN'}>LINEAR</MenuItem>
                    <MenuItem value={'EXP'}>EXPONENTIAL</MenuItem>
                </Select>
            </Box>
            </DialogContent>
            <DialogContent dividers>
                <Typography>VIBRATO:</Typography>
                <TextField value={''} type={ 'number' } placeholder={'4'} id="vibrato-rate" label="VIBRATO RATE" />
                <TextField value={''} type={ 'number' } placeholder={'0.20'} id="vibrato-depth" label="VIBRATO DEPTH" />
            </DialogContent>
            <DialogContent dividers>
                <Typography>WAVEFORM:</Typography>
                <Tooltip
                    placement={ 'top' }
                    title={ 'SELECT A SIMPLE WAVEFORM' }
                    aria-label={ 'select a simple waveform' }>
                    <InputLabel id="simple-waveform">SIMPLE WAVEFORM:</InputLabel>
                </Tooltip>
                <Select
                    fullWidth
                    labelId="simple-waveform"
                    id="simple-waveform-selector"
                    value={ 'sine' }
                    onChange={ ()=>{} }>
                    <MenuItem value={'sine'}>SINE</MenuItem>
                    <MenuItem value={'sawtooth'}>SAWTOOTH</MenuItem>
                    <MenuItem value={'square'}>SQUARE</MenuItem>
                    <MenuItem value={'triangle'}>TRIANGLE</MenuItem>
                </Select>
                <Typography>WAVEFORM FROM WAVETABLE:</Typography>
                <TextField fullWidth value={''} placeholder={'0,1,0,0.5,0,0.25...'} id="real-waves" label="REALS" />
                <TextField fulllWidth value={''} placeholder={'0,0,0,0,0,0...'} id="vibrato-depth" label="IMAGINARIES" />
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCustomSynthDialogue} color="primary">
                    Cancel
                </Button>
                <Button onClick={closeCustomSynthDialogue} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
        <Grid item>
            <Tooltip
                placement={ 'top' }
                title={ 'SELECT DEFAULT ROOT NOTE' }
                aria-label={ 'select default root note' }>
                <InputLabel id="root-note-set">DEFAULT ROOT NOTE:</InputLabel>
            </Tooltip>
            <TextField
                onChange={ ({ target: { value }}) => setDefaultRootNote(value) }
                onBlur={ ({ target: { value }}) => {
                    try {
                        // eslint-disable-next-line no-unused-vars
                        new Chord(value);
                    } catch {
                        console.warn('Invalid value for default note, resetting to C3', value);
                        setDefaultRootNote('C3');
                    }
                }}
                label={'Root Note'}
                id={'root-note-set'}
                placeholder={'A#1, Bb8, C3'}
                value={ defaultRootNote } />
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