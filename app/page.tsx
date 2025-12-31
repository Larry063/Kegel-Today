import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Cute Kegel 🌸</h1>
      <p className={styles.subtitle}>
        Stay healthy and strong with a little bit of cuteness every day.
        <br />
        Your daily exercise companion is ready!
      </p>

      <div style={{ marginTop: '2rem' }}>
        {/* Placeholder for future button */}
        <button style={{
          padding: '12px 32px',
          fontSize: '1.1rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--pk-primary)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-soft)',
          fontFamily: 'inherit',
          fontWeight: 600
        }}>
          Start Session
        </button>
      </div>
    </div>
  );
}
