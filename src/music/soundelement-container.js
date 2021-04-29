import { useState } from 'react';
import { Chord } from 'octavian';
import {
    Button,
    Grid,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SoundElements, { Segment, SEGMENTS } from './sound-elements';
import { v4 as uuidv4 } from 'uuid'; 
import { repeatNotes } from './segments';
import { RELEASE } from './segments/constants';
import OptionMenu from './options';

const generateNotes = (f, mood, rootNote, repeats) => {
    const notes = f(rootNote, mood);

    return repeatNotes(notes, repeats);
}

const filterIndex = i => prev => prev.filter((_, index) => index !== i);

const SoundElementContainer = ({
    setNotes,
    synth,
    setSynth,
    defaultMood,
    setDefaultMood,
    defaultRootNote,
    setDefaultRootNote,
    addNewSoundControls,
    globalOptions,
    setGlobalOption,
    localOptions,
    setLocalOption,
    setDeFactoOption
}) => {
    const [Menu, setMenu] = useState(false);
    const [segments, setSegments] = useState([]);

    const addNewNotes = (f, mood, rootNote, repeats) => {
        const notes = generateNotes(f, mood, rootNote, repeats);
        setNotes(prev => prev.concat([notes]));
    }

    const addSegment = (segmentType) => {
        setSegments(prev => {
            const segment = {...segmentType, root: defaultRootNote, repeats: 1, mood: defaultMood };
            const next = prev.concat({
                segment,
                uuid: uuidv4()
            });
            addNewNotes(segment.action, segment.mood, new Chord(segment.root), segment.repeats);
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

    return <Grid container spacing={1} alignContent={'flex-start'} alignItems={'flex-start'} justify={'space-evenly'}>
        <Grid item xs={1}>
        <Tooltip placement={ 'bottom' } title={ 'ADD TRACK COMPONENT' } aria-label={ 'add track component' }>
            <Button
                id={'add-component'}
                style={{ lineHeight: '100%' }}
                color={'primary'}
                variant={'outlined'}
                onClick={ toggleOnClick(SoundElements) }>
            <label htmlFor={'add-component'}>ADD TO TRACK</label>
{`░░██╗░░\n
██████╗\n
╚═██░═╝\n
░░╚═╝░░`}
            </Button>
        </Tooltip>
        </Grid>
        <Grid item xs={1}>
        <Tooltip placement={ 'bottom' } title={ 'ADD NEW TRACK' } aria-label={ 'add new track' }>
            <Button
                style={{ lineHeight: '100%' }}
                color={'secondary'}
                variant={'outlined'}
                onClick={ addNewSoundControls }>
            <label htmlFor={'add-component'}>ADD NEW TRACK</label>
{`░░██╗░░\n
██████╗\n
╚═██░═╝\n
░░╚═╝░░`}
            </Button>
        </Tooltip>
        </Grid>
        <Tooltip placement={ 'left' } title={ 'VIEW OPTIONS' } aria-label={ 'view options' }>
            <Button
            style={{ lineHeight: '100%', height: '4em' }}
            color={'secondary'}
            variant={'outlined'}
            onClick={ toggleOnClick(OptionMenu) }>OPTIONS</Button>
        </Tooltip>
        <Grid item xs={12} >
            {
                Menu ? <Menu
                addSegment={ addSegment }
                synth={ synth }
                setSynth={ setSynth }
                defaultMood={ defaultMood }
                setDefaultMood={ setDefaultMood }
                defaultRootNote={ defaultRootNote }
                setDefaultRootNote={ setDefaultRootNote}
                globalOptions={ globalOptions }
                setGlobalOption={ setGlobalOption }
                localOptions={ localOptions }
                setLocalOption={ setLocalOption }
                setOpt={ setDeFactoOption }/> : ''
            }
        </Grid>
        <Accordion style={{ width: '100%' }} defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header">
            <Typography>Track Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid container spacing={1} alignContent={'center'} alignItems={'center'} justify={'center'}>
            { segments.length > 0 ?
                segments.map((segment, i) => {
                    let color;
                    switch(i % 3) {
                        case 0:
                            color = '#EFA2A2';
                            break;
                        case 1:
                            color = '#C6C6EF';
                            break;
                        case 2:
                        default:
                            color = '#C6EFC6';
                            break;
                    }
                    return <Segment
                        key={ segment.uuid }
                        color={ color }
                        segmentType={ segment.segment }
                        setRootNote={ setSegmentField(i, 'root') }
                        setMood={ setSegmentField(i, 'mood') }
                        setRepeats={ setSegmentField(i, 'repeats') }
                        regenerateNotes={ (mood, rootNote, repeats = 1) => regenerateNotes(segment.segment, i, mood, rootNote, repeats) }
                        removeSegment={ () => removeSegment(i) } />;
                }) :
                ''
            }
        </Grid>
        </AccordionDetails>
        </Accordion>
    </Grid>;
};

export default SoundElementContainer;