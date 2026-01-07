"use client";

import { useState } from "react";
import styles from "./page.module.css";
import KegelTimer from "./components/KegelTimer";
import ConsistencyCalendar from "./components/ConsistencyCalendar";
import SettingsModal from "./components/SettingsModal";
import { useTheme } from "./hooks/useTheme";

// Define exercise modes
type Mode = {
  id: string;
  label: string;
  work: number;
  rest: number;
  reps: number;
  desc: string;
};

const MODES: Mode[] = [
  { id: 'easy', label: '小白入门', work: 3, rest: 5, reps: 8, desc: '轻松开始，找找感觉 🌱' },
  { id: 'normal', label: '日常保养', work: 5, rest: 5, reps: 10, desc: '每天坚持，健康常驻 ✨' },
  { id: 'hard', label: '强力挑战', work: 8, rest: 4, reps: 12, desc: '核心进阶，激活机能 🔥' },
];

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>(MODES[1]); // Default to Normal
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Settings & Theme
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { mode, setMode } = useTheme();

  const startSession = () => {
    setIsPlaying(true);
  };

  const finishSession = () => {
    setIsPlaying(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={styles.main}>
      <div className="top-bar">
        <h1 className={styles.title}>Cute Kegel 🌸</h1>
        <button className="settings-btn" onClick={() => setIsSettingsOpen(true)}>⚙️</button>
      </div>

      {!isPlaying ? (
        <>
          <p className={styles.subtitle}>
            每天一点点可爱，每天一点点健康。<br />
            准备好开始今天的练习了吗？
          </p>

          {/* Pre-workout Info Card */}
          <div className="info-card">
            <button
              className="info-toggle"
              onClick={() => setIsInfoOpen(!isInfoOpen)}
            >
              <span>🤔 什么是凯格尔运动？</span>
              <span>{isInfoOpen ? '▲' : '▼'}</span>
            </button>

            {isInfoOpen && (
              <div className="info-content">
                <p>凯格尔运动（Kegel exercises）也被称为骨盆运动，就像给你的盆底肌肉做“健身”！🏋️‍♀️</p>
                <p>这组肌肉像一张吊床，托住你的子宫、膀胱和肠道。锻炼它们可以帮助：</p>
                <ul>
                  <li>✨ 改善漏尿尴尬</li>
                  <li>✨ 提升紧致度</li>
                  <li>✨ 产后快速恢复</li>
                </ul>
                <p className="highlight">做法很简单：像是憋尿一样收缩，然后放松。</p>
              </div>
            )}
          </div>

          <div className="mode-selector">
            <p className="section-label">选择你的节奏</p>
            <div className="mode-grid">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode)}
                  className={`mode-card ${selectedMode.id === mode.id ? 'active' : ''}`}
                >
                  <div className="mode-title">{mode.label}</div>
                  <div className="mode-desc">{mode.desc}</div>
                  <div className="mode-time">{mode.work}秒收 - {mode.rest}秒放</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <button
              onClick={startSession}
              className="start-btn"
            >
              开始练习
            </button>
          </div>

          {/* Calendar Section */}
          <ConsistencyCalendar refreshTrigger={refreshKey} />

        </>
      ) : (
        <KegelTimer
          onComplete={finishSession}
          config={{
            workTime: selectedMode.work,
            restTime: selectedMode.rest,
            totalReps: selectedMode.reps
          }}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mode={mode}
        setMode={setMode}
      />

      <style jsx>{`
        .top-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          margin-bottom: 1rem;
        }
        
        .settings-btn {
          position: absolute;
          right: 0;
          top: 0;
          background: rgba(255,255,255,0.5);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .settings-btn:hover {
          transform: rotate(45deg);
        }

        .info-card {
          width: 100%;
          max-width: 400px;
          background: var(--pk-surface); /* Updated to variable */
          border-radius: var(--radius-md);
          margin: 1rem 0;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        .info-toggle {
          width: 100%;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          color: var(--pk-text);
          cursor: pointer;
        }
        .info-content {
          padding: 0 1rem 1rem 1rem;
          color: var(--pk-text-light);
          font-size: 0.9rem;
          line-height: 1.6;
          text-align: left;
          animation: slideDown 0.3s ease;
        }
        .info-content ul {
          margin: 0.5rem 0 0.5rem 1.5rem;
        }
        .highlight {
          color: var(--pk-secondary);
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .mode-selector {
          margin: 1rem 0;
          width: 100%;
          max-width: 400px;
        }
        .section-label {
          font-size: 1rem;
          color: var(--pk-text-light);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        .mode-grid {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .mode-card {
          background: rgba(255,255,255, 0.4); 
          border: 2px solid transparent;
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }
        /* Dark mode adjustment for card background via attribute selector is hard with styled-jsx inline */
        /* But we can use our CSS variables context gracefully */
        
        .mode-card.active {
          background: var(--pk-surface);
          border-color: var(--pk-secondary);
          box-shadow: 0 8px 20px rgba(255, 183, 178, 0.3);
          transform: scale(1.02);
        }
        .mode-title {
          font-weight: 700;
          color: var(--pk-text);
          font-size: 1.05rem;
        }
        .mode-desc {
          font-size: 0.85rem;
          color: var(--pk-text-light);
          margin: 2px 0;
        }
        .mode-time {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--pk-secondary);
          // background: #fff0f5;  <- Needs to be variable
          background: var(--pk-bg); 
          padding: 2px 8px;
          border-radius: 10px;
          display: inline-block;
        }

        .start-btn {
          padding: 16px 48px;
          font-size: 1.2rem;
          border-radius: var(--radius-lg);
          background: var(--pk-primary);
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
          font-family: inherit;
          font-weight: 600;
          transition: transform 0.1s ease;
        }
        .start-btn:active {
          transform: scale(0.96);
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
