import { useState } from 'react';
import {Note} from 'octavian';
import {
    Button,
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import SoundElements, { Segment, SEGMENTS } from './sound-elements';
import { v4 as uuidv4 } from 'uuid'; 
import {
    RELEASE,
    repeatNotes,
} from './segments';

const generateNotes = (f, mood, rootNote, repeats) => {
    const notes = f(rootNote, mood);

    return repeatNotes(notes, repeats);
}

const filterIndex = i => prev => prev.filter((_, index) => index !== i);

const SoundElementContainer = ({ setNotes }) => {
    const [Menu, setMenu] = useState(false);
    const [segments, setSegments] = useState([]);

    const addNewNotes = (f, mood, rootNote, repeats) => {
        const notes = generateNotes(f, mood, rootNote, repeats);
        setNotes(prev => prev.concat([notes]));
    }

    const clearNotes = () => setNotes([]);

    const addSegment = (segmentType) => {
        setSegments(prev => {
            const next = prev.concat({ segment: segmentType, uuid: uuidv4() });
            addNewNotes(segmentType.action, RELEASE, new Note('A#4'), 1);
            return next;
        })
    }

    const regenerateNotes = (segmentType, i, mood = RELEASE, rootNote='A#4', repeats=1) => {
        setNotes(prev => {
            const next = [...prev];
            next[i] = generateNotes(segmentType.action, mood, rootNote, repeats);
            return next;
        });
    }
    const removeSegment = (i) => {
        setSegments(filterIndex(i));
        setNotes(filterIndex(i));
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
                Menu ? <Menu addSegment={ addSegment } /> : ''
            }
        </Grid>
        <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
            { segments.map((segment, i) => <Segment
                    key={ segment.uuid }
                    segmentType={ segment.segment }
                    regenerateNotes={ (mood, rootNote) => regenerateNotes(segment.segment, i, mood, rootNote) }
                    removeSegment={ () => removeSegment(i) } />) }
        </Grid>
    </Grid>;
};

export default SoundElementContainer;