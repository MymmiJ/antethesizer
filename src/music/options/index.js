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

const OptionMenu = ({
    synth,
    setSynth
}) => {
    return <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
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
    </Grid>;
};

export default OptionMenu;