"use client";

import { useState } from "react";
import styles from "./page.module.css";
import KegelTimer from "./components/KegelTimer";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);

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
            Stay healthy and strong with a little bit of cuteness every day.
            <br />
            Your daily exercise companion is ready!
          </p>

          <div style={{ marginTop: '3rem' }}>
            <button
              onClick={startSession}
              style={{
                padding: '16px 48px',
                fontSize: '1.2rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--pk-primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)',
                fontFamily: 'inherit',
                fontWeight: 600,
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start Session
            </button>
          </div>
        </>
      ) : (
        <KegelTimer onComplete={finishSession} />
      )}
    </div>
  );
}
