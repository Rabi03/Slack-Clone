import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Login from "./component/Auth/Login";
import Register from "./component/Auth/Register";
import firebase from "./firebase";

import "semantic-ui-css/semantic.min.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { setUser, clearUser } from "./actions";
import Spinner from "./Spinner";

const store = createStore(rootReducer, composeWithDevTools());

const Root = (props) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log(user);
        props.setUser(user);
        props.history.push("/");
      } else {
        props.history.push("/login");
        props.clearUser();
      }
    });
  }, []);
  if (props.isLoading) return <Spinner />;
  else
    return (
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    );
};

const LoadingState = (state) => ({
  isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(
  connect(LoadingState, { setUser, clearUser })(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
