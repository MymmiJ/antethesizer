import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Tooltip,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
    Typography,
} from '@material-ui/core';
import { BUILT_IN, CUSTOM, EXP, LIN } from '../presets';

const CustomSynthMenu = ({
    customSynthOpen,
    confirmCustomSynthDialogue,
    closeCustomSynthDialogue,
    synthMethodReplace,
    synthControls: {
        addCustomSynth,
        replaceCustomSynth,
        removeCustomSynth,
    },
    setCurrentSynth,
    formValues: {
        name,
        synthValues,
    },
    currentKey
}) => {
    const updateMethod = synthMethodReplace ? replaceCustomSynth(currentKey) : addCustomSynth(currentKey);

    const validate = () => {
        return name.length < 1;
    }
    const failed = validate();

    return <Dialog open={customSynthOpen} onClose={closeCustomSynthDialogue} aria-labelledby="custom-synthesizer-form">
        <DialogTitle id="custom-synthesizer-form">CUSTOM SYNTHESIZER</DialogTitle>
        <DialogContent dividers>
            <DialogContentText>
                Use the form below to implement a custom synthesizer.
            </DialogContentText>
        <Typography>CORE DETAILS:</Typography>
        <TextField value={name} id="name" label="NAME (*)" fullWidth
            onChange={setCurrentSynth(['name'])}/>
        <TextField value={synthValues.gain} type={ 'number' } placeholder={'0.3'} id="gain" label="GAIN"
            onChange={ setCurrentSynth(['synthValues', 'gain']) } />
        <TextField value={synthValues.gainRampTime} type={ 'number' } placeholder={'0.01'} id="attack" label="ATTACK"
            onChange={ setCurrentSynth(['synthValues', 'gainRampTime']) }/>
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
                value={ synthValues.gainMethod }
                onChange={ setCurrentSynth(['synthValues', 'gainMethod']) }>
                <MenuItem value={LIN}>LINEAR</MenuItem>
                <MenuItem value={EXP}>EXPONENTIAL</MenuItem>
            </Select>
        </Box>
        <TextField value={ synthValues.decay } type={ 'number' } placeholder={'2'} id="decay" label="DECAY"
            onChange={ setCurrentSynth(['synthValues', 'decay']) } />
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
                value={ synthValues.decayMethod }
                onChange={ setCurrentSynth(['synthValues', 'decayMethod']) }>
                <MenuItem value={LIN}>LINEAR</MenuItem>
                <MenuItem value={EXP}>EXPONENTIAL</MenuItem>
            </Select>
        </Box>
        </DialogContent>
        <DialogContent dividers>
            <Typography>VIBRATO:</Typography>
            <TextField value={synthValues.vibratoFacts.rate || ''} type={ 'number' } placeholder={'4'} id="vibrato-rate" label="VIBRATO RATE"
                onChange={ setCurrentSynth(['synthValues', 'vibratoFacts', 'rate']) }/>
            <TextField value={synthValues.vibratoFacts.gain || ''} type={ 'number' } placeholder={'0.20'} id="vibrato-depth" label="VIBRATO DEPTH"
                onChange={ setCurrentSynth(['synthValues', 'vibratoFacts', 'gain']) }/>
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
                labelId="simple-waveform"
                id="simple-waveform-selector"
                value={ synthValues.waveform.type }
                onChange={ event => {
                    setCurrentSynth(['synthValues', 'waveform', 'superType'])({ target: { value: BUILT_IN } });
                    setCurrentSynth(['synthValues', 'waveform', 'type'])(event);
                } }>
                <MenuItem value={'sine'}>SINE</MenuItem>
                <MenuItem value={'sawtooth'}>SAWTOOTH</MenuItem>
                <MenuItem value={'square'}>SQUARE</MenuItem>
                <MenuItem value={'triangle'}>TRIANGLE</MenuItem>
            </Select>
            <Tooltip
                placement={ 'top' }
                title={ 'CONSTRUCT A WAVEFORM USING WAVETABLE FIELDS' }
                aria-label={ 'construct a waveform using wavetable fields' }>
                <InputLabel>WAVEFORM FROM WAVETABLE:</InputLabel>
            </Tooltip>
            <TextField fullWidth value={synthValues.waveform.real || ''} placeholder={'0,1,0,0.5,0,0.25...'} id="real-waves" label="REALS"
                onChange={ event => {
                    setCurrentSynth(['synthValues', 'waveform', 'superType'])({ target: { value: CUSTOM } });
                    setCurrentSynth(['synthValues', 'waveform', 'real'])(event);
                }}/>
            <TextField fullWidth value={synthValues.waveform.imag || ''} placeholder={'0,0,0,0,0,0...'} id="imag-waves" label="IMAGINARIES"
                onChange={ event => {
                    setCurrentSynth(['synthValues', 'waveform', 'superType'])({ target: { value: CUSTOM } });
                    setCurrentSynth(['synthValues', 'waveform', 'imag'])(event);
                }}/>
        </DialogContent>
        <DialogActions>
            { failed && <Typography style={{ fontSize: '12px' }} color={'primary'}>
                Cannot save: check all necessary fields(*) are filled in
            </Typography>}
            <Button onClick={closeCustomSynthDialogue} color="primary">
                Cancel
            </Button>
            <Button
                disabled={ failed }
                onClick={() => confirmCustomSynthDialogue(name, synthValues, updateMethod)} color="primary">
                Confirm
            </Button>
        </DialogActions>
    </Dialog>;
}

export default CustomSynthMenu;