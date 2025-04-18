import { jsx as _jsx } from "react/jsx-runtime";
import './App.css';
import Scene from "./components/scene";
const App = () => {
    return (_jsx("div", { children: _jsx(Scene, {}) }));
};
export default App;
