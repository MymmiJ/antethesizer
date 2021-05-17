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
import SegmentMenu, { Segment } from './segment-component/index.js';
import { v4 as uuidv4 } from 'uuid'; 
import { repeatNotes } from '../segments';
import { RELEASE } from '../segments/constants';
import OptionMenu from '../options';
import { defaultChordOptions } from '../segments/chords.js';

const generateNotes = (f, mood, rootNote, repeats, chordStrategy, chordOptions) => {
    const notes = f(rootNote, mood, chordStrategy, chordOptions);
    return repeatNotes(notes, repeats);
}

const filterIndex = i => prev => prev.filter((_, index) => index !== i);

const SegmentContainer = ({
    setNotes,
    synth,
    setSynth,
    customSynths,
    synthControls,
    defaultMood,
    setDefaultMood,
    defaultRootNote,
    setDefaultRootNote,
    locked,
    toggleLock,
    addNewSoundControls,
    globalOptions,
    setGlobalOption,
    useGlobalBPM,
    useGlobalTimekeeping,
    localOptions,
    setLocalOption,
    setDeFactoOption,
    setDeFactoOptions
}) => {
    const [Menu, setMenu] = useState(false);
    const [segments, setSegments] = useState([]);
    const addNewNotes = (f, mood, rootNote, repeats, chordStrategy,chordOptions=defaultChordOptions) => {
        const notes = generateNotes(f, mood, rootNote, repeats, chordStrategy, chordOptions);
        setNotes(prev => prev.concat([notes]));
    }

    const addSegment = (segmentType) => {
        setSegments(prev => {
            const segment = {...segmentType, root: defaultRootNote, repeats: 1, mood: defaultMood,
                chordStrategy: 'none,default', chordOptions: defaultChordOptions };
            const next = prev.concat({
                segment,
                uuid: uuidv4()
            });
            addNewNotes(
                segment.action,
                segment.mood,
                new Chord(segment.root),
                segment.repeats,
                segment.chordStrategy,    
                segment.chordOptions
            );
            return next;
        })
    }

    const regenerateNotes = (
            segmentType,
            i,
            mood = RELEASE,
            rootNote='C3',
            repeats=1,
            chordStrategy='none,default',
            chordOptions=defaultChordOptions
        ) => {
        const nextNotes = generateNotes(
            segmentType.action,
            mood,
            rootNote,
            repeats,
            chordStrategy,
            chordOptions
        );
        setNotes(prev => {
            const next = [...prev];
            next[i] = nextNotes;
            return next;
        });
    }

    const setSegmentField = (index, field) => (value) => {
        setSegments(prev => prev.map((seg, i) => {
            const result = seg;
            if(i === index) {
                result.segment[field] = value;
            }
            return result;
        }));
    }
    const setChordOption = (index, field) => (value) => {
        setSegments(prev => prev.map((seg, i) => {
            const result = seg;
            if(i === index) {
                result.segment.chordOptions[field] = value;
            }
            return result;
        }));
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
                onClick={ toggleOnClick(SegmentMenu) }>
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
                customSynths={ customSynths }
                synthControls={ synthControls }
                defaultMood={ defaultMood }
                setDefaultMood={ setDefaultMood }
                defaultRootNote={ defaultRootNote }
                setDefaultRootNote={ setDefaultRootNote}
                globalOptions={ globalOptions }
                setGlobalOption={ setGlobalOption }
                useGlobalBPM={ useGlobalBPM }
                useGlobalTimekeeping={ useGlobalTimekeeping }
                localOptions={ localOptions }
                setLocalOption={ setLocalOption }
                setOpt={ setDeFactoOption }
                setOpts={ setDeFactoOptions }/> : ''
            }
        </Grid>
        <Accordion style={{ width: '100%' }} defaultExpanded>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="track-details"
            id="track-details-header">
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
                        toggleLock={ toggleLock(i) }
                        setMood={ setSegmentField(i, 'mood') }
                        setRepeats={ setSegmentField(i, 'repeats') }
                        setChordStrategy={ setSegmentField(i, 'chordStrategy') }
                        setChordThreshold={ setChordOption(i, 'threshold') }
                        setChordMaxStack={ setChordOption(i, 'maxStack') }
                        setChordMinStack={ setChordOption(i, 'minStack') }
                        setChordChanceFalloff={ setChordOption(i, 'chanceFalloff') }
                        regenerateNotes={
                            locked[i]
                                ? () => console.log('Avoiding note generation')
                                : (mood, rootNote, repeats, chordStrategy, chordOptions) =>
                            regenerateNotes(segment.segment, i, mood, rootNote, repeats, chordStrategy, chordOptions)
                        }
                        removeSegment={ () => removeSegment(i) } />;
                }) :
                ''
            }
        </Grid>
        </AccordionDetails>
        </Accordion>
    </Grid>;
};

export default SegmentContainer;