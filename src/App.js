import React, { useState } from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { playNotes, SoundControls } from './music';
import { v4 as uuidv4 } from 'uuid'; 

const theme = createMuiTheme({
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
 * Options Menu:
 * - Custom synths via. wavetable
 * - Import/export wavetables as JSON
 * - Display wavetable - try: https://github.com/indutny/fft.js/
 * - Use display to input back into wavetable
 * - default root note for all segments 1
 * - Overall direction (determine root note by increasing/decreasing from source)
 * - Allow/add multiple generators per pattern
 * - Allow custom synths
 * - Allow composing synths together
 * Sections:
 * - Allow specifying the mood of subsections*
 * - Allow inserting specfic runs of notes
 * - Allow option to end on a root note (either added or replacing the final note)
 * - Turn bias for picking next shift off
 * - Allow selecting 'EITHER' option
 * - Allow locking of note runs in place 1
 *     preventing regeneration & changing mood/root note, retaining ability to e.g. repeat notes
 *     Essential for allowing insertion of specific runs
 * Ornaments:
 *  - Chords 1
 *  - Arpeggios
 *  - Acciaccatura/trills etc.
 *  - Microtonal shifts
 *  - (more) vibrato/tremolo
 * Rhythm:
 *  - bpm 1
 *  - time signature
 *  - accents
 *  - individual note lengths (use American quarter note system)
 *  - allow use of hemisemidemiquaver system
 *  - syncopation
 * Dynamics:
 *  - vary dynamics based on mood
 * Motifs:
 *  - Enable inserting motifs to be repeated, consisting of smaller sections with notes specified
 * Generation:
 *  - Improve generation by using pickBiasLate to descend slowly 1
 *  - Improve generation by remembering _first_ root Note of series
 *    (e.g. for Passage, remember real rootNote into the children and use to modify generation)
 *  - Improve generation by picking different sets of movements that can move to each other
 *  - Improve generation by allowing 'motion towards' particular notes
 *  - Improve generation by generating in batches of 2 with option for truncated gen (i.e. short phrase returns 4, long phrase returns 8).
 *  - Improve generation by allowing different composable(?) 'patterns', e.g. mode, up-and-down
 * 
 * 
 */

const App = () => {
  const [additionalSoundControls, setSoundControls] = useState([]);

  const addNewSoundControls = () => setSoundControls(prev => [...prev, {
    key: uuidv4(),
    removable: true,
    notes: [],
    context: null,
    synth: null,
    addNewSoundControls
  }]);
  const addToAdditionalNotes = (key) => (value, context, synth) => {
    setSoundControls(prev => prev.map(
      soundControls => soundControls.key !== key ?
        soundControls :
        Object.assign(
          { ...soundControls },
          {
            notes: value(soundControls.notes),
            context,
            synth
          }
        )
    ))
  }
  const playAdditionalNotes = () => {
    additionalSoundControls.forEach(
      ({ notes, context, synth }, _, __) => {
        if(notes && context && synth){
          playNotes(notes.flat(), context, synth);
        }
      }
    );
  }
  const removeSelf = (id) => setSoundControls(prev => prev.filter(desc => desc.key !== id ));
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <SoundControls
        key='alpha-and-omega'
        addNewSoundControls={ addNewSoundControls }
        removable={ false }
        addToAdditionalNotes={ () => {} }
        playAdditionalNotes={ playAdditionalNotes } />
      {
        additionalSoundControls.map(
          desc =>
            <SoundControls
              key={ desc.key }
              addNewSoundControls={ desc.addNewSoundControls }
              addToAdditionalNotes={ addToAdditionalNotes(desc.key) }
              removable={ desc.removable }
              removeSelf={ () => removeSelf(desc.key) } />
        )
      }
    </ThemeProvider>
  );
}

export default App;
