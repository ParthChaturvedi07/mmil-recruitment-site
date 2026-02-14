const sessions = new Map();

export function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, []);
  }
  return sessions.get(userId);
}

export function addMessage(userId, role, content) {
  const history = getSession(userId);
  history.push({ role, content });

  // keep last 12 messages only (important!)
  if (history.length > 12) history.shift();
}
