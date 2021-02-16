import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Pages/inicio';
import Main from './Pages/Main';
import Agenda from './Components/agenda';
import Perfil from './Components/perfil';
let ruta = 'http://localhost:4001/';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/perfil" exact>
          <Main ruta={ruta} componente={Perfil} />
        </Route>
        <Route path="/agenda" exact>
          <Main ruta={ruta} componente={Agenda} />
        </Route>
        <Route path="/" exact>
          <Login ruta={ruta} />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

