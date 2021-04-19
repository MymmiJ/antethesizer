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


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <SoundControls />
    </ThemeProvider>
  );
}

export default App;
