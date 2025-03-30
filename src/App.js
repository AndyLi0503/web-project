import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World!
        </p>
        <a
          className="App-link"
          href="https://purdue.brightspace.com/d2l/lp/ouHome/defaultHome.d2l"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit BrightSpace
        </a>
      </header>
    </div>
  );
}

export default App;
