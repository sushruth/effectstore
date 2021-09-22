import React from "react";
import "./App.css";
import { Comp } from "./component-using-state/comp";
import { AppStateProvider } from "./consumer/AppState";

function App() {
  return (
    <AppStateProvider>
      <Comp />
    </AppStateProvider>
  );
}

export default App;
