import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Signin from "./component/Signin";
import Home from "./component/Home";
import "./App.css";
import { firebaseAuth } from "./provider/AuthProvider";
import { createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  const { token } = useContext(firebaseAuth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* switch allows switching which components render.  */}
      <Switch>
        {/* route allows you to render by url path */}

        <Route
          exact
          path="/"
          render={(rProps) => (token === null ? <Signin /> : <Home />)}
        />
        <Route exact path="/signin" component={Signin} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
