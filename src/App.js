import React, { useState } from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { playNotes, SoundControls } from './music';
import Oscilloscope from './visualize/oscilloscope';
import { v4 as uuidv4 } from 'uuid';
import { ACCURATE } from './music/segments/constants';

const sharedOverrides = {
  MuiButton: {
    root: {
      borderRadius: 2,
    }, 
  }, 
}

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
  overrides: sharedOverrides,
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
  overrides: sharedOverrides,
});

/**
 * TODO:
 * ! - Essential before beta release
 * * - Large or surprisingly large task
 * 1 - Highest priority per section
 * # - in progress
 * UI:
 * - accessibility review (aria+contrast-focused)! 1
 * - Make light theme look better (Note, passage colors)
 * - Light/dark theme toggle
 * - 'Regenerate all' button to force all notes to regenerate
 * - Add help system to assist with all parts of the app
 *   - https://github.com/elrumordelaluz/reactour
 * Options Menu:
 * - Overall direction (determine root note by increasing/decreasing from source)
 *    - just generally keep track of lower down things from higher up rather than trying to do things strictly hierarchically!
 * - Allow/add multiple generators per pattern
 * Synths:
 * - Make attack/decay/sustain/release more formalized (i.e. specify sustain!) (& ensure that the values _are able to_ scale to the length of time)!
 * - Import/export wavetables as JSON 1
 * - Import wavetables as mathematical formulae* - can't be free text entry to be eval'ed!
 * - Allow converting from ifft form to wavetable*
 * - Use display to input back into wavetable*
 * - Allow composing synths together
 * - Allow distortion in synths
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
 * - Arpeggios
 * - Acciaccatura/trills etc.
 * - Microtonal shifts
 * - (more) vibrato/tremolo
 * - Allow 'skipped' notes
 * Rhythm:
 * - drop in replacement for 'setTimeout' with greater accuracy https://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout
 * - time signature
 * - accents
 * - change individual note lengths (use American quarter note system) 1
 *   - to be able to do this, must also be able to adjust number of notes in a given phrase
 * - allow use of hemisemidemiquaver system
 * - syncopation
 * Dynamics:
 * - vary dynamics based on mood 1
 * - vary dynamics based on time signature
 * Motifs:
 *  - Enable inserting motifs to be repeated, consisting of smaller sections with interval changes & chords specified
 * Generation:
 *  - Improve generation by using pickBiasLate to descend slowly
 *  - Ensure that generation is always valid by checking octave against octavian 1
 *  - Allow user to force ending the passage on the root note
 *  - Improve generation by remembering _first_ root Note of series
 *    (e.g. for Passage, remember real rootNote into the children and use to modify generation)
 *  - Improve generation by picking different sets of movements that can move to each other
 *  - Improve generation by allowing 'motion towards' particular notes
 *  - Improve generation by generating in batches of 2 with option for truncated gen (i.e. short phrase returns 4, long phrase returns 8).
 *  - Improve generation by allowing different composable(?) 'patterns', e.g. mode, up-and-down
 * Visualization:
 * - Add more options to viz, (flame, bar?) using https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode as guide
 * - Color picker 1
 * - Manually handle scale
 * Reverse Engineering:
 * - POST-BETA FEATURE
 * - on pasting notes, locks the segment index and reverse engineers the tension/release patterns
 * Code:
 * - Refactor: global and local state, remove unnecessary local state in segments wherever possible
 *  - use Context to sharee state; if overly complex, see if a lighter alternative to Redux will do
 * - Performance: identify odd 'CPU leak' issue where playing multiple times seems to permanently increase cpu requirements
 * 
 */

/**
 * Move to own config file
 */
const defaultGlobalOptions = {
  bpm: 120,
  useGlobalBPM: true,
  timekeeping: ACCURATE,
  useGlobalTimekeeping: true
}
// Config ends

const App = () => {
  const [context,] = useState(new AudioContext());
  const [oscillators, setOscillators] = useState([]);
  const [customSynths, setCustomSynths] = useState([]);
  const [soundControls, setSoundControls] = useState([{
    key: uuidv4(),
    primary: true,
    notes: [],
    context: null,
    synth: null,
    ...defaultGlobalOptions
  }]);
  const [globalOptions, setGlobalOptions] = useState(defaultGlobalOptions);
  const synthControls = {
    addCustomSynth: () => synth => setCustomSynths(prev => [...prev, synth]),
    removeCustomSynth: key => () => setCustomSynths(prev => prev.filter((_, aKey) => aKey !== key)),
    replaceCustomSynth: key => synth => setCustomSynths(prev => prev.map((curr, i) => {
      if(i === key) {
        return synth;
      }
      return curr;
    })),
  }

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
    ...defaultGlobalOptions
  }]);
  const addToAdditionalNotes = (key) => ({
    value,
    context,
    synth,
    bpm,
    useGlobalBPM,
    timekeeping,
    useGlobalTimekeeping
  }) => {
    setSoundControls(prev => prev.map(
      soundControls => soundControls.key !== key ?
        // Handle all other sound controls
        soundControls.useGlobalBPM && useGlobalBPM ? 
          { ...soundControls, bpm } :
        soundControls.useGlobalTimekeeping && useGlobalTimekeeping ?
          { ...soundControls, timekeeping } :
          soundControls :
        // Handlle sound control being updated
        Object.assign(
          { ...soundControls },
          {
            notes: value(soundControls.notes),
            context,
            synth,
            bpm,
            useGlobalBPM,
            timekeeping,
            useGlobalTimekeeping
          }
        )
    ))
  }
  const replaceOscillator = oscillator => {
    setOscillators(prev => [...prev, oscillator]);
  }
  const clearOscillators = () => setOscillators([]);
  const playAdditionalNotes = () => {
    clearOscillators();
    console.log('playing additional:', soundControls)
    soundControls.forEach(
      ({ notes, context, synth, bpm, timekeeping }, _, __) => {
        if(notes && context && synth){
          playNotes(notes.flat(), context, synth, {
            bpm, timekeeping
          }, replaceOscillator);
        }
      }
    );
  }
  const removeSelf = (id) => setSoundControls(prev => prev.filter(desc => desc.key !== id ));
  return (
    <ThemeProvider theme={dark_theme}>
      <CssBaseline/>
      {
        soundControls.map(
          desc =>
            <SoundControls
              key={ desc.key }
              context={ context }
              customSynths={ customSynths }
              synthControls={ synthControls }
              addNewSoundControls={ addNewSoundControls }
              clearOscillators={ clearOscillators }
              useOscillator={ replaceOscillator }
              addToAdditionalNotes={ addToAdditionalNotes(desc.key) }
              playAdditionalNotes={ playAdditionalNotes }
              primary={ desc.primary }
              useGlobalBPM={ desc.useGlobalBPM }
              useGlobalTimekeeping={ desc.useGlobalTimekeeping }
              setGlobalOption={ setGlobalOption }
              globalOptions={ globalOptions }
              removeSelf={ () => removeSelf(desc.key) } />
        )
      }
      <Oscilloscope context={ context } source={ oscillators[oscillators.length-1] }/>
    </ThemeProvider>
  );
}

export default App;
