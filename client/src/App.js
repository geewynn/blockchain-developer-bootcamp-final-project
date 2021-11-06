import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { RootInterface } from './components/global-style/global-style';
import MainLayout from "./components/main-layout/main-layout.component";
import Nav from './components/nav/nav.component';

const App = ()  => {
  return (

    <RootInterface>
      <Router>
        <Nav />
        <Switch>
          <Route exact path='/' component={ MainLayout } />
        </Switch>
      </Router>

    </RootInterface>
  );
}

export default App;
