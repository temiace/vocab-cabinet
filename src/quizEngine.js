import LEVELS from './wordBank';

// Every word across every level, flattened into one list with its level attached.
// Used as the pool to pull wrong-answer decoys from.
export function allWords() {
    return LEVELS.flatMap((lvl, i) =>
        lvl.words.map((w) => ({ ...w, levelIndex: i, levelName: lvl.name }))
    );
}

// Words the user has actually been shown as a "word of the day" so far:
// every word in levels before their current one, plus everything up to
// (and including) their current pointer in the current level. This is
// deliberately based on level/pointer, not on saved history entries —
// a word counts as "seen" the moment it's shown, whether or not the user
// ever logs whether they used it.
export function seenWords(level, pointer) {
    const seen = [];
    for (let i = 0; i < level - 1; i++) {
        LEVELS[i].words.forEach((w) => seen.push({ ...w, levelIndex: i, levelName: LEVELS[i].name }));
    }
    const current = LEVELS[level - 1];
    for (let i = 0; i <= pointer && i < current.words.length; i++) {
        seen.push({ ...current.words[i], levelIndex: level - 1, levelName: current.name });
    }
    return seen;
}

function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Builds up to `count` multiple-choice questions from words the user has
// already been shown. Each question offers one correct definition and
// three decoys pulled from the full word bank (decoys can come from
// words not yet seen — they're wrong answers, so that's fine).
export function buildQuiz(level, pointer, count = 5) {
    const pool = shuffle(seenWords(level, pointer));
    const chosen = pool.slice(0, Math.min(count, pool.length));
    const everything = allWords();

    return chosen.map((correct) => {
        const decoys = shuffle(everything.filter((w) => w.word !== correct.word)).slice(0, 3);
        const options = shuffle([correct.def, ...decoys.map((d) => d.def)]);
        return {
            word: correct.word,
            pos: correct.pos,
            ipa: correct.ipa,
            correctDef: correct.def,
            options,
        };
    });
}