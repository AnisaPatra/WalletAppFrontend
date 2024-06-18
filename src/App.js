import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SetupWallet from './components/Wallets'
import Transactions from './components/Transactions';

const App = () => {
  return (
    <Router>
      <div>
        <h1 style={{textAlign:"center", margin:"40px"}}>Wallet App</h1>
        <Switch>
          <Route path="/" exact component={SetupWallet} />
          <Route path="/transactions" component={Transactions} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
