import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';

const SoundElements = () => {

    return <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item>
            <Button
                id={'piece'}
            >
                Piece
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Section
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Passage
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Long Phrase
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Short Phrase
            </Button>
        </Grid>
        <Grid item>
            <Button
            >
                Note Change
            </Button>
        </Grid>
        <Grid item>
            <TextField label={'Root Note'} id={'root-note'} placeholder={'A#4'} />
        </Grid>
    </Grid>
}

export default SoundElements;