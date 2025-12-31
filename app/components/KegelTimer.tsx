"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "idle" | "ready" | "work" | "rest" | "finished";

interface TimerConfig {
  workTime: number;
  restTime: number;
  totalReps: number;
}

interface Props {
  onComplete: () => void;
  config: TimerConfig;
}

const QUOTES = [
  "做得好！你会感谢现在努力的自己 ❤️",
  "每一次收缩，都在为健康加分 ✨",
  "放松全身，去感受身体的变化 🍃",
  "不仅仅是变强，更是学会爱自己 🌸",
  "坚持就是最酷的事情 💪",
  "深呼吸，把焦虑都呼出去 🌬️",
  "你是最棒的，别忘了给自己点赞 👍",
];

export default function KegelTimer({ onComplete, config }: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [seconds, setSeconds] = useState(3);
  const [rep, setRep] = useState(1);
  const [quote, setQuote] = useState(QUOTES[0]);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Use config props
  const { workTime, restTime, totalReps } = config;

  const playTone = (type: 'tick' | 'change' | 'finish') => {
    // Basic Haptic
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'change') navigator.vibrate(50);
      if (type === 'finish') navigator.vibrate([100, 50, 100, 50, 100]);
    }

    // Audio Synthesis
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'tick') {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'change') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'finish') {
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Ignore
    }
  };

  // Change quote randomly
  const cycleQuote = () => {
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(random);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (phase === "ready") {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s > 1) playTone('tick');
          if (s <= 1) {
            playTone('change');
            setPhase("work");
            return workTime;
          }
          return s - 1;
        });
      }, 1000);
    } else if (phase === "work") {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            playTone('change');
            setPhase("rest");
            cycleQuote(); // Show new encouragement during rest
            return restTime;
          }
          return s - 1;
        });
      }, 1000);
    } else if (phase === "rest") {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            if (rep >= totalReps) {
              playTone('finish');
              setPhase("finished");
              return 0;
            }
            playTone('change');
            setRep((r) => r + 1);
            setPhase("work");
            return workTime;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [phase, rep, workTime, restTime, totalReps]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  if (phase === "finished") {
    return (
      <div className="card finished-card">
        <div className="icon">🏆</div>
        <h2>太棒了！</h2>
        <p>你完成了 {totalReps} 组练习。</p>
        <p className="quote">"每一次坚持，都是对身体最好的投资。"</p>
        <button onClick={onComplete} className="btn-primary">完成打卡</button>
        <style jsx>{`
          .card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 3rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-soft);
            text-align: center;
            animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 400px;
            width: 90%;
          }
          .icon { font-size: 4rem; margin-bottom: 1rem; }
          .quote { 
            font-style: italic; 
            color: var(--pk-text-light);
            margin: 1.5rem 0;
            font-size: 0.95rem;
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
            width: 100%;
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="glass-card">
        <div className="header">
          <span className="rep-badge">第 {rep} / {totalReps} 组</span>
        </div>

        <div className="status-display">
          <div className="emoji">
            {phase === "ready" && "⏳"}
            {phase === "work" && "💪"}
            {phase === "rest" && "🍃"}
          </div>
          <div className="status-text">
            {phase === "ready" && "准备"}
            {phase === "work" && "收缩"}
            {phase === "rest" && "放松"}
          </div>
        </div>

        <div className={`visual-circle-container`}>
          <div className={`visual-circle ${phase}`}>
            <span className="countdown">{seconds}</span>
          </div>
          {phase === 'work' && <div className="ripple"></div>}
        </div>

        <div className="quote-container">
          <p className="quote-text">{quote}</p>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          z-index: 0;
          opacity: 0.6;
          animation: float 6s infinite ease-in-out;
        }
        .blob-1 {
          top: -20%;
          left: -10%;
          width: 200px;
          height: 200px;
          background: #ffe3e8;
        }
        .blob-2 {
          bottom: -20%;
          right: -10%;
          width: 250px;
          height: 250px;
          background: #e6e6fa;
          animation-delay: 3s;
        }

        .glass-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          padding: 2rem;
          border-radius: 40px;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
          max-width: 380px;
        }

        .rep-badge {
          background: rgba(255,255,255,0.8);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--pk-text-light);
          font-weight: 600;
        }

        .status-display {
          text-align: center;
        }
        .emoji { font-size: 3rem; margin-bottom: 0.5rem; }
        .status-text {
          font-size: 2rem;
          font-weight: 800;
          color: var(--pk-text);
          letter-spacing: 2px;
        }

        .visual-circle-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-circle {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-weight: 700;
          color: var(--pk-primary);
          box-shadow: var(--shadow-soft);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 2;
          position: relative;
        }

        .visual-circle.work {
          transform: scale(0.85);
          background: var(--pk-secondary);
          color: white;
          box-shadow: 0 10px 30px rgba(255, 154, 162, 0.6);
        }
        .visual-circle.rest {
          transform: scale(1);
          background: #e8fbf3;
          color: var(--pk-text);
        }

        .ripple {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid var(--pk-secondary);
          animation: ripple 1s infinite;
          opacity: 0;
          z-index: 1;
        }
        
        .quote-container {
          min-height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quote-text {
          font-size: 0.95rem;
          color: var(--pk-text-light);
          text-align: center;
          font-family: 'Fredoka', sans-serif;
          line-height: 1.4;
          animation: fadeIn 0.5s ease;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
