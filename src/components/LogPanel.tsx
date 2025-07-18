import React, { useEffect, useState } from 'react';

interface LogPanelProps {
  isPanelOpen: boolean;
}

export const LogPanel: React.FC<LogPanelProps> = ({ isPanelOpen }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isPanelOpen && window.electronAPI) {
      window.electronAPI.invoke('get-logs').then((logData: string[]) => {
        setLogs(logData || []);
      });
    }
  }, [isPanelOpen]);

  if (logs.length === 0) {
    return (
      <div className="empty-logs">
        <div>
          <p>No logs available</p>
          <small>Application activity will appear here</small>
        </div>
      </div>
    );
  }

  return (
    <div className="log-panel">
      {logs.map((log, index) => (
        <div key={index} className="log-entry">
          {log}
        </div>
      ))}
    </div>
  );
}; 