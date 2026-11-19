## V10: independent film + album atmosphere

- The Frames of Us reel now has a separate timer. Swiping changes the scroll position permanently rather than pulling it back to the song timestamp.
- A gentle rest after manual swiping or tapping lets the visitor see a memory before the film continues from that exact position.
- Song seeking, pausing and replaying no longer reset the photo reel.
- A layered cream, seafoam, slate and muted-rose album atmosphere enriches the entire background, with soft illustrated contours behind the lyrics.
- Mobile and reduced-motion treatments preserve legibility and performance.

# November 10, 2026

## Added

- Handwritten-style final letter animation synchronized to the song ending, with a skip button and reduced-motion fallback.
- Seven clickable hidden paper hearts that reveal brief romantic notes, follow the audio timeline, and reset after replay.
- A soft rewind/replay screen that starts the song again without reopening the gift.
- `finale-hearts.css` to keep new animations and responsive rules separate.

## Updated

- `app.js`: added heart scheduling, letter writing and replay state; kept the 15-frame film and existing player intact.
- `index.html`: heart note, writing controls, replay transition and stylesheet link.
- `README.md`: setup and customization notes.

## Retained

- Five photo slots per year for 2024, 2025 and 2026.
- Lyric glide, floating messages, lyrics-off centered film, responsive behavior, and exported `gift-config.js`.
- Jorge to Jasmin personalization and the *0.1 flaws and all.* color palette.

## V6: editable little messages

- Added **Floating sentences (10)** and **Hidden heart letters (7)** to Settings.
- Added saved text arrays to the existing personalization and export system, without changing lyric timings.
- Leaving a message blank hides its matching timed note or heart.
- Existing configuration files remain compatible.
- Kept the 15-photo film loop, audio, gift wrap, and animations unchanged.


## V8 downloadable keepsake
- Added a single-photo anniversary keepsake maker from the memory gallery and finale.
- Added 1200×1500 PNG export with an album-inspired paper and faded blue-gray style.
- Uses personalized sender/recipient, anniversary date, and one of 15 memory photos.
- Added responsive card preview, photo selection and optional message.

## V9 Keepsake redesign
- Rebuilt card in blue-gray, slate, sage, cream and muted rose, inspired by the supplied album cover.
- Enlarged the memory photo and removed extra headings, labels and sign-offs.
- Export and preview now use the same high-resolution 1200x1500 canvas.
- Preserved the existing 15-memory chooser and personalized short message.
