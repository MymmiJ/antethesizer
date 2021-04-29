import React, { useState } from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { playNotes, SoundControls } from './music';
import { v4 as uuidv4 } from 'uuid'; 
import Option from './music/options/global';
import { TextField } from '@material-ui/core';

const dark_theme = createMuiTheme({
  typography: {
    fontFamily: 'Monospace',
    lineHeight: '100%'
  },
  palette: {
    type: "dark",
    primary: {
      main: '#EF4646',
    },
    secondary: {
      main: '#A2A2EF',
    },
    background: {
      default: "#303030"
    },
  },
});

const light_theme = createMuiTheme({
  typography: {
    fontFamily: 'Monospace',
    lineHeight: '100%'
  },
  palette: {
    type: "light",
    primary: {
      main: '#EF1010',
    },
    secondary: {
      main: '#4646EF',
    },
    background: {
      default: "#DFDFDF"
    },
  },
});

/**
 * TODO:
 * ! - Essential before beta release
 * * - Large or surprisingly large task
 * 1 - Highest priority per section
 * # - in progress
 * UI:
 * - accessibility review (aria+contrast-focused)! 1
 * - Display sound as per https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
 * - Explore 'new track' button to _below_ each track, to give more contextual clues for use
 * - Make light theme look better (Note, passage colors)
 * - Light/dark theme toggle
 * - 'Regenerate all' button to force all notes to regenerate in a track
 * Options Menu:
 * - Custom synths via. wavetable 1
 * - Import/export wavetables as JSON
 * - Display wavetable - try: https://github.com/indutny/fft.js/
 * - Use display to input back into wavetable
 * - Overall direction (determine root note by increasing/decreasing from source)
 *    - just generally keep track of things rather than trying to do things hierarchically!
 * - Allow/add multiple generators per pattern
 * - Allow composing synths together
 * - Allow specifying chord bias
 * Sections:
 * - Allow specifying the mood of subsections*
 * - Allow inserting specfic runs of notes
 * - Allow option to end on a root note (either added or replacing the final note)
 * - Turn bias for picking next shift off
 * - Allow selecting 'EITHER' option
 * - Allow locking of note runs in place 1
 *     preventing regeneration & changing mood/root note, retaining ability to e.g. repeat notes
 *     Essential for allowing insertion of specific runs
 * - Allow starting section after delay of x notes
 * - Allow sections to be played backwards
 * Ornaments:
 *  - Arpeggios 1
 *  - Acciaccatura/trills etc.
 *  - Microtonal shifts
 *  - (more) vibrato/tremolo
 *  - Allow 'skipped' notes
 * Rhythm:
 *  - time signature
 *  - accents
 *  - change individual note lengths (use American quarter note system) 1
 *  - allow use of hemisemidemiquaver system
 *  - syncopation
 * - Update global 
 * Dynamics:
 *  - vary dynamics based on mood
 * - vary dynamics based on time signature
 * Motifs:
 *  - Enable inserting motifs to be repeated, consisting of smaller sections with interval changes & chords specified
 * Generation:
 *  - Improve generation by using pickBiasLate to descend slowly 1
 *  - Improve generation by remembering _first_ root Note of series
 *    (e.g. for Passage, remember real rootNote into the children and use to modify generation)
 *  - Improve generation by picking different sets of movements that can move to each other
 *  - Improve generation by allowing 'motion towards' particular notes
 *  - Improve generation by generating in batches of 2 with option for truncated gen (i.e. short phrase returns 4, long phrase returns 8).
 *  - Improve generation by allowing different composable(?) 'patterns', e.g. mode, up-and-down
 * Code:
 * - Refactor to generate sound controls from just one array
 * 
 */
const defaultGlobalOptions = {
  bpm: 120
}

const App = () => {
  const [additionalSoundControls, setSoundControls] = useState([]);
  const [globalOptions, setGlobalOptions] = useState(defaultGlobalOptions);
  const setGlobalOption = (key) => ({ target: { value } }) => {
    setGlobalOptions(prev => Object.assign(
    {...prev},
    { [key]: value }
  ));
  }

  const addNewSoundControls = () => setSoundControls(prev => [...prev, {
    key: uuidv4(),
    primary: false,
    notes: [],
    context: null,
    synth: null,
    ...defaultGlobalOptions,
    addNewSoundControls
  }]);
  const addToAdditionalNotes = (key) => ({ value, context, synth, bpm }) => {
    setSoundControls(prev => prev.map(
      soundControls => soundControls.key !== key ?
        soundControls :
        Object.assign(
          { ...soundControls },
          {
            notes: value(soundControls.notes),
            context,
            synth,
            bpm
          }
        )
    ))
  }

  const playAdditionalNotes = () => {
    console.log('playing additional:', additionalSoundControls)
    additionalSoundControls.forEach(
      ({ notes, context, synth, bpm }, _, __) => {
        if(notes && context && synth){
          playNotes(notes.flat(), context, synth, bpm);
        }
      }
    );
  }
  const removeSelf = (id) => setSoundControls(prev => prev.filter(desc => desc.key !== id ));
  return (
    <ThemeProvider theme={dark_theme}>
      <CssBaseline/>
      <SoundControls
        key='alpha-and-omega'
        addNewSoundControls={ addNewSoundControls }
        primary={ true }
        addToAdditionalNotes={ () => {} }
        playAdditionalNotes={ playAdditionalNotes }
        setGlobalOption={ setGlobalOption }
        globalOptions={ globalOptions }
         />
      {
        additionalSoundControls.length > 0 &&
          additionalSoundControls.map(
            desc =>
              <SoundControls
                key={ desc.key }
                addNewSoundControls={ desc.addNewSoundControls }
                addToAdditionalNotes={ addToAdditionalNotes(desc.key) }
                primary={ desc.primary }
                setGlobalOption={ setGlobalOption }
                globalOptions={ globalOptions }
                removeSelf={ () => removeSelf(desc.key) } />
          )
      }
    </ThemeProvider>
  );
}

export default App;
