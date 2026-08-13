# Hero background — "the call" (second plate)

The hero runs one continuous story over a full-bleed background video. The
first half — Observer captures a session → Blueprint is compiled → Executor
runs it — plays over the existing plate (`/videos/hero.*`: an expert at her
desk at night). The last act is a customer phoning in about the same case,
and it needs its own plate: **a man in a professional workplace, happily
getting his problem solved on the call.** The two crossfade over 1.2s when
the animation reaches the call.

Wire-up is already in place: drop the encodes in `public/videos/` and set
`HERO_VIDEO_CALL` in `app/page.tsx`. Until then the first plate simply holds
for the whole loop.

## What it has to show

**A man on the phone in a professional workplace, visibly pleased with how
the call is going.** Not a call centre, not a headset, not a consumer at
home. Someone at his own desk who rang a supplier's accounts-payable line
about a held invoice and is getting it sorted on the first call — the beat
we want on his face is the turn from braced-for-friction to *"oh — that's
it? Great."*

The character is the **vendor's** AP clerk: the person on the other end of a
business the viewer runs. Mid-30s to mid-50s, business casual, competent and
unremarkable. He should read as a peer of the viewer, not as a model.

**Tone: happy.** Relaxed posture, an easy smile, maybe a small nod or a
short laugh. Warm, not triumphant — the emotion is *relief that this was
easy*, which is precisely the product claim. This is the one place in the
hero where a human face carries feeling, so it has to land; the earlier
plate is deliberately neutral by comparison.

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

A phone held to the ear naturally puts a hand and forearm near the panel
zone. Frame so the hand stays **left** of the panel — subject facing
three-quarter left, phone in his left hand (his right hand is toward camera
and would land under the transcript).

## Motion

Almost none. This plays under text for ~20 seconds and loops forever.

- Locked-off camera, or a very slow push (no more than ~2% over the clip).
- Subject motion: breathing, small head movements, and **one clear beat where
  the smile lands** — a nod, a brightening, a quiet "great". Put it around
  the two-thirds mark, never at the very start or end where the loop
  crossfade sits, or it will be half-dissolved every time it plays.
- No cuts. No whip pans. No rack focus.
- No talking-with-hands, no gesticulation into the panel zone. He can be
  pleased without waving.

## Loop and delivery

- **Length** 12–16s. Long enough not to read as a GIF, short enough to keep
  the file small.
- **Seamless loop.** Same treatment as plate one: hold the last second as a
  crossfade back into the opening frame, so there is no visible seam. The
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
- Legible brand marks — phone, laptop, mug, lanyard, badge.
- A headset or a call-centre floor. This is a man at a desk with a phone.
- Anyone looking at camera.
- Bright practicals or a blown-out window directly behind the panel zone. A
  soft bokeh light is fine; a hot highlight under the transcript is not.
- A bright, evenly-lit corporate stock look. Professional, yes — flat and
  over-lit, no. If the plate is bright the white overlay text dies on it.
- Anything requiring lip-sync. It plays muted forever; the performance should
  read as "listening and reacting" more than "talking".

## Stock alternative

If this is sourced rather than shot, search terms that land close:
*businessman on phone in office smiling*, *man talking on mobile in modern
office window light*, *professional man phone call relieved happy desk*.

Screen every candidate against three things before buying:

1. **Composition** — most stock centres the subject, which puts his face
   straight under the transcript panel. You need him right of centre with
   clear, dark space on the left.
2. **Exposure** — reject anything bright and evenly lit. You want falloff.
3. **The smile** — it has to arrive somewhere in the middle of the clip, not
   be held for the whole duration. A permanent grin reads as stock; a smile
   that *lands* reads as a moment.

A colourist can take a well-composed bright clip down; nobody can move the
subject out from under the panel in post.
