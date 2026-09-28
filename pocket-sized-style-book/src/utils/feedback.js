const KEY = "psb_feedback";

export function loadFeedback() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFeedback(entry) {
  try {
    const all = loadFeedback();
    all.push({ ...entry, at: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function summariseFeedback(entries = loadFeedback()) {
  const up = entries.filter((e) => e.helpful).length;
  return {
    total: entries.length,
    up,
    down: entries.length - up,
    satisfaction: entries.length ? up / entries.length : null,
  };
}
