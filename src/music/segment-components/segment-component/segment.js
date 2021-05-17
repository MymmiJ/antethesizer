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
import LockIcon from '@material-ui/icons/Lock';
import chordStrategies, { getStrategy } from '../../segments/chords';
import { Chord } from 'octavian';
import { RELEASE, TENSION } from '../../segments/constants';
import { LockOpen } from '@material-ui/icons';

const Segment = ({
    color,
    segmentType: {
        name,
        gridSize,
        root,
        repeats,
        mood,
        chordStrategy,
        chordOptions,
        chordOptions: {
            threshold,
            maxStack,
            minStack,
            chanceFalloff
        }
    },
    removeSegment,
    regenerateNotes,
    setRootNote,
    isLocked,
    toggleLock,
    setMood,
    setRepeats,
    setChordStrategy,
    setChordThreshold,
    setChordChanceFalloff,
    setChordMaxStack,
    setChordMinStack
}) => {

    const nextRootNote = value => getStrategy(chordStrategy)({ ...chordOptions, mood })(new Chord(value));
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
                    regenerateNotes(mood, nextRootNote(value), repeats, chordStrategy, chordOptions);
                } catch (error) {
                    console.warn(`Invalid root note: ${ value }`, error)
                } finally {
                    setRootNote(value);
                }
                
             } } label={'Root Note'} placeholder={'A#1, Bb8, C3'} value={ root } />
        </Grid>
        <Grid>
            <Tooltip placement={ 'top' } title={ 'SELECT MOOD TO RESOLVE TO' } aria-label={ 'select a mood to resolve the music segment towards' }>
                <InputLabel style={{ color }} id={`mood-select-${ name }-${ mood }-${ root }`}>Mood</InputLabel>
            </Tooltip>
            <Select
                style={{ color }}
                labelId={ `mood-select-${ name }-${ mood }-${ root }` }
                id="mood-selector"
                value={ mood }
                onChange={ ({ target: { value }}) => {
                    console.log('Changing value: ', value);
                    try {
                        regenerateNotes(value, nextRootNote(root), repeats, chordStrategy, chordOptions);
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
            <TextField 
            onKeyDown={ e => { if(isLocked && !(e.key==="ArrowUp" || e.key==="ArrowDown")) { e.preventDefault(); } } }
            onChange={ ({ target: { value }}) => {
                console.log('Changing repeats: ', value);
                try {
                    if(value > 0) {
                        regenerateNotes(mood, nextRootNote(root), value, chordStrategy, chordOptions);
                    }
                } catch {
                    console.warn(`Invalid repeat value: ${ value }`)
                } finally {
                    setRepeats(value);
                }
             } } label={'Repeats'} id={`repeat-${ name }-${ repeats }`} placeholder={'1'} value={ repeats } type={ 'number' } />
        </Grid>
        <Grid item>
            <Button onClick={ toggleLock }>{ isLocked ? <LockIcon/> : <LockOpen/> }</Button>
        </Grid>
        {/* Move the below into its own component */}
        <Grid item>
            <Tooltip placement={ 'top' } title={ 'SELECT CHORD STRATEGY' } aria-label={ 'select a strategy for creating chords' }>
                <InputLabel style={{ color }} id="chord-strategy-select">Chord Strategy</InputLabel>
            </Tooltip>
            <Select
                value={chordStrategy}
                onChange={ ({ target: { value }}) => {
                    console.log('Changing chord strategy: ', value);
                    try {
                        const nextRoot = getStrategy(value)({ ...chordOptions, mood })(new Chord(root));
                        regenerateNotes(mood, nextRoot, repeats, value, chordOptions);
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
        {
        chordStrategy.startsWith('none') ? '' :
        <Grid>
            <Grid item>
                <TextField
                    type={ 'number' }
                    onChange={ ({ target: { value }}) => {
                        try {
                            if(value > 0) {
                                const nextRoot = getStrategy(chordStrategy)({ ...chordOptions, mood, threshold: value })(new Chord(root));
                                regenerateNotes(mood, nextRoot, repeats, chordStrategy, {
                                    ...chordOptions,
                                    threshold: value
                                });
                            }
                        } catch {
                            console.warn(`Invalid chord threshold chance value: ${ value }`)
                        } finally {
                            setChordThreshold(parseFloat(value));
                        }
                        } }
                    label={'Chord Chance'} id={`chord-chance-threshold-${ name }-${ threshold }`}
                    placeholder={'0.5'} value={ threshold }  />
            </Grid>
            <Grid item>
                <TextField
                    type={ 'number' }
                    onChange={ ({ target: { value }}) => {
                        try {
                            if(value > 0) {
                                regenerateNotes(mood, nextRootNote(root), repeats, chordStrategy, {
                                    ...chordOptions,
                                    chanceFalloff: value
                                });
                            }
                        } catch {
                            console.warn(`Invalid chord chance falloff value: ${ value }`)
                        } finally {
                            setChordChanceFalloff(parseFloat(value));
                        }
                        } }
                    label={'Chord Chance Falloff'} id={`chord-chance-falloff-${ name }-${ threshold }`}
                    placeholder={'0.05'} value={ chanceFalloff }  />
            </Grid>
            <Grid item>
                <TextField
                    type={ 'number' }
                    onChange={ ({ target: { value }}) => {
                        const val = parseInt(value);
                        try {
                            const nextRoot = getStrategy(chordStrategy)({ ...chordOptions, mood, maxStack: val })(new Chord(root));
                            regenerateNotes(mood, nextRoot, repeats, chordStrategy, {
                                ...chordOptions,
                                maxStack: value
                            });
                        } catch {
                            console.warn(`Invalid max stack value: ${ value }`)
                        } finally {
                            setChordMaxStack(value);
                            if(val < minStack) {
                                setChordMinStack(value);
                            }
                        }
                        } }
                    label={'Max Chord Stack'} id={`chord-max-stack-${ name }-${ maxStack }`}
                    placeholder={'3'} value={ maxStack }  />
            </Grid>
            <Grid item>
                <TextField
                    type={ 'number' }
                    onChange={ ({ target: { value }}) => {
                        const val = parseInt(value);
                        try {
                            const nextRoot = getStrategy(chordStrategy)({ ...chordOptions, mood, minStack: value })(new Chord(root));
                            regenerateNotes(mood, nextRoot, repeats, chordStrategy, {
                                ...chordOptions,
                                minStack: value
                            });
                        } catch {
                            console.warn(`Invalid min stack value: ${ value }`)
                        } finally {
                            setChordMinStack(value);
                            if(val > maxStack) {
                                setChordMaxStack(value);
                            }
                        }
                        } }
                    label={'Min Chord Stack'} id={`chord-min-stack-${ name }-${ minStack }`}
                    placeholder={'0'} value={ minStack }  />
            </Grid>
        </Grid>
        }
        <Grid item>
            <Button style={{ color }} onClick={ removeSegment }>REMOVE {name}</Button>
        </Grid>
    </Grid>;
}

export default Segment;