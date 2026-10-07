# For you, darling ♡

A personal, animated web presentation for your first monthsary. Your thirteen photos and letter with your requested edits are included. This is an interactive website, not an exported MP4.

## Preview

Double-click `index.html` to open it in your browser. No installation or build is required. Tap **Open your surprise** to start. It works on phones and computers.

## Your soundtrack

Your supplied **A Thousand Years** MP3 is included in `assets/a-thousand-years.mp3` and already connected in `music.js`. Tap **Open your surprise** to start the presentation and music together.

To replace the song later, replace the file in `assets/`, or update this line in `music.js`:

```js
window.SOUNDTRACK = "assets/a-thousand-years.mp3";
```

Audio starts with the opening tap, as browsers require a user gesture.

The song plays in the background with no music settings or file picker on the page. Keep the included MP3 in the repository so the music works for your girlfriend too.

The song loops if the presentation runs longer than the recording. Pause/resume controls both music and scenes. Dragging the presentation slider backward or forward moves the music to the same displayed time, while preserving whether playback is paused or playing. Replay starts both from the beginning. Quick is selected by default on every page load. Changing reading pace updates the displayed time and aligns the song to it, preserving the song's natural pitch and speed. Use your device volume controls to adjust the sound.

## Deploy through GitHub to Vercel

1. Create a GitHub repository and upload **the contents of this folder** at the repository root: `index.html`, `styles.css`, `app.js`, `letter.js`, `music.js`, `vercel.json`, and `assets/`.
2. In Vercel, choose **Add New → Project**, then import that GitHub repository.
3. Select **Other** as the framework preset. There is no build command. The output directory is `.`; `vercel.json` already supplies these settings.
4. Click **Deploy**. Open the resulting link on your phone and test the first tap, music, and scene controls before sending it.

If you upload the entire `monthsary` folder instead of its contents, set Vercel's Root Directory to `monthsary`.

Vercel guide: https://vercel.com/docs/builds/configure-a-build

## Automatic slide timing

The 18 scenes use your exact requested durations at the default **Quick** pace. Total: **4 minutes 7 seconds**. Normal and Slow remain optional slower modes. Pause stops the timer. The video scene advances after its requested 18 seconds at Quick.

| Scene | Seconds |
| --- | ---: |
| Happy 1st monthsary, darling! | 14 |
| One month. So many memories. | 19 |
| We keep choosing each other. | 18 |
| Bakit hindi habang buhay? | 9 |
| Just one game. Then you. | 14 |
| From Roblox, to us. | 16 |
| I’m so glad I found you. | 21 |
| You probably don’t even notice. | 16 |
| 11:00 PM. | 15 |
| That kind of happy. | 10 |
| You make me want to be better. | 18 |
| You’re part of my tomorrow. | 9 |
| A life with you in it. | 14 |
| We’re only just beginning. | 11 |
| Remember why we started. | 10 |
| Day and night. | 13 |
| My happiness. My inspiration. | 12 |
| A lifetime to go. | 8 |

## Personalize

"We’re only just beginning." now uses a text-only layout. "You make me want to be better." plays your supplied `assets/inspiration.mp4` clip, muted to preserve the background song. The clip loops while its scene is shown, pauses with the presentation, and follows the scene's position when you scrub.

- `letter.js`: all 18 scenes, headings, and the original letter text.
- `styles.css`: rose colors, typography, photo arrangements, and animation.
- `assets/him.jpg` and `assets/her.jpg`: your supplied photographs, unedited.
- `assets/call-aug22.jpg` and `assets/call-aug25.jpg`: your two video-call memories, shown in full.
- `assets/roblox-1.jpg` and `assets/roblox-2.jpg`: your Roblox screenshots in "From Roblox, to us."
- `assets/scene-memory-1.jpg` through `scene-memory-7.jpg`: your supplied replacement photos. The smiling video-call photo (`scene-memory-1.jpg`) is now in "That kind of happy." The four scenes "One month. So many memories.", "We keep choosing each other.", "Just one game. Then you.", and "Remember why we started." now use text-only layouts.
- `app.js`: reading duration, controls, and player logic.

The full-letter view preserves your wording and order with the requested edits. Text is grouped into paragraphs for readability. **Quick** is the default; **Normal** and **Slow** give more reading time. The time display adjusts to the selected pace. Previous/next arrows, keyboard arrows, and the progress slider all seek the scenes and music to the matching time. The embedded clip also follows its scene position. Keyboard: Space pauses/plays and Left/Right switch scenes when focus is outside a control. Opening a dialog pauses playback; closing it resumes if it was playing. Switching away from the page pauses it.

The site respects reduced-motion preferences, supports light and dark mode, works without external services, and requests no analytics. The noindex setting discourages search indexing; it is not password protection. Anyone with the deployed URL can view it.
