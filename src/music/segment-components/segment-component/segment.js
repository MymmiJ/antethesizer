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
import chordStrategies from '../../segments/chords';
import { Chord } from 'octavian';
import { RELEASE, TENSION } from '../../segments/constants';

const Segment = ({
    color,
    segmentType: { name, gridSize, root, repeats, mood, chordStrategy },
    removeSegment,
    regenerateNotes,
    setRootNote,
    setMood,
    setRepeats,
    setChordStrategy
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
                    regenerateNotes(mood, rootNote, repeats, chordStrategy);
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
                        regenerateNotes(value, new Chord(root), repeats, chordStrategy);
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
                        regenerateNotes(mood, new Chord(root), value, chordStrategy);
                    }
                } catch {
                    console.warn(`Invalid repeat value: ${ value }`)
                } finally {
                    setRepeats(value);
                }
             } } label={'Repeats'} id={`repeat-${ name }-${ repeats }`} placeholder={'1'} value={ repeats } type={ 'number' } />
        </Grid>
        <Grid item>
            <Tooltip placement={ 'top' } title={ 'SELECT CHORD STRATEGY' } aria-label={ 'select a strategy for creating chords' }>
                <InputLabel style={{ color }} id="chord-strategy-select">Chord Strategy</InputLabel>
            </Tooltip>
            <Select
                value={chordStrategy}
                onChange={ ({ target: { value }}) => {
                    console.log('Changing chord strategy: ', value);
                    try {
                        regenerateNotes(mood, new Chord(root), repeats, value);
                    } catch {
                        console.warn(`Invalid chord strategy value: ${ value }`)
                    } finally {
                        setChordStrategy(value);
                    }
                 }  }
                style={{ color }}
                labelId="chord-strategy-select"
                id="chord-strategy-selector">
                {
                    Object.entries(chordStrategies).map(
                        ([chordStrategyGroupName, chordStrategyGroup])  => 
                            Object.keys(chordStrategyGroup).map(
                                chordStrategyName => {
                                    return <MenuItem value={`${chordStrategyGroupName},${chordStrategyName}`}>
                                        <small>{ `${ chordStrategyGroupName.toUpperCase() }:` }&nbsp;</small>
                                        { chordStrategyName.toUpperCase() }
                                    </MenuItem>
                                    
                                }
                            ))
                }
            </Select>
        </Grid>
        <Grid item>
            <Button style={{ color }} onClick={ removeSegment }>REMOVE {name}</Button>
        </Grid>
    </Grid>;
}

export default Segment;