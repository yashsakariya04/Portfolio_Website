import { createFileRoute } from "@tanstack/react-router";

const TO_EMAIL = "sakariyayash04@gmail.com";

export const Route = createFileRoute("/api/public/notify-contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any = {};
        try { body = await request.json(); } catch { /* ignore */ }
        const { name, email, subject, message } = body ?? {};

        if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string"
          || name.length < 1 || name.length > 200
          || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320
          || message.length < 1 || message.length > 5000) {
          return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
          // Soft success — message is already saved to DB; admin can see it in /admin/messages.
          return Response.json({ ok: true, emailed: false });
        }

        const safeSubject = String(subject ?? "New inquiry").slice(0, 200);
        const escape = (s: string) => s.replace(/[&<>"']/g, (c) =>
          ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]!));
        const html = `
          <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0b0f14;color:#e6edf3;border-radius:12px">
            <h2 style="margin:0 0 16px;color:#22d3ee">New portfolio message</h2>
            <p style="margin:4px 0"><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
            <p style="margin:4px 0"><strong>Subject:</strong> ${escape(safeSubject)}</p>
            <hr style="border:none;border-top:1px solid #1f2937;margin:16px 0" />
            <p style="white-space:pre-wrap;line-height:1.6">${escape(message)}</p>
            <hr style="border:none;border-top:1px solid #1f2937;margin:16px 0" />
            <p style="font-size:12px;color:#94a3b8">Reply directly to this email to respond to ${escape(name)}.</p>
          </div>`;

        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: "Portfolio <onboarding@resend.dev>",
              to: [TO_EMAIL],
              reply_to: email,
              subject: `[Portfolio] ${safeSubject}`,
              html,
            }),
          });
          if (!res.ok) {
            const text = await res.text();
            console.error("Resend failed:", res.status, text);
            return Response.json({ ok: true, emailed: false });
          }
          return Response.json({ ok: true, emailed: true });
        } catch (e) {
          console.error("Resend exception", e);
          return Response.json({ ok: true, emailed: false });
        }
      },
    },
  },
});