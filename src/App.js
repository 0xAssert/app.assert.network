import logo from './assert.network.logo.png';
import './App.css';
import Wallet from 'components/Wallet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Assert.Network
        </p>
        <p>
          <Wallet />
        </p>
      </header>
    </div>
  );
}

export default App;
