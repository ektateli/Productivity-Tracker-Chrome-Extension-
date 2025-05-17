import { HashRouter, Routes, Route } from "react-router-dom";
import {Home} from "./components/Home/Home";
import { About } from "./components/About/About";

import "./App.css";
import {WebsiteTimeTracking} from "./components/WebsiteTimeTracking/WebsiteTimeTracking";
import { DistractionAlerts } from "./components/DistractionAlerts/DistractionAlerts";
import { DailyGoalSetting } from "./components/DailyGoalSetting/DailyGoalSetting";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route path="/About" element={<About></About>} />
        <Route path="/WebsiteTimeTracking" element={<WebsiteTimeTracking></WebsiteTimeTracking>} />
        <Route path="/DailyGoalSetting" element={<DailyGoalSetting></DailyGoalSetting>} />
        <Route path="/DistractionAlerts" element={<DistractionAlerts></DistractionAlerts>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
