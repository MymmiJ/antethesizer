import { useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import SoundElements from './sound-elements';

const SoundElementContainer = () => {
    const [Menu, setMenu] = useState(false);

    const toggleOnClick = () => {
        setMenu(prevMenu =>  prevMenu ? false : SoundElements);
    }

    return <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
        <Grid item xs={1}>
            <Button style={{ lineHeight: '100%' }} color={'primary'} onClick={ toggleOnClick }>
{`░░██╗░░
██████╗
╚═██╔═╝
░░╚═╝░░`}</Button>
        </Grid>
        <Grid item xs={12} >
            {
                Menu ? <Menu /> : ''
            }
        </Grid>
    </Grid>;
};

export default SoundElementContainer;