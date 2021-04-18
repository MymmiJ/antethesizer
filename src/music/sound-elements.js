import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import { Note } from 'octavian';
import { useState } from 'react';
import {
    repeatNotes,
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    diatom,
    RELEASE
} from './segments';

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
        subsection: 'DIATOM', // TODO: Better name for this!
        defaultSubsections: 2,
        gridSize: 10
    },
    DIATOM: {
        name: 'NOTE CHANGE',
        action: diatom,
        subsection: null,
        defaultSubsections: 2,
        gridSize: 10
    }
}
// Config

// Move these into their own component files
const Segment = ({segmentType: { name, gridSize }, removeSegment, regenerateNotes }) => {
    const [root, setRoot] = useState('A#4');
    console.log(root);
    return <Grid
        container
        spacing={ 3 }
        item xs={ gridSize }
        alignContent={'center'}
        alignItems={'baseline'}
        justify={'center'}>
        <Grid item>
            <Typography variant="h5">{name}</Typography>
        </Grid>
        <Grid item>
            <TextField onChange={ ({ target: { value }}) => {
                console.log('Changing value: ', value);
                try {
                    const rootNote = new Note(value);
                    regenerateNotes(RELEASE, rootNote);
                } catch {
                    console.warn(`Invalid root note: ${ value }`)
                }
                setRoot(value);
                
             } } label={'Root Note'} id={`root-note-${ name }-${ root }`} placeholder={'A#4'} value={ root } />
        </Grid>
        <Grid item>
            <Button onClick={ removeSegment }>REMOVE {name}</Button>
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
                onClick={ () => addSegment(SEGMENTS.DIATOM) }
            >
                Note Change
                ♬
            </Button>
        </Grid>
    </Grid>
}

export { Segment, SEGMENTS };

export default SoundElements;