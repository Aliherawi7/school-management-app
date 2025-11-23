import "./renderer/index.css"
import "./assets/css/bootstrap-icons.css"
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./renderer/locale/locale.js"

import reducer, { initialState } from "./renderer/context/reducer.js"

import App from "./renderer/App.tsx"
import React from "react"
import { StateProvider } from "./renderer/context/StateProvider.js"
import { createRoot } from "react-dom/client"

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>
)
