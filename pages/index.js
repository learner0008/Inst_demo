// pages/index.js
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [share, setShare] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!username.trim() || !password) {
      setMsg("Please enter username and password.");
      return;
    }

    // Mask the password locally before sending: we never transmit raw password.
    const passwordMasked = `REDACTED (length: ${password.length})`;

    const payload = {
      username: username.trim(),
      passwordMasked,
      shareWithViewer: !!share,
    };

    try {
      const res = await fetch("/api/logins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Failed to send login data.");
      } else {
        // Show the Instagram-style error message (same look as screenshot)
        setMsg("ERROR_SIMULATED"); // use special value to render the red multi-line text
        setPassword("");
      }
    } catch (err) {
      setMsg("Network error.");
    }
  }

  return (
    <div className="container">
      {/* Top logo/title area (matches style) */}
      <div className="logo-title">
        <img src="/neutral-logo.svg" alt="Demo logo" className="logo-image" />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Phone number, username, or email</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Phone number, username, or email"
          autoComplete="off"
          spellCheck="false"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="off"
        />

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <label style={{ fontSize: 13 }}>
            <input
              type="checkbox"
              checked={share}
              onChange={(e) => setShare(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Share this attempt with viewer (masked)
          </label>
        </div>

        <button type="submit">Log In</button>
      </form>

      {/* Render messages */}
      {msg && msg !== "ERROR_SIMULATED" && <div className="message">{msg}</div>}

      {/* Render the exact red multi-line error like the screenshot */}
      {msg === "ERROR_SIMULATED" && (
        <div className="screenshot-error">
          <div>Sorry, your username or password is incorrect.</div>
          <div>Please try again.</div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 12 }}>
        <a className="demo-link" href="#">
          Forgot password?
        </a>
      </div>
    </div>
  );
}