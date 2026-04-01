# D'Chicken Countdown — CLAUDE.md

## What this project is

A countdown website to the opening of D'Chicken restaurant on **March 30, 2041** in Monterrey, Mexico. It also automatically sends annual milestone emails to subscribers every March 30th from 2027 through 2040 (14 emails total, one per year remaining).

---

## Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Static HTML/CSS/JS | Countdown timer display |
| API | Vercel serverless function | Email-sending cron handler |
| Database | Supabase (PostgreSQL) | Stores subscriber emails |
| Email | Resend | Sends transactional emails |
| Scheduler | cron-job.org (free) | Triggers the API daily |
| Hosting | Vercel | Serves frontend + API |

---

## How the email system works

### Scheduling
**cron-job.org** calls the endpoint **every day at 15:00 UTC** (9:00 AM Mexico City CST). It POSTs to `https://dchickencountdown.com/api/cron` with an `Authorization: Bearer <CRON_SECRET>` header.

To set up (one-time):
1. Create a free account at cron-job.org
2. Create a new cron job:
   - **URL:** `https://dchickencountdown.com/api/cron`
   - **Method:** POST
   - **Schedule:** Daily at 15:00 UTC
   - **Header:** `Authorization: Bearer <your CRON_SECRET>`
3. Use "Execute now" to verify it returns a 200 response

### What the API does (api/cron.js)
1. Validates the `CRON_SECRET` in the Authorization header — returns 401 if missing or wrong
2. Gets the current date in **America/Mexico_City timezone** using `Intl.DateTimeFormat`
3. Checks if today is **March 30** — if not, returns early with "Nothing to do today"
4. Calculates `yearsLeft = 2041 - currentYear`
5. If `yearsLeft` is between 1–14, fetches all subscribers from Supabase and sends that year's milestone email via Resend
6. Returns a JSON summary of how many emails were sent/failed

### Email schedule

| Date | Years Left | Email |
|---|---|---|
| March 30, 2027 | 14 | "14 years until D'Chicken changes everything" |
| March 30, 2028 | 13 | "13 years to go" |
| ... | ... | ... |
| March 30, 2040 | 1 | "ONE YEAR. ONE. UN. UNO." |
| March 30, 2041 | 0 | No email (restaurant is open) |

All 14 templates are hardcoded in `MILESTONE_EMAILS` in `api/cron.js`.

### Special cases
- **Test mode**: Hit `POST /api/cron?test=<N>` (with valid auth header) to send any milestone email without waiting for March 30. Valid values: 1–14.
- **April 1, 2026 test**: One-time test email that ran on April 1, 2026 to verify the system before the real emails begin in 2027. Hard-coded to that specific date/year only.

---

## Required environment variables

Set these in **Vercel project settings**:

| Variable | Where needed | Description |
|---|---|---|
| `CRON_SECRET` | Vercel + cron-job.org | Auth token — must match in both places |
| `SUPABASE_URL` | Vercel | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel | Full DB access key (not the anon key) |
| `RESEND_API_KEY` | Vercel | Resend API key |

---

## Database

Supabase table: **`countdown_subscribers`**

Must have at minimum an `email` column. The API queries:
```sql
SELECT email FROM countdown_subscribers;
```

---

## Important notes

- **Scheduler reliability**: cron-job.org runs indefinitely with no repo activity required. Check the execution logs in the cron-job.org dashboard once a year (around March 30) to confirm emails fired.
- **Timezone**: All date logic uses `America/Mexico_City` (CST, UTC-6). March 30 is before Mexico City's DST switch (last Sunday of April), so it is always UTC-6 on that date. 15:00 UTC = 9:00 AM local.
- **Vercel rewrites**: `vercel.json` rewrites all routes to `index.html` for SPA routing. Vercel serverless functions (`/api/*`) take priority over rewrites, so `/api/cron` is unaffected.
- **No double-send protection**: If cron-job.org fires twice on March 30 (e.g., manual trigger + scheduled), emails will be sent twice. Don't trigger manually on March 30 unless testing with `?test=N`.
- **Email format**: Plain text only (no HTML). Emails are sent individually in a loop — not batch/bulk. Fine for small subscriber lists; could hit Resend rate limits with very large lists.
- **Sender address**: `D'Chicken Countdown <hello@dchickencountdown.com>` — this domain must be verified in Resend.

---

## Local development / testing

There is no local dev server setup. To test the cron endpoint:

```bash
curl -X POST "https://dchickencountdown.com/api/cron?test=14" \
  -H "Authorization: Bearer <CRON_SECRET>"
```

Replace `14` with any value 1–14 to test a specific milestone email.
