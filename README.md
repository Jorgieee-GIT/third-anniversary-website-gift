# 3 Years and Counting

A static anniversary dashboard for Jorge and Jasmin. The SVG-wrapped gift opens on November 20, 2026 at 12:00 a.m. Philippine time. The shared clock, anniversary counter, daily note, and meetup all use Philippine time, even when the viewer's device is set to another time zone.

## Preview and host

Open `index.html` on your computer, start VS Code Live Server, or run `npx --yes serve -l 5500` from this folder and visit `http://localhost:5500`. Choose **Preview dashboard** on the gift screen to see the inside before the anniversary. The button is available on local files and loopback addresses.

Use **Make a photocard** beside Memory polaroids to preview a photo with the current soundtrack’s design. Pick a memory or use **+** to choose a photo from your device. Open the site through a local server or its hosted address to save a PNG.

Serve this folder as a static site on Vercel or GitHub Pages. It uses relative asset paths and needs no build command or backend. Once hosted over HTTPS, use the browser's **Add to Home Screen** or **Install** option if available. The SVG app icon and display settings are in `manifest.webmanifest`.

The gift checks the device clock. Serving this folder makes its JavaScript, letters, and media available as static files before the gift opens. Share the hosted link with the intended audience and check that you have permission to redistribute the recordings before publishing.

## Change the content

Edit `config.js` in your editor to update names, the gift note, dates, letters, love notes, weather locations, and tracks. Save your changes and refresh the local preview to see them. **Exit preview** returns you to the regular site. The preview keeps its own meetup settings.

The default meetup uses noon PHT on December 30, 2026. A saved custom meetup takes priority in that browser. **Edit → Use default** restores the configured meetup. The travel estimate and both cities’ weather appear below the countdown.

- **Tracks** use an audio URL, cover and ambience images, a palette, and chronologically sorted `[seconds, "line"]` cues. An empty string marks an instrumental gap. A positive `lyricOffset` delays the lyrics. Duplicate one of the existing track entries to add a song.
- **Letters** use a title and body. Add an optional `link: { url: "https://…", label: "Play voice note" }` for a voice or video attachment.
- **Voicemails** use a title, the date you added them in `YYYY-MM-DD` format, and an audio path. Put each recording in `assets/audio/` and add an entry under `voicemails` in `config.js`. The newest date appears first, and page controls appear once there are two recordings.
- **Memories** use a title, date, caption (`note`), and an optional SVG path or URL (`image`). Empty image fields use the included illustrations. Set `importLegacyGift` to `true` if you want to bring in the previous gift's exported opening note, letter, and matching set of 15 saved memories. Those imported fields take priority while the option is enabled.

Meetup edits stay in the current browser. Live weather uses Open-Meteo and shows the last known reading or an unavailable message when offline.

The dashboard is served by `index.html`, `dashboard.css`, `dashboard.js`, and `config.js`. The older gift scripts and styles remain in the folder as reference.
