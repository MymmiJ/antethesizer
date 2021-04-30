import React, { useState } from 'react'
import {
    Button,
    Grid,
    Tooltip,
    Select,
    MenuItem,
    InputLabel,
    TextField,
} from '@material-ui/core';
import {
    Synth,
    SINE, SAWTOOTH, SQUARE, TRIANGLE,
    BOWED, PLUCKED, VAMPIRE_CASTLE, BIT_VOICE, WINE_GLASS,
    DEFAULT_SYNTH_SETTINGS,
    Waveform
} from '../presets';
import { RELEASE, TENSION } from '../segments/constants';
import { Chord } from 'octavian';
import Option from './global';
import CustomSynthMenu from './custom-synth-menu';

// Move to utilities
const updateDeep = (object, path, value) => {
    let modifyTarget= object;
    path.forEach(function (key, index) {
        if (index === path.length -1) {
            modifyTarget[key] = value;
        } else {
            if (!modifyTarget[key]) {
                modifyTarget[key] = {};
            }
            modifyTarget = modifyTarget[key];
        }
    });
    return object;
};
//utilities end
const OptionMenu = ({
    synth,
    setSynth,
    customSynths,
    synthControls,
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
    const [ synthMethodReplace, setSynthMethodReplace ] = useState(false);
    const [ currentKey, setCurrentKey ] = useState(null);
    const [ currentSynth, setCurrentSynth ] = useState({
        name: '',
        synth: SINE,
        synthValues: DEFAULT_SYNTH_SETTINGS,
    });
    const openCustomSynthDialogue = (name, synth, synthValues, key) => () => {
        if(name && synth && synthValues && (key !== null && typeof key !== 'undefined')) {
            setSynthMethodReplace(true);
            setCurrentSynth({
                name,
                synth,
                synthValues: {...synthValues},
            });
            setCurrentKey(key);
        } else {
            setCurrentSynth({
                name: '',
                synth: SINE,
                synthValues: DEFAULT_SYNTH_SETTINGS,
            });
            setCurrentKey(null);
            setSynthMethodReplace(false);
        }
        setCustomSynthOpen(true);
    }
    const closeCustomSynthDialogue = () => setCustomSynthOpen(false);
    const confirmCustomSynthDialogue = (name, values, synthMethod) => {
        const { superType, type, real, imag } = values.waveform;
        const waveform = new Waveform(
            superType,
            type,
            real,
            imag
        );
        const nextSynth = {
            name: name,
            synth: new Synth(
                parseInt(values.decay),
                parseInt(values.gain),
                parseInt(values.gainRampTime),
                values.gainMethod,
                values.decayMethod,
                values.vibratoFacts,
                waveform
            ),
            synthValues: values
        }
        synthMethod(nextSynth);
        setSynth(nextSynth.synth);
        setCustomSynthOpen(false);
    }

    const updateCurrentSynth = keys => ({ target: { value } }) => {
        setCurrentSynth(prev => updateDeep({...prev},keys,value));
    };

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
                {
                    customSynths.map(
                        ({ name, synth, synthValues }, i) => {
                            return <MenuItem key={ `${name}-${i}` } value={synth}>
                                { name }: <Button
                                    value={synth}
                                    onClick={openCustomSynthDialogue(name, synth, synthValues, i)}>
                                        EDIT
                                    </Button>
                            </MenuItem>
                        }
                    )
                }
                <MenuItem value={SINE}>
                    CUSTOM: <Button
                        value={SINE}
                        onClick={openCustomSynthDialogue()}>
                            CREATE
                        </Button>
                </MenuItem>
            </Select>
        </Grid>
        <CustomSynthMenu
            customSynthOpen={ customSynthOpen }
            formValues={ currentSynth }
            setCurrentSynth={ updateCurrentSynth }
            currentKey={ currentKey }
            synthControls={ synthControls }
            synthMethodReplace={ synthMethodReplace }
            confirmCustomSynthDialogue={ confirmCustomSynthDialogue }
            closeCustomSynthDialogue={ closeCustomSynthDialogue }/>
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