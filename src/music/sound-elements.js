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
import { Chord } from 'octavian';
import {
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    noteChange
} from './segments';
import { RELEASE, TENSION } from './segments/constants';

// Move this into a config file
const SEGMENTS = {
    PIECE: {
        name: 'PIECE',
        action: piece,
        subsection: 'SECTION',
        defaultSubsections: 2,
        gridSize: 10
    },
    SECTION: {
        name: 'SECTION',
        action: section,
        subsection: 'PASSAGE',
        defaultSubsections: 2,
        gridSize: 10
    },
    PASSAGE: {
        name: 'PASSAGE',
        action: passage,
        subsection: 'LONG_PHRASE',
        defaultSubsections: 4,
        gridSize: 10
    },
    LONG_PHRASE: {
        name: 'LONG PHRASE',
        action: longPhrase,
        subsection: 'SHORT_PHRASE',
        defaultSubsections: 2,
        gridSize: 10
    },
    SHORT_PHRASE: {
        name: 'SHORT PHRASE',
        action: shortPhrase,
        subsection: 'NOTE_CHANGE',
        defaultSubsections: 2,
        gridSize: 10
    },
    NOTE_CHANGE: {
        name: 'NOTE CHANGE',
        action: noteChange,
        subsection: null,
        defaultSubsections: 2,
        gridSize: 10
    }
}
// Config

// Move these into their own component files
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
// Small components

const SoundElements = ({addSegment}) => {
    return <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item>
            <Button
                id={'piece'}
                onClick={ () => addSegment(SEGMENTS.PIECE) }
            >
                Piece
                ♬♬♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'section'}
                onClick={ () => addSegment(SEGMENTS.SECTION) }
            >
                Section
                ♬♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'passage'}
                onClick={ () => addSegment(SEGMENTS.PASSAGE) }
            >
                Passage
                ♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'long_phrase'}
                onClick={ () => addSegment(SEGMENTS.LONG_PHRASE) }
            >
                Long Phrase
                ♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'short_phrase'}
                onClick={ () => addSegment(SEGMENTS.SHORT_PHRASE) }
            >
                Short Phrase
                ♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'note_change'}
                onClick={ () => addSegment(SEGMENTS.NOTE_CHANGE) }
            >
                Note Change
                ♬
            </Button>
        </Grid>
    </Grid>
}

export { Segment, SEGMENTS };

export default SoundElements;