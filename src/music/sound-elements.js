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
        name: 'Piece',
        action: piece,
        subsection: 'SECTION',
        defaultSubsections: 2,
        gridSize: 12
    },
    SECTION: {
        name: 'Section',
        action: section,
        subsection: 'PASSAGE',
        defaultSubsections: 2,
        gridSize: 12
    },
    PASSAGE: {
        name: 'Passage',
        action: passage,
        subsection: 'LONG_PHRASE',
        defaultSubsections: 4,
        gridSize: 12
    },
    LONG_PHRASE: {
        name: 'Long Phrase',
        action: longPhrase,
        subsection: 'SHORT_PHRASE',
        defaultSubsections: 2,
        gridSize: 12
    },
    SHORT_PHRASE: {
        name: 'Short Phrase',
        action: shortPhrase,
        subsection: 'DIATOM', // TODO: Better name for this!
        defaultSubsections: 2,
        gridSize: 12
    },
    DIATOM: {
        name: 'Note Change',
        action: diatom,
        subsection: null,
        defaultSubsections: 2,
        gridSize: 12
    }
}
// Config

// Move these into their own component files
const Segment = ({segmentType}) => {
    return <Typography>{segmentType.name}:</Typography>
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
            >
                Section
                ♬♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Passage
                ♬♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Long Phrase
                ♬♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Short Phrase
                ♬♬
            </Button>
        </Grid>
        <Grid item>
            <Button
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