import { useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import SoundElements, { Segment, SEGMENTS } from './sound-elements';

const SoundElementContainer = () => {
    const [Menu, setMenu] = useState(false);
    const [UIElements, setUIElements] = useState([]);

    const addUIElement = (segmentType) => {
        setUIElements(prev => prev.concat(segmentType));
    }

    const removeUIElement = (i) => {
        setUIElements(prev => prev.filter((_, index) => index !== i));
    }

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
                Menu ? <Menu addUIElement={ addUIElement } /> : ''
            }
        </Grid>
        <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
            {
                UIElements.map((UIElement, i) => {
                    return <Segment
                        key={ i }
                        segmentType={ UIElement }
                        removeUIElement={ () => removeUIElement(i) } />;
                })
            }
        </Grid>
    </Grid>;
};

export default SoundElementContainer;