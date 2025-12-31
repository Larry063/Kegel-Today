"use client";

import { useEffect, useState } from "react";

export default function ConsistencyCalendar({ refreshTrigger }: { refreshTrigger?: number }) {
    const [history, setHistory] = useState<string[]>([]);

    // Get current date info
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();

    // Helper: Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper: Get day of week for the 1st of month (0=Sun, 6=Sat)
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // Load history from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("kegel_history");
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, [refreshTrigger]); // Reload when trigger changes

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Generate calendar grid
    const renderCalendar = () => {
        const grid = [];

        // Empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            grid.push(<div key={`empty-${i}`} className="day empty"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isCompleted = history.includes(dateStr);
            const isToday = d === today.getDate();

            grid.push(
                <div key={d} className={`day ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}>
                    <span className="day-num">{d}</span>
                    {isCompleted && <span className="stamp">🌸</span>}
                </div>
            );
        }
        return grid;
    };

    return (
        <div className="calendar-card">
            <h3 className="cal-title">📅 {currentYear}年 {currentMonth + 1}月 打卡记录</h3>
            <div className="weekdays">
                <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
            </div>
            <div className="days-grid">
                {renderCalendar()}
            </div>

            <style jsx>{`
        .calendar-card {
          background: rgba(255, 255, 255, 0.7);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          width: 100%;
          max-width: 360px;
          margin-top: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
        }
        .cal-title {
          text-align: center;
          color: var(--pk-text);
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        .weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.8rem;
          color: var(--pk-text-light);
          margin-bottom: 0.5rem;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 0.9rem;
          position: relative;
          background: rgba(255,255,255,0.5);
        }
        .day.today {
          border: 2px solid var(--pk-primary);
        }
        .day.completed {
          background: #fff0f5;
        }
        .day.empty {
          background: transparent;
        }
        .stamp {
          position: absolute;
          font-size: 1.2rem;
          animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .day-num {
          z-index: 1;
          opacity: 0.7;
          font-size: 0.8rem;
        }
        .completed .day-num {
          display: none; /* Hide number when stamped, or make it small */
        }
        
        @keyframes pop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
