import LEVELS from './wordBank.js';

export function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDateLabel(key) {
    const [y, m, d] = key.split ('-').map(Number);  //DONT GET
    const date = new Date(y, m -1, d);

    return date.toLocaleDateString()(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function resolvePointer(level, pointer) {
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

export function computeStreak(history) {
    const byDate = new Map(history.map((h) => [h.date, h]));
    let streak = 0;
    const cursor = new Date();
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