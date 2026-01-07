"use client";

import { useEffect, useState } from "react";

type ThemeMode = 'auto' | 'light' | 'dark';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

export default function SettingsModal({ isOpen, onClose, mode, setMode }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (!isOpen) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="header">
                    <h3>Settings ⚙️</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="setting-item">
                    <label>Theme Appearance</label>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${mode === 'auto' ? 'active' : ''}`}
                            onClick={() => setMode('auto')}
                        >
                            Auto 🌗
                        </button>
                        <button
                            className={`toggle-btn ${mode === 'light' ? 'active' : ''}`}
                            onClick={() => setMode('light')}
                        >
                            Light ☀️
                        </button>
                        <button
                            className={`toggle-btn ${mode === 'dark' ? 'active' : ''}`}
                            onClick={() => setMode('dark')}
                        >
                            Dark 🌙
                        </button>
                    </div>
                    <p className="hint">
                        Auto mode switches to Dark Mode between 7 PM and 6 AM.
                    </p>
                </div>

                <div className="setting-item coming-soon">
                    <label>Sound & Haptics</label>
                    <div className="toggle-group disabled">
                        <button className="toggle-btn active">On</button>
                        <button className="toggle-btn">Off</button>
                    </div>
                </div>

            </div>

            <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        .modal {
          background: var(--pk-surface);
          color: var(--pk-text);
          padding: 2rem;
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 360px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .header h3 {
          margin: 0;
          font-size: 1.4rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          color: var(--pk-text-light);
          cursor: pointer;
          line-height: 1;
        }

        .setting-item {
          margin-bottom: 2rem;
        }

        .setting-item label {
          display: block;
          margin-bottom: 0.8rem;
          font-weight: 600;
          color: var(--pk-text);
        }

        .toggle-group {
          display: flex;
          background: rgba(0,0,0,0.05);
          padding: 4px;
          border-radius: 12px;
        }
        [data-theme='dark'] .toggle-group {
          background: rgba(255,255,255,0.1);
        }

        .toggle-btn {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--pk-text-light);
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: var(--pk-surface);
          color: var(--pk-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-weight: 600;
        }
        
        .hint {
          font-size: 0.8rem;
          color: var(--pk-text-light);
          margin-top: 0.5rem;
        }
        
        .coming-soon {
          opacity: 0.5;
          pointer-events: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
