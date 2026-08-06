import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw, Flame, BookMarked } from 'lucide-react'; //THESE ARE USED FOR THE ICONS WITHIN THE APPLICATION
import LEVELS from "./wordBank.js";

const STORAGE_KEY = 'vocab-cabinet-state-v1';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(key) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function resolvePointer(level, pointer) {
  let L = level;
  let P = pointer;
  while (P >= LEVELS[L - 1].words.length) {
    if (L < LEVELS.length) {
      L += 1;
      P = 0;
    } else {
      P = LEVELS[L - 1].words.length - 1;
      break;
    }
  }
  return { level: L, pointer: P };
}

function computeStreak(history) {
  const byDate = new Map(history.map((h) => [h.date, h]));
  let streak = 0;
  const cursor = new Date();
  // if today has no entry yet, start counting from yesterday
  if (!byDate.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    const entry = byDate.get(key);
    if (entry && entry.used) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function VocabCabinet() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [state, setState] = useState(null);
  const [usedChoice, setUsedChoice] = useState(null);
  const [reflection, setReflection] = useState('');
  const [openDate, setOpenDate] = useState(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persist(next) {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
    } catch (e) {
      setErrorMsg("Your progress couldn't be saved just now. It's still safe in this session.");
    }
  }

  async function init() {
    setLoading(true);
    setErrorMsg(null);
    let loaded = null;
    try {
      const res = await window.storage.get(STORAGE_KEY, false);
      if (res && res.value) loaded = JSON.parse(res.value);
    } catch (e) {
      loaded = null;
    }

    const key = todayKey();
    if (!loaded) {
      loaded = { level: 1, pointer: 0, lastAssignedDate: key, history: [] };
      await persist(loaded);
    } else if (loaded.lastAssignedDate !== key) {
      const advanced = resolvePointer(loaded.level, loaded.pointer + 1);
      loaded = { ...loaded, level: advanced.level, pointer: advanced.pointer, lastAssignedDate: key };
      await persist(loaded);
    }

    setState(loaded);
    const todays = loaded.history.find((h) => h.date === key);
    setUsedChoice(todays ? todays.used : null);
    setReflection(todays ? todays.reflection || '' : '');
    setLoading(false);
  }

  if (loading || !state) {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--paper-dim)' }}>
          Opening the cabinet…
        </div>
      </Shell>
    );
  }

  const currentLevel = LEVELS[state.level - 1];
  const currentWord = currentLevel.words[state.pointer];
  const key = todayKey();
  const savedEntry = state.history.find((h) => h.date === key);
  const history = [...state.history].sort((a, b) => (a.date < b.date ? 1 : -1));
  const streak = computeStreak(state.history);
  const totalUsed = state.history.filter((h) => h.used).length;
  const isFinalWord = state.level === LEVELS.length && state.pointer === currentLevel.words.length - 1;

  async function handleSave() {
    if (usedChoice === null) return;
    setSaving(true);
    const entry = {
      date: key,
      level: state.level,
      levelName: currentLevel.name,
      word: currentWord.word,
      used: usedChoice,
      reflection: reflection.trim(),
    };
    const nextHistory = [...state.history.filter((h) => h.date !== key), entry];
    const next = { ...state, history: nextHistory };
    setState(next);
    await persist(next);
    setSaving(false);
  }

  async function handleReset() {
    const fresh = { level: 1, pointer: 0, lastAssignedDate: todayKey(), history: [] };
    setState(fresh);
    setUsedChoice(null);
    setReflection('');
    setConfirmingReset(false);
    await persist(fresh);
  }

  return (
    <Shell>
      <header style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="eyebrow">The Word Cabinet</div>
            <h1 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--paper)', margin: 0 }}>
              A specimen a day
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Stat icon={<BookMarked size={15} />} label="collected" value={totalUsed} />
            <Stat icon={<Flame size={15} />} label="streak" value={streak} />
          </div>
        </div>
      </header>

      {errorMsg && (
        <div style={{ background: 'rgba(166,69,47,0.15)', border: '1px solid var(--rust)', color: 'var(--paper)', padding: '0.6rem 0.9rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Word card */}
      <div className="specimen-card">
        <span className="pin" style={{ top: 10, left: 10 }} />
        <span className="pin" style={{ top: 10, right: 10 }} />
        <span className="pin" style={{ bottom: 10, left: 10 }} />
        <span className="pin" style={{ bottom: 10, right: 10 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
          <div className="level-badge">Level {state.level} · {currentLevel.name}</div>
          <div style={{ fontFamily: 'var(--font-utility)', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
            word {state.pointer + 1} of {currentLevel.words.length}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0.5rem 0 1.1rem' }}>
          <div className="headword title-font">{currentWord.word}</div>
          <div style={{ fontFamily: 'var(--font-utility)', fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.35rem' }}>
            <em style={{ fontStyle: 'italic' }}>{currentWord.pos}</em> &nbsp;·&nbsp; /{currentWord.ipa}/
          </div>
        </div>

        <p className="def-font" style={{ fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 1rem' }}>
          {currentWord.def}
        </p>

        <div className="example-block">
          <span className="example-label">In practice</span>
          <p className="def-font" style={{ fontStyle: 'italic', margin: '0.25rem 0 0', color: 'var(--ink)', lineHeight: 1.5 }}>
            {currentWord.example}
          </p>
        </div>

        <div className="challenge-block">
          <span className="example-label" style={{ color: 'var(--teal)' }}>Today's challenge</span>
          <p className="def-font" style={{ margin: '0.25rem 0 0', color: 'var(--ink)', lineHeight: 1.5 }}>
            {currentWord.challenge}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', margin: '1.1rem 0 0.2rem' }}>
          {currentLevel.words.map((_, i) => (
            <span
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: i < state.pointer ? 'var(--teal)' : i === state.pointer ? 'var(--brass)' : 'rgba(27,36,32,0.15)',
              }}
            />
          ))}
        </div>
        {isFinalWord && (
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-utility)', fontSize: '0.72rem', color: 'var(--rust)', marginTop: '0.4rem' }}>
            Final specimen in the cabinet — for now.
          </div>
        )}
      </div>

      {/* Reflection form */}
      <div className="ledger-card" style={{ marginTop: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-utility)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.6rem' }}>
          Did you use it today?
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.9rem' }}>
          <ToggleButton active={usedChoice === true} onClick={() => setUsedChoice(true)} icon={<Check size={15} />} label="Yes" activeColor="var(--teal)" />
          <ToggleButton active={usedChoice === false} onClick={() => setUsedChoice(false)} icon={<X size={15} />} label="Not yet" activeColor="var(--rust)" />
        </div>

        <label style={{ display: 'block', fontFamily: 'var(--font-utility)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '0.4rem' }}>
          Field notes — how did it go?
        </label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="e.g. Used it describing my coworker's plan — felt natural by the second try."
          rows={3}
          className="reflection-input"
        />

        <button
          onClick={handleSave}
          disabled={usedChoice === null || saving}
          className="save-button"
          style={{ opacity: usedChoice === null ? 0.5 : 1, cursor: usedChoice === null ? 'not-allowed' : 'pointer' }}
        >
          {saving ? 'Saving…' : savedEntry ? 'Update entry' : "Save today's entry"}
        </button>
      </div>

      {/* Ledger */}
      {history.length > 0 && (
        <div style={{ marginTop: '1.75rem' }}>
          <div style={{ fontFamily: 'var(--font-utility)', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--paper-dim)', marginBottom: '0.6rem' }}>
            Collection log
          </div>
          <div className="ledger-strip">
            {history.map((h) => (
              <button
                key={h.date}
                onClick={() => setOpenDate(openDate === h.date ? null : h.date)}
                className="ticket"
                style={{ borderColor: openDate === h.date ? 'var(--brass)' : 'rgba(241,233,214,0.15)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {h.used ? <Check size={12} color="var(--teal)" /> : <X size={12} color="var(--rust)" />}
                  <span style={{ fontFamily: 'var(--font-utility)', fontSize: '0.68rem', color: 'var(--paper-dim)' }}>{formatDateLabel(h.date)}</span>
                </div>
                <div className="title-font" style={{ fontSize: '0.95rem', color: 'var(--paper)', marginTop: 2 }}>{h.word}</div>
              </button>
            ))}
          </div>

          {openDate && (() => {
            const entry = history.find((h) => h.date === openDate);
            if (!entry) return null;
            return (
              <div className="ledger-card" style={{ marginTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span className="title-font" style={{ fontSize: '1.1rem', color: 'var(--ink)' }}>{entry.word}</span>
                  <span style={{ fontFamily: 'var(--font-utility)', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>{formatDateLabel(entry.date)} · Level {entry.level}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem', fontFamily: 'var(--font-utility)', fontSize: '0.8rem', color: entry.used ? 'var(--teal)' : 'var(--rust)' }}>
                  {entry.used ? <Check size={14} /> : <X size={14} />}
                  {entry.used ? 'Used it' : 'Not used'}
                </div>
                <p className="def-font" style={{ margin: 0, color: 'var(--ink)', lineHeight: 1.5 }}>
                  {entry.reflection ? entry.reflection : <span style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>No field notes left for this day.</span>}
                </p>
              </div>
            );
          })()}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        {!confirmingReset ? (
          <button onClick={() => setConfirmingReset(true)} className="reset-link">
            <RotateCcw size={12} style={{ marginRight: 4, verticalAlign: '-2px' }} />
            Start the cabinet over
          </button>
        ) : (
          <div style={{ fontFamily: 'var(--font-utility)', fontSize: '0.78rem', color: 'var(--paper-dim)' }}>
            This clears every entry and returns you to Level 1. Sure?
            <button onClick={handleReset} className="reset-link" style={{ marginLeft: 10, color: 'var(--rust)' }}>Yes, reset</button>
            <button onClick={() => setConfirmingReset(false)} className="reset-link" style={{ marginLeft: 10 }}>Cancel</button>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--brass)' }}>
      {icon}
      <span className="title-font" style={{ fontSize: '1rem', color: 'var(--paper)' }}>{value}</span>
      <span style={{ fontFamily: 'var(--font-utility)', fontSize: '0.68rem', color: 'var(--paper-dim)' }}>{label}</span>
    </div>
  );
}

function ToggleButton({ active, onClick, icon, label, activeColor }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '0.55rem 0.8rem',
        borderRadius: 8,
        border: `1px solid ${active ? activeColor : 'rgba(27,36,32,0.2)'}`,
        background: active ? activeColor : 'transparent',
        color: active ? 'var(--paper)' : 'var(--ink)',
        fontFamily: 'var(--font-utility)',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Shell({ children }) {
  return (
    <div
      style={{
        '--ink': '#1B2420',
        '--ink-soft': '#5B6B62',
        '--paper': '#F1E9D6',
        '--paper-dim': '#B9AF95',
        '--brass': '#C99A3C',
        '--teal': '#2F6F63',
        '--rust': '#A6452F',
        '--font-display': "'Fraunces', serif",
        '--font-utility': "'Space Grotesk', sans-serif",
        '--font-def': "'Source Serif 4', serif",
        background: '#1B2420',
        backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(201,154,60,0.08), transparent 45%)',
        minHeight: '100%',
        padding: '2rem 1rem 3rem',
        fontFamily: 'var(--font-utility)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
        .title-font { font-family: var(--font-display); }
        .def-font { font-family: var(--font-def); }
        .eyebrow {
          font-family: var(--font-utility);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brass);
          margin-bottom: 0.15rem;
        }
        .specimen-card {
          position: relative;
          background: var(--paper);
          border-radius: 10px;
          padding: 1.6rem 1.5rem;
          box-shadow: 0 18px 40px -12px rgba(0,0,0,0.5);
        }
        .pin {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brass);
          opacity: 0.6;
        }
        .level-badge {
          font-family: var(--font-utility);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          padding: 3px 9px;
          border-radius: 999px;
        }
        .headword {
          font-size: 2.6rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.1;
        }
        .example-block {
          border-left: 2px solid var(--brass);
          padding-left: 0.8rem;
          margin-bottom: 0.9rem;
        }
        .example-block .example-label, .challenge-block .example-label {
          font-family: var(--font-utility);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brass);
        }
        .challenge-block {
          background: rgba(47,111,99,0.08);
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
        }
        .ledger-card {
          background: var(--paper);
          border-radius: 10px;
          padding: 1.25rem 1.4rem;
        }
        .reflection-input {
          width: 100%;
          font-family: var(--font-def);
          font-size: 0.92rem;
          color: var(--ink);
          background: rgba(27,36,32,0.04);
          border: 1px solid rgba(27,36,32,0.15);
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
          resize: vertical;
          box-sizing: border-box;
          margin-bottom: 0.9rem;
        }
        .reflection-input:focus {
          outline: none;
          border-color: var(--teal);
        }
        .save-button {
          width: 100%;
          background: var(--ink);
          color: var(--paper);
          border: none;
          border-radius: 8px;
          padding: 0.7rem;
          font-family: var(--font-utility);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .save-button:focus-visible, .reset-link:focus-visible, .ticket:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 2px;
        }
        .ledger-strip {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.4rem;
        }
        .ticket {
          flex: 0 0 auto;
          background: rgba(241,233,214,0.06);
          border: 1px solid rgba(241,233,214,0.15);
          border-radius: 8px;
          padding: 0.5rem 0.7rem;
          cursor: pointer;
          text-align: left;
          min-width: 108px;
        }
        .reset-link {
          background: none;
          border: none;
          color: var(--paper-dim);
          font-family: var(--font-utility);
          font-size: 0.78rem;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (min-width: 640px) {
          .headword { font-size: 3.2rem; }
        }
      `}</style>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>{children}</div>
    </div>
  );
}
