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
const CustomSynthMenu = ({customSynthOpen, closeCustomSynthDialogue}) => 
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

export default CustomSynthMenu;