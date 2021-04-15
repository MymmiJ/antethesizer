import logo from './logo.svg';
import './App.css';
import { SoundButton } from './music';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <SoundButton />
      </header>
    </div>
  );
}

export default App;
