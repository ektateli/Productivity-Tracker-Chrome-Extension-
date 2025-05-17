// import "../weather/WeatherApp.css"

import { motion } from "framer-motion";
import "./About.css";
import { useNavigate } from "react-router-dom";
// import "../../App.css";

export function About() {
    const navigate = useNavigate();
    return (
        <>
            <motion.div
                className="card left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="center">
                    <h1>Productivity Tracker</h1>
                    <p>Developed by Ekta | Built with React, Vite & TypeScript for fast and seamless performance.</p>
                    <p>Track your daily goals, monitor time spent on websites, and visualize your productivity trends with an intuitive and efficient interface. Stay focused and maximize your efficiency!</p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                    whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                >
                    {"Home"}
                </motion.button>

            </motion.div>

        </>
    );
}
