// import React, { useEffect, useState } from 'react';

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../../App.css";
// import { title } from "framer-motion/client";

export const Home = () => {

    const navigate = useNavigate();

    return (
        <>

            <motion.div className="card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                <h1>
                    Productivity Tracker!
                </h1>

                {/* <motion.input
        className="input"
        type="text"
        placeholder="Sample Input!"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
      /> */}

                <MakeItemCard  onClick={() => navigate("/WebsiteTimeTracking")} title={"Website Time Tracking"} description={"Automatically track time spent on different websites."} />
                <MakeItemCard onClick={() => navigate("/DailyGoalSetting")} title={"Daily Goal Setting"} description={"Allow users to set specific time-based goals for productive work.\nNotify users when they reach/exceed their goals."} />
                {/* <MakeItemCard onClick={() => navigate("/DistractionAlerts")} title={"Distraction Alerts"} description={"Warn users when they exceed their allowed time on social media, YouTube, or other distracting sites.\nOption to block or temporarily disable distracting websites."} /> */}

                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                    whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/about")}
                >
                    {"Developed By Ekta"}
                </motion.button>

            </motion.div>

        </>);
}


function MakeItemCard({ title, description, onClick }: any) {
    return (
        <>
            <div className="itemCard" onClick = {() => onClick()}>
                <h2 id="itemTitle">{title}</h2>
                <p id="itemDescription">{description}</p>
            </div>
        </>
    );
}


