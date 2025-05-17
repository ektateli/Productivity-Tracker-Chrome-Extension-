import { useEffect, useState } from "react";

type TimeData = Record<string, number>;

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ${seconds % 60} sec`;
}

export const WTT = () => {
  const [timeData, setTimeData] = useState<TimeData>({});

  useEffect(() => {
    const fetchTimeData = async () => {
      const result = await chrome.storage.local.get("timeSpent");
      setTimeData(result.timeSpent || {});
    };

    fetchTimeData(); // Fetch initially

    // ✅ Listen for real-time updates
    chrome.storage.onChanged.addListener(() => {
      fetchTimeData(); // Update state whenever storage changes
    });

    return () => {
      chrome.storage.onChanged.removeListener(fetchTimeData);
    };
  }, []);

  return (
    <div className="">
      <h1 className="">Website Time Tracker</h1>
      <table className="">
        <thead>
          <tr className="">
            <th className="">Website</th>
            <th className="">Time Spent</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(timeData).map(([domain, time]) => (
            <tr key={domain}>
              <td className="">{domain}</td>
              <td className="">{formatTime(time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
