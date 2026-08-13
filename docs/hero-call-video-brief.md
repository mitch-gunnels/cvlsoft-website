# Hero background — "the message" (second plate)

The hero runs one continuous story over a full-bleed background video. The
first half — Observer captures a session → Blueprint is compiled → Executor
runs it — plays over the existing plate (`/videos/hero.*`: an expert at her
desk at night). The last act is a customer texting in about the same case,
and it needs its own plate: **a man in a professional workplace, happily
getting his problem solved over a text thread.** The two crossfade over 1.2s
when the animation reaches that act.

Wire-up is already in place: drop the encodes in `public/videos/` and set
`HERO_VIDEO_CALL` in `app/page.tsx`. Until then the first plate simply holds
for the whole loop. The constant, the act name (`"call"`) and the delivery
filenames all still say *call* — that is the code's name for the last act,
not a description of the channel. Leave them alone; the wire-up points at
`hero-call.webm` / `hero-call.mp4`.

## What it has to show

**A man texting at his desk in a professional workplace, visibly pleased
with the answer that comes back.** Not a call, not a headset, not a consumer
at home, and never a phone to the ear. Someone at his own desk who messaged
a supplier's accounts-payable line about a held invoice and is getting it
sorted in one exchange — the beat we want on his face is the turn from
braced-for-friction to *"oh — that's it? Great."*

He never speaks. The whole performance is thumbs, eyes, and one smile.

The message he is typing is:

> Hi — invoice 8812 is still showing as held. Can someone look at it?

That is the line the overlay transcript carries at this point, so his typing
should run about that long — one thumbed sentence, not three words and not a
paragraph. **It must never be legible on screen** (see *Do not include*); it
exists so the performance has something real underneath it.

The character is the **vendor's** AP clerk: the person on the other end of a
business the viewer runs. Mid-30s to mid-50s, business casual, competent and
unremarkable. He should read as a peer of the viewer, not as a model.

**Tone: happy.** Relaxed posture, an easy smile, maybe a small nod or a
short laugh. Warm, not triumphant — the emotion is *relief that this was
easy*, which is precisely the product claim. This is the one place in the
hero where a human face carries feeling, so it has to land; the earlier
plate is deliberately neutral by comparison.

## The beat map (load-bearing)

This plate is an arc, not a state, so time it deliberately. On a 14s clip:

| Time | Beat |
|---|---|
| 0:00–0:03 | Phone in hand, thumbing the message. Face neutral, faintly braced. |
| ~0:03 | He sends it. A small settle — thumb lifts, phone held still. |
| 0:03–0:06 | **The wait.** Three seconds of nothing: he holds the phone, glances off, breathes. |
| ~0:06 | The reply lands. Eyes flick back down to the screen. |
| 0:07–0:10 | He reads it. **The smile lands** here, around the two-thirds mark. |
| 0:10–0:14 | Settles. A small nod, back to rest for the loop. |

The three-second wait is doing real work: long enough to read as *waiting*,
short enough that the answer feels immediate. Don't stretch it to five, and
don't cut it to one — an instant reply reads as a canned notification.

## Making it read as a text thread

With no speech and no legible screen, the channel has to come across in
gesture alone, or the plate reads as "man checks his email":

- **Thumb-typing** at the top, clearly — visibly composing, not scrolling.
  Scrolling reads as browsing.
- **The send-and-hold.** After the send he keeps the phone up and still.
  Nobody holds a phone that way unless they are waiting on it.
- **The eye flick.** The reply arriving registers as a change in his
  eyeline, never as a notification we can see.
- Phone held at **chest height or above**, not down near his lap — it has to
  be in frame, and his face has to be lit from the room, not from the screen.

## Environment and grade

**A real professional environment** — an office floor, a meeting room edge,
a warehouse or plant office with glass behind him. Enough depth that it
reads as a workplace, not a set: desks, glazing, another person far out of
focus. It should look like the middle of a working day.

But the plate still has to hold white text and a dark-glass panel on top of
it, so it must be **low-key**, not bright:

- Key from screen-left, soft and directional. Practical fill behind him,
  falling off fast.
- Background exposed **1½–2 stops under** the subject. Depth of field shallow
  enough that everything behind him is soft.
- Grade desaturated with cool shadows. The site's accent is cyan (`#22d3ee`);
  don't fight it — no warm-orange dominance, no teal-and-orange look.
- The frame's left half should fall away to near-black naturally; a scrim is
  applied in CSS on top, but it works best over footage that is already dark
  there rather than being asked to rescue a bright plate.

Daylight through glass is fine and often ideal — put the window behind and to
his left so it rims him and leaves the copy side dark.

## Continuity with plate one

Same visual world, different room and different person. Match the grade,
the shallow depth, and the low-key exposure. Do **not** match the setting —
plate one is a dark late-evening desk, this is a working office by day. The
cut should read as "meanwhile, elsewhere", not as a jump cut.

## Framing (this part is load-bearing)

Delivered 2:1, composed for a 2:1 crop that is anchored **right** (CSS
`object-right`), so anything on the far left will be cropped on tall
viewports. Treat the left third as expendable.

Two protected zones:

| Zone | Where | Requirement |
|---|---|---|
| **Copy** | Left ~45% of frame | Empty or near-black. Headline and buttons sit here over a left-to-right scrim. |
| **Overlay panel** | Right ~28% of frame, from ~30% down to ~92% of height | Dark, low-detail, low-contrast. A translucent dark-glass panel of transcript sits directly on top of it. Faces, hands, bright highlights and busy texture in this zone will fight the text. |

So: **his head above and slightly left of the panel zone; his torso fills the
panel zone.** That is exactly how plate one is composed — the panel sits over
the subject's shoulder and chest, which is the quietest, darkest part of the
frame.

A phone held up puts three things into frame that the transcript panel
cannot survive on top of: a hand, a forearm, and a lit screen. All three
have to stay **left** of the panel zone — subject facing three-quarter left,
phone in his left hand (his right hand is toward camera and would land under
the transcript). Moving thumbs under the panel are worse than a static hand
would be; motion under text is what the eye goes to.

**The screen is a practical.** Angle it away from camera so it reads as a
soft edge-on shape rather than a bright rectangle. A faint lift on his face
and hands is fine and helps sell it — a blown white panel in frame is not,
and a legible screen is a hard no.

## Motion

Almost none beyond the beat map. This plays under text for ~20 seconds and
loops forever.

- Locked-off camera, or a very slow push (no more than ~2% over the clip).
- Subject motion confined to the beats above: breathing, thumbs, one eyeline
  change, one smile, one small nod. **Put the smile around the two-thirds
  mark**, never at the very start or end where the loop crossfade sits, or it
  will be half-dissolved every time it plays.
- No cuts. No whip pans. No rack focus.
- No talking. No talking-with-hands, no gesticulation into the panel zone.
  He can be pleased without waving.
- The phone never goes to his ear — not at the start, not at the end.

## Loop and delivery

- **Length** 12–16s. Long enough to hold the beat map, short enough to keep
  the file small.
- **Seamless loop.** Same treatment as plate one: hold the last second as a
  crossfade back into the opening frame, so there is no visible seam. Because
  this plate travels from neutral to a smile, the last beat has to settle
  back to something close to the opening pose or the dissolve will show. The
  ffmpeg recipe used for the existing plate applies unchanged.
- **Resolution** 2400×1200 master. 2:1 exactly.
- **Encodes** VP9 `.webm` (first choice) **and** H.264 `.mp4` (fallback),
  both **no audio track at all** — not silent audio, no track. Target under
  ~2.5 MB each; the hero is above the fold and this is LCP-adjacent weight.
- **Files** `public/videos/hero-call.webm`, `public/videos/hero-call.mp4`.
- **Poster** not required — the first plate is already painted underneath, so
  there is no flash of empty background while this one buffers.

## Do not include

- On-screen text, UI, dashboards, or anything that reads as a product screen.
  The overlay is the product; the plate is the world.
- **A legible phone screen** — no readable message bubbles, no keyboard, no
  app chrome, no notification banner. The thread lives in the overlay, not
  in his hand.
- Legible brand marks — phone, laptop, mug, lanyard, badge.
- A phone held to the ear, a headset, or a call-centre floor. This is a man
  texting at his own desk.
- Anyone looking at camera.
- Bright practicals or a blown-out window directly behind the panel zone, and
  no phone screen facing camera anywhere near it. A soft bokeh light is fine;
  a hot highlight under the transcript is not.
- A bright, evenly-lit corporate stock look. Professional, yes — flat and
  over-lit, no. If the plate is bright the white overlay text dies on it.
- Anything requiring lip-sync — he does not speak at all. The performance
  reads as "reading and reacting", never as "talking".

## Stock alternative

If this is sourced rather than shot, search terms that land close:
*businessman texting at office desk smiling*, *man looking at phone in modern
office window light*, *professional man reading message on phone relieved
desk*, *office worker typing on smartphone at desk*.

Screen every candidate against four things before buying:

1. **Composition** — most stock centres the subject, which puts his face
   straight under the transcript panel. You need him right of centre with
   clear, dark space on the left, and the phone hand on the far side from
   the panel.
2. **Exposure** — reject anything bright and evenly lit. You want falloff.
   Reject anything where the phone screen is the brightest thing in frame.
3. **The smile** — it has to arrive somewhere in the middle of the clip, not
   be held for the whole duration. A permanent grin reads as stock; a smile
   that *lands* reads as a moment.
4. **The arc** — type → send → wait → read → smile, in one unbroken take.
   This is the hard one: stock phone footage is almost always a single held
   expression. Cutting two clips together is not an option here (no cuts in
   a plate that loops under text), so if nothing carries the arc, shoot or
   generate it. It is five seconds of one man's hands and face.

A colourist can take a well-composed bright clip down; nobody can move the
subject out from under the panel in post.
