import { useState } from 'react';
import {Note} from 'octavian';
import {
    Button,
    Grid,
    Tooltip,
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

    const addSegment = (segmentType) => {
        setSegments(prev => {
            const segment = {...segmentType, root: 'C3', mood: RELEASE };
            const next = prev.concat({
                segment,
                uuid: uuidv4()
            });
            addNewNotes(segment.action, segment.mood, new Note(segment.root), 1);
            return next;
        })
    }

    const setSegmentField = (index, field) => (value) => {
        setSegments(prev => prev.map((seg, i) => {
            const result = seg;
            if(i === index) {
                result.segment[field] = value;
            }
            return result;
        }))
    }

    const regenerateNotes = (segmentType, i, mood = RELEASE, rootNote='C3', repeats=1) => {
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

    const toggleOnClick = (Menu) => () => {
        setMenu(prevMenu =>  prevMenu === Menu ? false : Menu);
    }

    return <Grid container spacing={1} alignContent={'flex-start'} alignItems={'flex-start'} justify={'space-between'}>
        <Grid item xs={1}>
        <Tooltip placement={ 'right' } title={ 'ADD MUSIC COMPONENT' } aria-label={ 'add music component' }>
            <Button
                style={{ lineHeight: '100%' }}
                color={'primary'}
                
                onClick={ toggleOnClick(SoundElements) }>
{`░░██╗░░
██████╗
╚═██░═╝
░░╚═╝░░`}
            </Button>
        </Tooltip>
        </Grid>
        <Tooltip placement={ 'left' } title={ 'VIEW OPTIONS' } aria-label={ 'view options' }>
            <Button style={{ lineHeight: '100%' }} color={'secondary'}>OPTIONS</Button>
        </Tooltip>
        <Grid item xs={12} >
            {
                Menu ? <Menu addSegment={ addSegment } /> : ''
            }
        </Grid>
        <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
            { segments.map((segment, i) => <Segment
                    key={ segment.uuid }
                    segmentType={ segment.segment }
                    setRootNote={ setSegmentField(i, 'root') }
                    setMood={ setSegmentField(i, 'mood') }
                    regenerateNotes={ (mood, rootNote) => regenerateNotes(segment.segment, i, mood, rootNote) }
                    removeSegment={ () => removeSegment(i) } />) }
        </Grid>
    </Grid>;
};

export default SoundElementContainer;