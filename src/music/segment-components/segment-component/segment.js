import {
    Grid,
    Button,
    Tooltip,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Typography
} from '@material-ui/core';
import { Chord } from 'octavian';
import { RELEASE, TENSION } from '../../segments/constants';

const Segment = ({
    color,
    segmentType: { name, gridSize, root, repeats, mood },
    removeSegment,
    regenerateNotes,
    setRootNote,
    setMood,
    setRepeats
}) => {
    return <Grid
        container
        spacing={ 3 }
        item xs={ gridSize }
        alignContent={'flex-start'}
        alignItems={'baseline'}
        justify={'flex-start'}>
        <Grid item>
            <Typography style={{ color }} variant="h5">{name}</Typography>
        </Grid>
        <Grid item>
            <TextField onChange={ ({ target: { value }}) => {
                try {
                    const rootNote = new Chord(value);
                    regenerateNotes(mood, rootNote, repeats);
                } catch {
                    console.warn(`Invalid root note: ${ value }`)
                } finally {
                    setRootNote(value);
                }
                
             } } label={'Root Note'} placeholder={'A#1, Bb8, C3'} value={ root } />
        </Grid>
        <Grid>
            <Tooltip placement={ 'top' } title={ 'SELECT MOOD TO RESOLVE TO' } aria-label={ 'select a mood to resolve the music segment towards' }>
                <InputLabel style={{ color }} id="mood-select">Mood</InputLabel>
            </Tooltip>
            <Select
                style={{ color }}
                labelId="mood-select"
                id="mood-selector"
                value={ mood }
                onChange={ ({ target: { value }}) => {
                    console.log('Changing value: ', value);
                    try {
                        regenerateNotes(value, new Chord(root), repeats);
                        setMood(value);
                    } catch {
                        console.warn(`Invalid mood: ${ value }`)
                    }
                 } }
            >
                <MenuItem value={TENSION}>TENSION</MenuItem>
                <MenuItem value={RELEASE}>RELEASE</MenuItem>
            </Select>
        </Grid>
        <Grid item>
            <TextField onChange={ ({ target: { value }}) => {
                console.log('Changing repeats: ', value);
                try {
                    if(value > 0) {
                        regenerateNotes(mood, new Chord(root), value);
                    }
                } catch {
                    console.warn(`Invalid repeat value: ${ value }`)
                } finally {
                    setRepeats(value);
                }
             } } label={'Repeats'} id={`repeat-${ name }-${ repeats }`} placeholder={'1'} value={ repeats } type={ 'number' } />
        </Grid>

        <Grid item>
            <Button style={{ color }} onClick={ removeSegment }>REMOVE {name}</Button>
        </Grid>
    </Grid>;
}

export default Segment;