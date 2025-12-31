"use client";

import { useState, useEffect } from "react";

type Phase = "idle" | "ready" | "work" | "rest" | "finished";

interface Props {
    onComplete: () => void;
}

export default function KegelTimer({ onComplete }: Props) {
    const [phase, setPhase] = useState<Phase>("ready");
    const [seconds, setSeconds] = useState(3); // Start with 3s countdown
    const [rep, setRep] = useState(1);
    const totalReps = 10;

    // Work duration (squeeze) and rest duration
    const WORK_TIME = 5;
    const REST_TIME = 5;

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (phase === "ready") {
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 1) {
                        setPhase("work");
                        return WORK_TIME;
                    }
                    return s - 1;
                });
            }, 1000);
        } else if (phase === "work") {
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 1) {
                        setPhase("rest");
                        return REST_TIME;
                    }
                    return s - 1;
                });
            }, 1000);
        } else if (phase === "rest") {
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 1) {
                        if (rep >= totalReps) {
                            setPhase("finished");
                            return 0;
                        }
                        setRep((r) => r + 1);
                        setPhase("work");
                        return WORK_TIME;
                    }
                    return s - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [phase, rep]);

    if (phase === "finished") {
        return (
            <div className="timer-container finished">
                <h2>🎉 Awesome!</h2>
                <p>You completed your daily session.</p>
                <button onClick={onComplete} className="btn-primary">Back Home</button>
            </div>
        );
    }

    return (
        <div className="timer-container">
            <div className="status-text">
                {phase === "ready" && "Get Ready..."}
                {phase === "work" && "SQUEEZE"}
                {phase === "rest" && "RELAX"}
            </div>

            <div className={`visual-circle ${phase}`}>
                <span className="countdown">{seconds}</span>
            </div>

            <div className="progress">
                Rep {rep} / {totalReps}
            </div>

            {/* Inline styles for this component specifically */}
            <style jsx>{`
        .timer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          animation: fadeIn 0.5s ease;
        }
        .finished {
          text-align: center;
        }
        .status-text {
          font-size: 2rem;
          font-weight: bold;
          color: var(--pk-primary);
          height: 3rem;
        }
        .visual-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: 700;
          color: var(--pk-text);
          box-shadow: var(--shadow-soft);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        
        /* Visual feedback states */
        .visual-circle.work {
          transform: scale(0.7); /* Squeeze inward */
          background: var(--pk-secondary);
          color: white;
          box-shadow: 0 0 30px var(--pk-secondary);
        }
        .visual-circle.rest {
          transform: scale(1.1); /* Relax outward */
          background: var(--pk-accent);
          color: white;
        }
        
        .progress {
          font-family: 'Outfit', sans-serif;
          color: var(--pk-text-light);
          font-size: 1.2rem;
        }

        .btn-primary {
          margin-top: 1rem;
          padding: 12px 32px;
          border-radius: var(--radius-lg);
          border: none;
          background: var(--pk-primary);
          color: white;
          font-size: 1.1rem;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
