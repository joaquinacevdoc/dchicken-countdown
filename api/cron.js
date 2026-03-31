import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const TARGET_DATE = new Date('2041-03-30T00:00:00-06:00');

const MILESTONE_EMAILS = {
  14: {
    subject: "14 years until D'Chicken changes everything (no pressure)",
    body: `Hey,

You signed up to wait. And wait you shall.

It's March 30th, which means D'Chicken is officially 14 years away. That's a lot of time to think about crispy, golden, life-altering chicken and fries.

14 years. You could raise a child from birth to teenager. You could watch The Lord of the Rings extended edition roughly 4,380 times. Or you could just wait for D'Chicken.

We recommend the latter.

See you next year (and the 13 after that).

— The D'Chicken Countdown Team`,
  },
  13: {
    subject: "13 years to go — unlucky for some, delicious for all",
    body: `Hey,

Some people fear the number 13. But not us. Not when 13 years from now, D'Chicken opens its doors.

13 years of chicken dreams. 13 years of fry anticipation. 13 years of telling yourself "it'll be worth it."

Spoiler: it will be.

Hang tight. The fryer is patient.

— The D'Chicken Countdown Team`,
  },
  12: {
    subject: "A dozen years to go. Like 12 eggs — but way, way better.",
    body: `Hey,

12 years. A full dozen.

You know what else comes in a dozen? Eggs. But we're not in the egg business. We're in the chicken-that-came-after-the-egg business, and it is going to be extraordinary.

12 years from today, March 30, 2041 — D'Chicken arrives. Crispy outside. Perfect inside. Worth every single day of waiting.

We'll be here. Every March 30th, without fail.

— The D'Chicken Countdown Team`,
  },
  11: {
    subject: "11 years left. The anticipation is already delicious.",
    body: `Hey,

11 years.

We know, we know — still a while. But here's the thing: the wait is part of the flavor. Every passing year is seasoning. Every March 30th reminder is a breadcrumb on the path to the greatest chicken-and-fries experience of your life.

You chose to be here. You subscribed to the countdown. That means you get it.

11 years. Stay hungry.

— The D'Chicken Countdown Team`,
  },
  10: {
    subject: "10 YEARS. A full decade between you and the best chicken of your life.",
    body: `Hey,

TEN. YEARS.

We've officially crossed into single-digit territory — wait, no. We haven't. We have exactly 10 years left. A full, round, humbling decade.

Think about where you were 10 years ago. Now imagine where you'll be in 10 more — standing in front of D'Chicken, ordering something that will rearrange your understanding of what food can be.

Hold on to that image. You've earned it. Well, almost.

10 years, friend. We're in this together.

— The D'Chicken Countdown Team`,
  },
  9: {
    subject: "Only 9 years to wait. You've binge-watched shows longer than this.",
    body: `Hey,

9 years.

That's less than it sounds. You've committed to longer TV series. You've waited longer for sequels. You've been in longer group chats.

D'Chicken in 9 years is practically around the corner. The chicken is already thinking about you.

Keep the faith. Keep the hunger.

— The D'Chicken Countdown Team`,
  },
  8: {
    subject: "8 years left. The fryer is dreaming of you.",
    body: `Hey,

8 years from today, a fryer somewhere in Mexico City will heat up for the very first time — and it will be thinking of you.

Dramatic? Maybe. True? Absolutely.

D'Chicken, March 30, 2041. The chicken and fries that will define a generation. And you've been on this journey since before it was cool.

8 years. Don't waver now.

— The D'Chicken Countdown Team`,
  },
  7: {
    subject: "Lucky 7 — 7 years until D'Chicken. Start stretching your stomach.",
    body: `Hey,

Lucky number 7!

Seven years until D'Chicken opens. Seven years to mentally prepare. Seven years to practice your order so you can say it confidently and without trembling.

Because when the moment finally comes, you'll want to be ready.

Stretch your jaw. Loosen up. We're getting closer.

— The D'Chicken Countdown Team`,
  },
  6: {
    subject: "6 years out. We are entering the final act.",
    body: `Hey,

6 years.

Feel that shift? The vibe is changing. We're no longer in the "long, leisurely wait" phase. We're in the final act now. The part of the movie where things start happening fast.

In 6 years, D'Chicken will be real. Tactile. Edible.

You picked the right chicken to wait for.

— The D'Chicken Countdown Team`,
  },
  5: {
    subject: "FIVE YEARS. Half a decade. Your body is 70% water and 30% anticipation now.",
    body: `Hey,

FIVE. YEARS.

Half a decade. 1,826 days (give or take). Roughly 43,800 hours separating you from D'Chicken.

The chicken is so close you can almost smell it. You can't — it doesn't exist yet — but almost.

Five years ago from today, you had 10 years to wait. Look how far you've come. Look at you. A warrior of patience.

FIVE YEARS. Let's go.

— The D'Chicken Countdown Team`,
  },
  4: {
    subject: "4 years. Fewer than fingers on one hand. D'Chicken is basically here.",
    body: `Hey,

4 years.

Hold out your hand. Count four fingers. That's it. That's all that's left between you and the chicken-and-fries experience of a lifetime.

D'Chicken is no longer a distant dream. It is an approaching reality. A crispy, golden, arriving-soon reality.

We'll see you on the other side.

— The D'Chicken Countdown Team`,
  },
  3: {
    subject: "3 years left. The chicken can smell you from here.",
    body: `Hey,

THREE YEARS.

The chicken knows you're coming. It can feel it. The fries are getting restless.

In exactly 3 years — March 30, 2041 — D'Chicken opens. This is no longer something that might happen. This is something that WILL happen. And you will be there.

3 years. Stay focused. Stay hungry.

— The D'Chicken Countdown Team`,
  },
  2: {
    subject: "2 YEARS. You've waited 12 years for this. Don't blink.",
    body: `Hey,

TWO YEARS.

You have been on this countdown for 12 years. Twelve. You've received 12 of these emails. You've told people about D'Chicken. Maybe they believed you. Maybe they thought you were obsessed.

They were right. And they'll be jealous in two years.

March 30, 2041. 730 days. Do not blink.

— The D'Chicken Countdown Team`,
  },
  1: {
    subject: "ONE YEAR. ONE. UN. UNO. 365 days left.",
    body: `Hey,

ONE YEAR.

ONE.
UN.
UNO.
一.
واحد.

365 days. That's all. After 13 years of waiting, of receiving these emails, of telling anyone who would listen — you are ONE YEAR AWAY from D'Chicken.

The chicken and fries that started as a countdown are about to become real life. Your patience is about to pay off in the most delicious way imaginable.

This is the last time we'll tell you to wait. Next March 30th, the doors open.

We'll see you there.

— The D'Chicken Countdown Team
P.S. Seriously. We'll see you there.`,
  },
};

function getMexicoCityDate(now = new Date()) {
  // America/Mexico_City — use Intl to get current date in that timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year').value, 10);
  const month = parseInt(parts.find(p => p.type === 'month').value, 10);
  const day = parseInt(parts.find(p => p.type === 'day').value, 10);
  return { year, month, day };
}

export default async function handler(req, res) {
  // Security: validate CRON_SECRET
  const authHeader = req.headers['authorization'];
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Test mode: ?test=<yearsLeft> bypasses date check (still requires CRON_SECRET)
  const testYears = req.query?.test ? parseInt(req.query.test, 10) : null;
  const isTestMode = testYears !== null && !isNaN(testYears);

  const { year, month, day } = getMexicoCityDate();

  // Only proceed on March 30 (bypassed in test mode)
  if (!isTestMode && (month !== 3 || day !== 30)) {
    return res.status(200).json({ message: 'Not March 30 in Mexico City. Nothing to do.' });
  }

  // Calculate full years remaining until March 30, 2041
  const yearsLeft = isTestMode ? testYears : 2041 - year;

  // Only send for milestones 1–14
  if (yearsLeft < 1 || yearsLeft > 14) {
    return res.status(200).json({ message: `${yearsLeft} years left — no milestone email for this year.` });
  }

  const milestone = MILESTONE_EMAILS[yearsLeft];
  if (!milestone) {
    return res.status(200).json({ message: `No email template for ${yearsLeft} years left.` });
  }

  // Fetch subscribers from Supabase
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data: subscribers, error: dbError } = await supabase
    .from('countdown_subscribers')
    .select('email');

  if (dbError) {
    console.error('Supabase error:', dbError);
    return res.status(500).json({ error: 'Failed to fetch subscribers', details: dbError.message });
  }

  if (!subscribers || subscribers.length === 0) {
    return res.status(200).json({ message: 'No subscribers found.' });
  }

  // Send emails via Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  const results = [];

  for (const { email } of subscribers) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'D\'Chicken Countdown <hello@dchickencountdown.com>',
        to: email,
        subject: milestone.subject,
        text: milestone.body,
      });

      if (error) {
        console.error(`Failed to send to ${email}:`, error);
        results.push({ email, status: 'failed', error: error.message });
      } else {
        results.push({ email, status: 'sent', id: data.id });
      }
    } catch (err) {
      console.error(`Exception sending to ${email}:`, err);
      results.push({ email, status: 'error', error: err.message });
    }
  }

  const sent = results.filter(r => r.status === 'sent').length;
  const failed = results.filter(r => r.status !== 'sent').length;

  return res.status(200).json({
    message: `Milestone: ${yearsLeft} years left. Sent ${sent}/${subscribers.length} emails.`,
    failed,
    results,
  });
}
