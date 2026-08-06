import React, { useState, useEffect } from 'react';
import { Check, X, RotateCcw, Flame, BookMarked } from 'lucide-react'; //THESE ARE USED FOR THE ICONS WITHIN THE APPLICATION

// ---------- WORD BANK ----------
// Six levels, ten words each, tiered roughly by rarity/difficulty.
const LEVELS = [
  {
    name: 'Apprentice',
    words: [
      { word: 'ambivalent', ipa: 'am-BIV-uh-lent', pos: 'adjective', def: 'Having mixed or contradictory feelings about something.', example: 'She felt ambivalent about the promotion — excited for the challenge, wary of the longer hours.', challenge: "Use it to describe how you feel about a decision you're facing today." },
      { word: 'candid', ipa: 'KAN-did', pos: 'adjective', def: 'Openly honest, without holding back.', example: 'He gave a candid answer about why the project had fallen behind schedule.', challenge: "Give someone a candid opinion they didn't ask for (kindly)." },
      { word: 'cogent', ipa: 'KOH-jent', pos: 'adjective', def: 'Clear and convincing; logically sound.', example: 'Her cogent argument persuaded the whole committee to change course.', challenge: 'Make a cogent case for something small, like where to eat lunch.' },
      { word: 'discern', ipa: 'dih-SURN', pos: 'verb', def: 'To perceive or recognize something, often something subtle.', example: 'It took a moment to discern the difference between the two proposals.', challenge: 'Point out something you discern that others might miss.' },
      { word: 'empirical', ipa: 'em-PEER-ih-kul', pos: 'adjective', def: 'Based on observation or experiment rather than theory.', example: 'The claim needed empirical evidence, not just a hunch.', challenge: 'Ask someone for empirical proof before accepting a claim today.' },
      { word: 'feasible', ipa: 'FEE-zuh-buhl', pos: 'adjective', def: 'Possible to do; realistic.', example: 'Finishing the report by Friday is feasible if we start now.', challenge: 'Describe a plan of yours as feasible, or not.' },
      { word: 'gregarious', ipa: 'grih-GAIR-ee-us', pos: 'adjective', def: 'Sociable; fond of company.', example: 'His gregarious nature made him the first to greet new coworkers.', challenge: 'Describe someone you meet today as gregarious.' },
      { word: 'incisive', ipa: 'in-SY-siv', pos: 'adjective', def: 'Sharply and clearly expressed; getting to the point fast.', example: 'Her incisive question exposed the flaw in the plan immediately.', challenge: 'Ask one incisive question in a meeting or conversation.' },
      { word: 'judicious', ipa: 'joo-DISH-us', pos: 'adjective', def: 'Showing good judgment; sensible and careful.', example: 'A judicious use of the budget kept the project on track.', challenge: 'Call a decision you make today judicious.' },
      { word: 'meticulous', ipa: 'muh-TIK-yuh-lus', pos: 'adjective', def: 'Very careful and precise about details.', example: 'The technician was meticulous, double-checking every wire before closing the panel.', challenge: 'Describe your own work today as meticulous, if it is.' },
    ],
  },
  {
    name: 'Journeyman',
    words: [
      { word: 'austere', ipa: 'aw-STEER', pos: 'adjective', def: 'Plain, severe, without luxury.', example: "The monastery's austere rooms had nothing but a bed and a desk.", challenge: 'Describe a space or meal today as austere.' },
      { word: 'cacophony', ipa: 'kuh-KAH-fuh-nee', pos: 'noun', def: 'A harsh mixture of loud sounds.', example: 'The office turned into a cacophony of ringing phones and alarms.', challenge: 'Use it to describe noise around you today.' },
      { word: 'deference', ipa: 'DEF-er-uns', pos: 'noun', def: "Respectful yielding to someone else's judgment.", example: 'Out of deference to her mentor, she waited before sharing her own idea.', challenge: "Show deference to someone's opinion on purpose, and name it." },
      { word: 'ephemeral', ipa: 'ih-FEM-er-ul', pos: 'adjective', def: 'Lasting a very short time.', example: 'The excitement over the new app felt ephemeral once the bugs appeared.', challenge: 'Call something today ephemeral — a mood, a trend, a snack.' },
      { word: 'fastidious', ipa: 'fa-STID-ee-us', pos: 'adjective', def: 'Extremely attentive to detail; hard to please.', example: 'He was fastidious about how the shelves were organized — alphabetically and by color.', challenge: 'Describe someone (or yourself) as fastidious about one specific thing.' },
      { word: 'garrulous', ipa: 'GAIR-uh-lus', pos: 'adjective', def: 'Excessively talkative, especially about trivial things.', example: "The garrulous cab driver talked the entire ride without pausing for breath.", challenge: 'Notice and name a garrulous moment in conversation.' },
      { word: 'hackneyed', ipa: 'HAK-need', pos: 'adjective', def: 'Overused, unoriginal, cliché.', example: "The pitch leaned on hackneyed phrases like 'game-changer' and 'synergy.'", challenge: 'Point out a hackneyed phrase you hear today.' },
      { word: 'iconoclast', ipa: 'eye-KAH-nuh-klast', pos: 'noun', def: 'Someone who challenges established beliefs or institutions.', example: 'The young architect was an iconoclast, rejecting every rule of the old style.', challenge: 'Call someone (respectfully) an iconoclast for breaking convention.' },
      { word: 'juxtapose', ipa: 'JUHK-stuh-pohz', pos: 'verb', def: 'To place two things side by side to compare or contrast.', example: 'The exhibit juxtaposed old photographs with modern ones of the same street.', challenge: 'Juxtapose two things out loud today — old vs new, plan A vs B.' },
      { word: 'laconic', ipa: 'luh-KAH-nik', pos: 'adjective', def: 'Using very few words.', example: 'His laconic reply — just "sure" — left everyone guessing what he meant.', challenge: 'Give a laconic answer on purpose, then note how it landed.' },
    ],
  },
  {
    name: 'Adept',
    words: [
      { word: 'abrogate', ipa: 'AB-ruh-gayt', pos: 'verb', def: 'To formally cancel or do away with a rule or agreement.', example: 'The new manager abrogated the old dress code on his first day.', challenge: "Use it about a rule you'd like to abrogate." },
      { word: 'bellicose', ipa: 'BEL-ih-kohss', pos: 'adjective', def: 'Aggressive, eager for conflict.', example: 'His bellicose tone in the email escalated a small disagreement into a feud.', challenge: 'Describe a tense exchange today as bellicose, if warranted.' },
      { word: 'circumlocution', ipa: 'sur-kum-loh-KYOO-shun', pos: 'noun', def: 'A roundabout way of speaking that avoids the direct point.', example: 'Instead of saying no, she buried the answer in circumlocution.', challenge: 'Notice when someone (or you) uses circumlocution instead of a direct answer.' },
      { word: 'diaphanous', ipa: 'dy-AF-uh-nus', pos: 'adjective', def: 'Light, delicate, and almost see-through.', example: 'Morning fog hung diaphanous over the fields until the sun burned it off.', challenge: 'Describe something thin or sheer today as diaphanous.' },
      { word: 'ebullient', ipa: 'ih-BUL-yent', pos: 'adjective', def: 'Overflowing with enthusiasm or excitement.', example: 'She was ebullient after hearing her proposal got approved.', challenge: 'Describe your own mood as ebullient, if it fits.' },
      { word: 'fecund', ipa: 'FEK-und', pos: 'adjective', def: 'Highly productive or fruitful, often of ideas.', example: 'The brainstorming session proved fecund, producing a dozen usable ideas.', challenge: 'Call a productive stretch of your day fecund.' },
      { word: 'gauche', ipa: 'GOHSH', pos: 'adjective', def: 'Socially awkward or tactless.', example: 'Bringing up salary at the dinner party felt a little gauche.', challenge: 'Note a gauche moment — yours or someone else\'s — gently.' },
      { word: 'hegemony', ipa: 'hih-JEM-uh-nee', pos: 'noun', def: 'Dominance of one group or idea over others.', example: "The report described the company's hegemony over the regional market.", challenge: "Use it to describe one thing's dominance over others today." },
      { word: 'impetuous', ipa: 'im-PECH-oo-us', pos: 'adjective', def: 'Acting quickly without thinking things through.', example: 'Buying the tickets before checking the dates was a bit impetuous.', challenge: 'Describe an impetuous choice — yours or someone else\'s.' },
      { word: 'jocular', ipa: 'JOK-yuh-lur', pos: 'adjective', def: 'Fond of joking; playful in tone.', example: "The jocular tone of the meeting eased everyone's nerves before the pitch.", challenge: 'Describe a jocular exchange you have today.' },
    ],
  },
  {
    name: 'Scholar',
    words: [
      { word: 'anathema', ipa: 'uh-NATH-uh-muh', pos: 'noun', def: 'Something or someone strongly disliked or rejected.', example: "Micromanaging was anathema to the new team lead's whole philosophy.", challenge: "Name something that's anathema to how you like to work." },
      { word: 'bellwether', ipa: 'BEL-weth-er', pos: 'noun', def: 'Something that indicates a coming trend.', example: "Analysts treat the small town's votes as a bellwether for the whole region.", challenge: 'Point out something today that feels like a bellwether.' },
      { word: 'chimerical', ipa: 'ky-MER-ih-kul', pos: 'adjective', def: 'Wildly fanciful or unrealistic, like a fantasy.', example: "The startup's five-year plan sounded chimerical without more funding.", challenge: "Call an idea today chimerical, if it's a stretch." },
      { word: 'dilettante', ipa: 'DIL-uh-tahnt', pos: 'noun', def: 'Someone with a casual, surface-level interest in a subject.', example: 'He called himself a dilettante in wine, enjoying it without studying it deeply.', challenge: 'Use it lightly about a hobby you dabble in.' },
      { word: 'enervate', ipa: 'EN-er-vayt', pos: 'verb', def: 'To drain of energy or strength.', example: 'The humid afternoon enervated the whole crew by 3pm.', challenge: 'Describe what enervates you by the end of today.' },
      { word: 'fatuous', ipa: 'FACH-oo-us', pos: 'adjective', def: 'Silly and pointless in a self-satisfied way.', example: 'The fatuous comment got a laugh but added nothing to the discussion.', challenge: 'Notice a fatuous remark — yours or someone else\'s — without being unkind.' },
      { word: 'gainsay', ipa: 'GAYN-say', pos: 'verb', def: 'To deny or contradict a statement.', example: "No one in the room dared gainsay the founder's numbers.", challenge: 'Gainsay a small claim today, respectfully.' },
      { word: 'hubris', ipa: 'HYOO-bris', pos: 'noun', def: 'Excessive pride or self-confidence.', example: "Skipping the safety review was pure hubris on the manager's part.", challenge: 'Notice a moment of hubris — yours or someone else\'s.' },
      { word: 'ignominious', ipa: 'ig-nuh-MIN-ee-us', pos: 'adjective', def: 'Deserving or causing public shame.', example: 'The product launch ended in an ignominious crash of the entire website.', challenge: 'Describe a small, embarrassing mishap today as ignominious.' },
      { word: 'jejune', ipa: 'jih-JOON', pos: 'adjective', def: 'Naive, simplistic, or lacking substance.', example: "The intern's jejune summary missed every nuance of the report.", challenge: 'Describe an overly simple take on something as jejune.' },
    ],
  },
  {
    name: 'Erudite',
    words: [
      { word: 'abstruse', ipa: 'ab-STROOS', pos: 'adjective', def: 'Difficult to understand; obscure.', example: "The professor's abstruse lecture lost half the class in ten minutes.", challenge: 'Call something abstruse that you had to reread twice today.' },
      { word: 'bifurcate', ipa: 'BY-fer-kayt', pos: 'verb', def: 'To split into two branches or parts.', example: 'The trail bifurcates just past the bridge — one path to the summit, one to the lake.', challenge: 'Use it to describe a decision or path splitting in two.' },
      { word: 'cavil', ipa: 'KAV-il', pos: 'verb', def: 'To raise trivial or unnecessary objections.', example: 'Rather than caviling over font size, they focused on the actual message.', challenge: 'Notice someone caviling over a small detail today.' },
      { word: 'deleterious', ipa: 'del-ih-TEER-ee-us', pos: 'adjective', def: 'Harmful, often in a gradual or subtle way.', example: 'Skipping sleep for a week had a deleterious effect on his focus.', challenge: 'Name something with a deleterious effect on your day.' },
      { word: 'effete', ipa: 'ih-FEET', pos: 'adjective', def: 'Weak, over-refined, lacking vigor.', example: 'The redesign felt effete — all polish and no real function.', challenge: 'Describe something overly delicate or weak as effete.' },
      { word: 'fulminate', ipa: 'FUL-mih-nayt', pos: 'verb', def: 'To complain loudly and angrily.', example: "He fulminated about the delayed train to anyone who'd listen.", challenge: 'Notice someone fulminating about something minor today.' },
      { word: 'gossamer', ipa: 'GAH-suh-mer', pos: 'adjective', def: 'Extremely light, thin, and delicate.', example: 'A gossamer layer of frost covered the windshield at dawn.', challenge: 'Describe something delicate today as gossamer.' },
      { word: 'hortatory', ipa: 'HOR-tuh-tor-ee', pos: 'adjective', def: 'Urging or encouraging action, often in speech.', example: "The coach's hortatory speech at halftime turned the whole game around.", challenge: 'Give a short hortatory pep talk to someone, or yourself.' },
      { word: 'ineffable', ipa: 'in-EF-uh-bul', pos: 'adjective', def: 'Too great or intense to be expressed in words.', example: 'There was an ineffable quality to the sunset that no photo captured.', challenge: 'Describe a moment today as ineffable.' },
      { word: 'irenic', ipa: 'eye-REN-ik', pos: 'adjective', def: 'Promoting peace; conciliatory.', example: 'Her irenic tone defused the argument before it escalated.', challenge: 'Take an irenic approach to a small disagreement today.' },
    ],
  },
  {
    name: 'Lexicographer',
    words: [
      { word: 'captious', ipa: 'KAP-shus', pos: 'adjective', def: 'Eager to point out trivial faults.', example: 'The captious editor flagged every comma before commenting on the actual argument.', challenge: 'Notice a captious comment today, kindly.' },
      { word: 'defenestrate', ipa: 'dee-FEN-uh-strayt', pos: 'verb', def: 'Literally, to throw someone out a window; figuratively, to abruptly remove or dismiss.', example: 'The board defenestrated the CEO within a week of the scandal.', challenge: 'Use it, figuratively, about swiftly cutting something from your plans.' },
      { word: 'equivocate', ipa: 'ih-KWIV-uh-kayt', pos: 'verb', def: 'To use vague language to avoid committing to a clear position.', example: 'Asked for a deadline, he equivocated instead of giving a real date.', challenge: 'Notice when someone (or you) equivocates instead of answering directly.' },
      { word: 'farrago', ipa: 'fuh-RAH-goh', pos: 'noun', def: 'A confused mixture of things.', example: 'The report was a farrago of half-finished ideas and old data.', challenge: 'Describe a messy pile or plan today as a farrago.' },
      { word: 'grandiloquent', ipa: 'gran-DIL-uh-kwent', pos: 'adjective', def: 'Pompous or overblown in speech.', example: 'His grandiloquent toast went on for ten minutes about a simple anniversary.', challenge: 'Notice grandiloquent language somewhere today — an ad, a speech.' },
      { word: 'homily', ipa: 'HAH-muh-lee', pos: 'noun', def: 'A moralizing lecture or sermon-like talk.', example: "The manager's homily about punctuality ran longer than the meeting itself.", challenge: 'Use it about a lecture-y comment you hear or give today.' },
      { word: 'insouciant', ipa: 'in-SOO-see-unt', pos: 'adjective', def: 'Carefree, unconcerned, casually relaxed.', example: 'She gave an insouciant shrug when told the flight was delayed.', challenge: "Describe someone's calm, unbothered reaction as insouciant." },
      { word: 'jeremiad', ipa: 'jer-uh-MY-ad', pos: 'noun', def: 'A long, mournful complaint or lament.', example: 'His jeremiad about the state of the industry lasted the whole car ride.', challenge: 'Notice a jeremiad — yours or a friend\'s — about something minor.' },
      { word: 'kowtow', ipa: 'KOW-tow', pos: 'verb', def: 'To act in an excessively submissive way toward someone.', example: "He refused to kowtow to the client's last-minute, unreasonable demands.", challenge: 'Notice a moment today when someone kowtows, or you choose not to.' },
      { word: 'lugubrious', ipa: 'loo-GOO-bree-us', pos: 'adjective', def: 'Mournful or gloomy, often exaggeratedly so.', example: 'The lugubrious violin music set an odd tone for a birthday party.', challenge: 'Describe an overly gloomy mood or song today as lugubrious.' },
    ],
  },
];

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
