import { useEffect, useState } from "react";
import "./WebsiteTimeTracking.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// import "../../App.css";

type TimeData = Record<string, number>;

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min ${seconds % 60} sec`;
}

export const WebsiteTimeTracking = () => {
    const [timeData, setTimeData] = useState<TimeData>({});
    const [trackingEnabled, setTrackingEnabled] = useState<boolean>(false);

    const navigate = useNavigate();

    // ✅ Fetch Tracking State & Time Data
    useEffect(() => {
        const fetchData = async () => {
            const { timeSpent, trackingEnabled } = await chrome.storage.local.get([
                "timeSpent",
                "trackingEnabled",
            ]);
            setTimeData(timeSpent || {});
            setTrackingEnabled(trackingEnabled !== undefined ? trackingEnabled : false);
        };

        fetchData();
        chrome.storage.onChanged.addListener(fetchData);
        return () => chrome.storage.onChanged.removeListener(fetchData);
    }, []);

    // ✅ Toggle Tracking ON/OFF
    const toggleTracking = async () => {
        const newState = !trackingEnabled;
        setTrackingEnabled(newState);
        await chrome.storage.local.set({ trackingEnabled: newState });
    };

    // // ✅ Clears ALL Website Tracking Data & Updates UI
    // const clearHistory = async () => {
    //     await chrome.storage.local.set({ timeSpent: {} }); // Reset storage key
    //     setTrackingEnabled(false);
    //     setTimeData({}); // Reset React state
    // };

    return (
        <>
            <motion.div className="card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="">Website Time Tracker</h1>
                <p id="itemDescription">Automatically track time spent on different websites.</p>
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                    whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                >
                    {"Go to Home"}
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                    whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTracking}
                >
                    {trackingEnabled ? "Stop Tracking ❌" : "Start Tracking ✅"}
                </motion.button>

                {/* <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                    whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                    whileTap={{ scale: 0.95 }}

                    onClick={clearHistory} // ✅ Clear History Button
                >
                    {"Clear History 🗑️"}
                </motion.button> */}

                <table className="tracker-table">
                    <thead>
                        <tr>
                            <th>Website</th>
                            <th>Time Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(timeData).map(([domain, time]) => (
                            <tr key={domain}>
                                <td className="tracker-domain">{domain}</td>
                                <td className="tracker-time">{formatTime(time)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </motion.div>


        </>
    );
};
