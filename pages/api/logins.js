// pages/api/logins.js

/**
 * Safe in-memory store for demo purposes.
 * Expected POST body:
 * { username: string, passwordMasked: "REDACTED (length: N)", shareWithViewer: true }
 *
 * Server enforces:
 * - shareWithViewer must be true
 * - passwordMasked must be a string that starts with "REDACTED"
 *
 * Only the masked string and username are stored.
 */

let store = []; // newest first
const MAX_ENTRIES = 200;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, passwordMasked, shareWithViewer } = req.body || {};

    // Validate consent flag
    if (!shareWithViewer) {
      return res.status(400).json({
        success: false,
        message: "Rejected: shareWithViewer must be true to store attempts.",
      });
    }

    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ success: false, message: "Invalid username." });
    }

    if (typeof passwordMasked !== "string" || !passwordMasked.startsWith("REDACTED")) {
      return res.status(400).json({
        success: false,
        message: "Invalid passwordMasked format. Must start with 'REDACTED'.",
      });
    }

    // sanitize username
    const cleanUser = username.trim().slice(0, 120).replace(/[\r\n]+/g, " ");

    const entry = {
      username: cleanUser,
      passwordMasked: passwordMasked.slice(0, 80),
      timestamp: Date.now(),
    };

    store.unshift(entry);
    if (store.length > MAX_ENTRIES) store.pop();

    return res.json({ success: true, message: "Stored masked attempt (demo)." });
  }

  if (req.method === "GET") {
    return res.json({ success: true, logins: store.slice(0, MAX_ENTRIES) });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}