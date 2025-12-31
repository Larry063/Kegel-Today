"use client";

import { useState } from "react";
import styles from "./page.module.css";
import KegelTimer from "./components/KegelTimer";

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

  const startSession = () => {
    setIsPlaying(true);
  };

  const finishSession = () => {
    setIsPlaying(false);
  };

  return (
    <div className={styles.main}>
      {!isPlaying ? (
        <>
          <h1 className={styles.title}>Cute Kegel 🌸</h1>
          <p className={styles.subtitle}>
            每天一点点可爱，每天一点点健康。<br />
            准备好开始今天的练习了吗？
          </p>

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

          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={startSession}
              className="start-btn"
            >
              开始练习
            </button>
          </div>

          <style jsx>{`
            .mode-selector {
              margin: 2rem 0;
              width: 100%;
              max-width: 400px;
            }
            .section-label {
              font-size: 1rem;
              color: var(--pk-text-light);
              margin-bottom: 1rem;
              font-weight: 600;
            }
            .mode-grid {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            .mode-card {
              background: rgba(255,255,255,0.6);
              border: 2px solid transparent;
              padding: 1rem 1.5rem;
              border-radius: var(--radius-md);
              text-align: left;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 4px 10px rgba(0,0,0,0.03);
            }
            .mode-card.active {
              background: white;
              border-color: var(--pk-secondary);
              box-shadow: 0 8px 20px rgba(255, 183, 178, 0.3);
              transform: scale(1.02);
            }
            .mode-title {
              font-weight: 700;
              color: var(--pk-text);
              font-size: 1.1rem;
            }
            .mode-desc {
              font-size: 0.9rem;
              color: var(--pk-text-light);
              margin: 4px 0;
            }
            .mode-time {
              font-size: 0.8rem;
              font-weight: 600;
              color: var(--pk-secondary);
              background: #fff0f5;
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
          `}</style>
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
    </div>
  );
}
