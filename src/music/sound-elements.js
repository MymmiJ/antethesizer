import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import {
    repeatNotes,
    piece,
    section,
    passage,
    longPhrase,
    shortPhrase,
    diatom
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
const Segment = ({segmentType: { name, gridSize }, removeUIElement }) => {
    return <Grid item xs={ gridSize }>
        <Typography>{name}:</Typography>
        <Button onClick={ removeUIElement }>REMOVE {name}</Button>
    </Grid>;
}
// Small components

const SoundElements = ({addUIElement}) => {
    return <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item>
            <Button
                id={'piece'}
                onClick={ () => addUIElement(SEGMENTS.PIECE) }
            >
                Piece
                ♬♬♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'section'}
                onClick={ () => addUIElement(SEGMENTS.SECTION) }
            >
                Section
                ♬♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'passage'}
                onClick={ () => addUIElement(SEGMENTS.PASSAGE) }
            >
                Passage
                ♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'long_phrase'}
                onClick={ () => addUIElement(SEGMENTS.LONG_PHRASE) }
            >
                Long Phrase
                ♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'short_phrase'}
                onClick={ () => addUIElement(SEGMENTS.SHORT_PHRASE) }
            >
                Short Phrase
                ♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
                id={'note_change'}
                onClick={ () => addUIElement(SEGMENTS.DIATOM) }
            >
                Note Change
                ♬
            </Button>
        </Grid>
        <Grid item>
            <TextField label={'Root Note'} id={'root-note'} placeholder={'A#4'} />
        </Grid>
    </Grid>
}

export { Segment, SEGMENTS };

export default SoundElements;