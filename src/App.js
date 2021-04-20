import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SoundControls } from './music';

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
 * ! - Essential before release
 * * - Large or surprisingly large task
 * 1 - Highest priority per section
 * # - in progress
 * UI:
 * - accessibility review (aria+contrast-focused)!
 * - Display sound as per https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
 * Options Menu:
 *  - Synthesizer type 1#
 *  - Import/export wavetables as JSON
 *  - Display wavetable - try: https://github.com/indutny/fft.js/
 *  - Use display to input back into wavetable
 *  - default mood 1
 *  - default root note for all segments
 *  - Overall direction (determine root note by increasing/decreasing from source)
 *  - Allow/add multiple generators per pattern
 * Sections:
 * - Allow specifying the mood of subsections*
 * - Allow inserting specfic runs of notes
 * - Allow option to end on a root note (either added or replacing the final note)
 * - Turn bias for picking next shift off
 * - Allow selecting 'EITHER' option
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
 *  - Improve genenation by allowing 'motion towards' particular notes
 * 
 * 
 */

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <SoundControls />
    </ThemeProvider>
  );
}

export default App;
