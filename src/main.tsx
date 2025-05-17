import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index_old.css';
// import Popup from './Popup'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <Popup></Popup> */}
  </StrictMode>,
)

// import { HashRouter, Routes, Route } from "react-router-dom";



// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import "./index.css"
// import { About } from "./components/About/About";
// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App></App>} />
//         <Route path="/about" element={<About />} />

//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );
