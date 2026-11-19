'use strict';

// Our Three-Year Journey. Jasmin & Jorge, an offline-capable anniversary music experience.
// Song-specific timestamps use synchronized LINE starts; the word glow within
// each line is an expressive approximation, not a phoneme-level alignment.
const LYRIC_CUES = [
    { time: 2.41, text: "How could my day be bad when I'm with you?" },
    { time: 7.87, text: "You're the only one who makes me laugh" },
    { time: 13.72, text: "So, how can my day be bad?" },
    { time: 20.53, text: "It's a day for you" },
    { time: 25.58, text: '' },
    { time: 31.13, text: "Lately, life's so boring" },
    { time: 36.08, text: "I've been watching Netflix all day long" },
    { time: 42.25, text: 'I thought there would be' },
    { time: 45.69, text: 'No things left to watch' },
    { time: 48.74, text: 'So I let myself out' },
    { time: 53.26, text: '' },
    { time: 58.09, text: 'When I went to the park' },
    { time: 62.97, text: 'I recognised you at a glance' },
    { time: 70.78, text: 'Face to face, we just smiled' },
    { time: 75.78, text: "We already know that we'll be together" },
    { time: 87.10, text: "How could my day be bad when I'm with you?" },
    { time: 92.43, text: "You're the only one who makes me laugh" },
    { time: 98.47, text: 'So, how can my day be bad?' },
    { time: 105.26, text: "It's a day for you" },
    { time: 110.66, text: 'Oh, baby' },
    { time: 114.13, text: '' },
    { time: 116.31, text: 'Coffee in the morning, you and the sun' },
    { time: 123.74, text: "There's a brown hue in your eyes" },
    { time: 130.62, text: 'How pretty it is' },
    { time: 133.57, text: "I think I'm in love" },
    { time: 137.92, text: '' },
    { time: 171.01, text: 'When I went to the park' },
    { time: 175.95, text: 'I recognised you at a glance' },
    { time: 183.78, text: 'Face to face, we smiled' },
    { time: 187.93, text: 'And I finally held your hands' },
    { time: 196.49, text: "How could my day be bad when I'm with you?" },
    { time: 201.95, text: "You're the only one who makes me laugh" },
    { time: 207.96, text: 'So, how can my day be bad?' },
    { time: 214.61, text: "It's a day for you" },
    { time: 220.18, text: 'Oh, baby' },
    { time: 224.67, text: "How could my day be bad when I'm with you?" },
    { time: 230.19, text: "You're the only one who gives me love" },
    { time: 236.11, text: 'So, how can my day be bad?' },
    { time: 242.90, text: "It's a day for you" },
    { time: 248.12, text: 'Oh, baby' },
    { time: 254.1, text: '' }
];

const CHAPTERS = [
    { start: 0, title: 'EVERYTHING STARTS SOMEWHERE', quote: "in a world full of noise, you're my favorite song.", caption: 'and somehow, this one became ours.', bottom: 'somewhere between all the days, there was you.', color: '#efb8ae' },
    { start: 31, title: 'THE ORDINARY DAYS', quote: 'the little things became the best things.', caption: 'even quiet days are worth remembering.', bottom: 'somewhere along the way, everything changed.', color: '#b8bed3' },
    { start: 58, title: 'WHEN OUR WORLDS MET', quote: 'and then there was that one beautiful moment.', caption: 'of all the places, of all the people. you.', bottom: 'a thousand roads, and somehow we found each other.', color: '#eeaebd' },
    { start: 116, title: 'THE LITTLE THINGS', quote: 'love looks a lot like the everyday things.', caption: 'coffee mornings and unforgettable afternoons.', bottom: 'the smallest moments always mean the most.', color: '#b9d8c9' },
    { start: 171, title: 'EVERY DAY, YOU', quote: 'if i got to choose, i would always find you.', caption: 'one song ends. our story keeps going.', bottom: 'to all the days we have yet to share.', color: '#f0c2a7' }
];

// Jorge's short personal notes float independently of the song lyrics.
// Timing follows audio.currentTime so pause and seek remain in sync.
const FLOATING_NOTES = [
    { start: 10, duration: 6, text: 'every day feels better with you ♡', side: 'right' },
    { start: 35, duration: 6, text: 'even the quiet days are my favorites', side: 'left' },
    { start: 64, duration: 6, text: 'i am so glad i found you', side: 'right' },
    { start: 94, duration: 6, text: 'your laugh is still my favorite sound', side: 'left' },
    { start: 122, duration: 7, text: 'it is always the little things', side: 'right' },
    { start: 149, duration: 7, text: 'i would choose you again', side: 'left' },
    { start: 182, duration: 6, text: 'my favorite place is beside you', side: 'right' },
    { start: 208, duration: 6, text: 'three years, and still you ♡', side: 'left' },
    { start: 237, duration: 6, text: 'thank you for being my Jasmin', side: 'right' },
    { start: 251, duration: 7, text: 'love, Jorge ♡', side: 'left' }
];

// Rare, clickable paper hearts. Each note is a private message from Jorge.
// The music clock controls when a heart can appear, including after seeking.
const HIDDEN_HEARTS = [
    { start: 21, duration: 13, x: 83, y: 21, note: 'you make the ordinary days feel special, Jasmin.' },
    { start: 54, duration: 12, x: 16, y: 32, note: 'i still get excited about making memories with you.' },
    { start: 85, duration: 13, x: 86, y: 24, note: 'i love how comfortable everything feels with you.' },
    { start: 116, duration: 13, x: 17, y: 19, note: 'i would pick you in every version of this story.' },
    { start: 157, duration: 13, x: 83, y: 32, note: 'three years later and i still love finding new things about you.' },
    { start: 194, duration: 13, x: 15, y: 26, note: 'every photo is another reason to smile.' },
    { start: 231, duration: 13, x: 85, y: 18, note: 'thank you for being here with me. love, Jorge.' }
];

const MEMORY_YEARS = [2024, 2025, 2026];
const DEFAULT_MEMORIES = [
    { year: 2024, date: '2024', title: 'the little beginnings', note: 'Jasmin, here is one of the moments I want to keep close.', image: '' },
    { year: 2024, date: '2024', title: 'a day with you', note: 'I love remembering the little days we share.', image: '' },
    { year: 2024, date: '2024', title: 'one for the scrapbook', note: 'This one belongs in our story, always.', image: '' },
    { year: 2024, date: '2024', title: 'a favorite memory', note: 'One picture, and so much to remember.', image: '' },
    { year: 2024, date: '2024', title: 'the start of more', note: 'And this was only one chapter of us.', image: '' },
    { year: 2025, date: '2025', title: 'another year with you', note: 'Another year of getting to share my days with you.', image: '' },
    { year: 2025, date: '2025', title: 'the simple things', note: 'I want to remember even the ordinary moments with you.', image: '' },
    { year: 2025, date: '2025', title: 'our little adventures', note: 'One more memory for our collection.', image: '' },
    { year: 2025, date: '2025', title: 'my favorite smile', note: 'Some photos deserve to be looked at twice.', image: '' },
    { year: 2025, date: '2025', title: 'still us', note: 'I love how our story keeps growing.', image: '' },
    { year: 2026, date: '2026', title: 'this chapter of us', note: 'I saved this little moment for you.', image: '' },
    { year: 2026, date: '2026', title: 'all these days', note: 'I hope this photo brings a smile to your face.', image: '' },
    { year: 2026, date: '2026', title: 'one more memory', note: 'A tiny part of everything I want to celebrate with you.', image: '' },
    { year: 2026, date: '2026', title: 'our third year', note: 'Three years since our story began on November 20, 2023.', image: '' },
    { year: 2026, date: '2026', title: 'to everything ahead', note: 'And I cannot wait to make more memories with you, Jasmin.', image: '' }
];

const DEFAULT_CONFIG = {
    yourName: 'Jorge',
    theirName: 'Jasmin',
    anniversaryDate: '2023-11-20',
    introMessage: 'i made this little gift just for you ♡',
    letter: "Jasmin, happy third anniversary!\n\nI made this little website for you because I wanted to give you something that holds pieces of our story. Every photo is a moment I want us to remember, and every part of this song reminds me why I love sharing my days with you.\n\nWe started this journey on November 20, 2023. Three years later, I still choose you. Thank you for being you, and for being part of my life.\n\nI hope this gift makes you smile. Here is to all the memories we have made and all the ones still waiting for us.\n\nI love you.",
    lyricOffset: 0,
    floatingNotes: FLOATING_NOTES.map((note) => note.text),
    heartNotes: HIDDEN_HEARTS.map((heart) => heart.note),
    memories: DEFAULT_MEMORIES
};

const HEART_STORAGE_KEY = 'our-three-year-journey-found-hearts-v7';
const STORAGE_KEY = 'our-three-year-journey-config-v2';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const deepCopy = (value) => JSON.parse(JSON.stringify(value));
function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
}
let savedConfig = {};

try {
    savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
} catch (error) {
    savedConfig = {};
}

function normalizeConfig(data) {
    const input = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    const providedMemories = Array.isArray(input.memories) ? input.memories : [];
    let slots = providedMemories;

    // Upgrade old six-frame gifts without shifting 2024, 2025 or 2026 photos
    // into the wrong year. The old 2023 frame is not part of this 15-slot reel.
    if (providedMemories.length > 0 && providedMemories.length <= 6) {
        slots = Array.from({ length: DEFAULT_MEMORIES.length }, () => null);
        const nextSlot = { 2024: 0, 2025: 5, 2026: 10 };
        providedMemories.forEach((oldMemory) => {
            if (!oldMemory || typeof oldMemory !== 'object') return;
            const match = String(oldMemory.year || oldMemory.date || '').match(/20(24|25|26)/);
            const year = match ? Number(match[0]) : 0;
            if (!nextSlot.hasOwnProperty(year)) return;
            const start = MEMORY_YEARS.indexOf(year) * 5;
            if (nextSlot[year] < start + 5) {
                slots[nextSlot[year]] = oldMemory;
                nextSlot[year] += 1;
            }
        });
    }

    const memories = DEFAULT_MEMORIES.map((memory, index) => {
        const provided = slots[index];
        // Years define fixed groups of five. A custom caption/date stays editable.
        return { ...memory, ...(provided && typeof provided === 'object' ? provided : {}), year: memory.year };
    });
    // Keep each timed slot fixed, but allow Jorge to personalize its message.
    // Empty messages intentionally hide that timed note or heart.
    const floatingNotes = FLOATING_NOTES.map((note, index) => {
        const value = Array.isArray(input.floatingNotes) ? input.floatingNotes[index] : undefined;
        return typeof value === 'string' ? value.slice(0, 180) : note.text;
    });
    const heartNotes = HIDDEN_HEARTS.map((heart, index) => {
        const value = Array.isArray(input.heartNotes) ? input.heartNotes[index] : undefined;
        return typeof value === 'string' ? value.slice(0, 220) : heart.note;
    });
    return { ...deepCopy(DEFAULT_CONFIG), ...input, memories, floatingNotes, heartNotes };
}

let config = normalizeConfig({ ...(window.GIFT_CONFIG || {}), ...savedConfig });
const audio = $('#song');
const state = {
    started: false,
    currentCue: -10,
    currentChapter: -10,
    lyricsVisible: true,
    lastLyricUpdate: null,
    activeFloatingNote: -1,
    currentMemory: 0,
    frame: 0,
    opening: false,
    lastPlayerUpdate: -1000,
    lastVisualizerUpdate: -1000,
    volume: .78,
    audioContext: null,
    analyser: null,
    spectrum: null,
    previousFocus: null,
    toastTimeout: null,
    stars: [],
    ripples: [],
    lastBeat: 0,
    lastRender: 0,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    heartIndex: -1,
    foundHearts: loadHeartCollection(),
    heartDismissTimeout: null,
    letterFrame: null,
    letterComplete: false,
    replaying: false,
    replayTimeout: null,
    sceneryBlend: -1,
    photoboothSelections: []
};

// The film has its own clock. Song playback, lyric cues, and seeking never reset it.
const film = {
    frames: [],
    centers: [],
    track: $('#filmReel'),
    viewport: $('#filmWindow'),
    width: 0,
    activeIndex: -1,
    position: 0,
    lastTick: 0,
    holdUntil: 0,
    pointerId: null,
    dragStartX: 0,
    dragStartPosition: 0,
    moved: false,
    ignoreClick: false,
    lastX: NaN,
    lastStatus: ''
};

const canvas = $('#sky');
const ctx = canvas.getContext('2d', { alpha: true });
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

function clamp(number, low, high) {
    return Math.min(high, Math.max(low, number));
}

function formatTime(seconds) {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, '0')}`;
}

function findCue(time) {
    let low = 0;
    let high = LYRIC_CUES.length - 1;
    let result = -1;
    while (low <= high) {
        const mid = (low + high) >> 1;
        if (LYRIC_CUES[mid].time <= time) {
            result = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}

function chapterAt(time) {
    for (let index = CHAPTERS.length - 1; index >= 0; index -= 1) {
        if (time >= CHAPTERS[index].start) {
            return index;
        }
    }
    return 0;
}

function memoryAt() {
    // The selected postcard follows the independent film instead of the song.
    const count = config.memories.length;
    return count ? ((Math.round(film.position) % count) + count) % count : 0;
}

function createWords(line) {
    const fragment = document.createDocumentFragment();
    line.split(/\s+/).filter(Boolean).forEach((word) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        fragment.appendChild(span);
        fragment.appendChild(document.createTextNode(' '));
    });
    return fragment;
}

function cueText(index) {
    const cue = LYRIC_CUES[index];
    return cue && cue.text ? cue.text : '';
}

function animateLyricChange(current, previous, next, oldIndex, newIndex, adjustedTime, force) {
    const stage = $('#lyricArea');
    const lastTime = state.lastLyricUpdate;
    const sequential = newIndex === oldIndex + 1;
    const naturalPlayback = lastTime === null || Math.abs(adjustedTime - lastTime) < 1.1;
    if (force || !state.started || !state.lyricsVisible || state.reducedMotion || !sequential || !naturalPlayback) {
        return false;
    }
    if (typeof current.animate !== 'function') return false;

    // Clone the outgoing line before replacing it, so it can glide up into
    // the previous-line position without causing a jump in the page layout.
    if (current.textContent.trim()) {
        $$('.lyric-ghost').forEach((ghost) => ghost.remove());
        const bounds = current.getBoundingClientRect();
        const stageBounds = stage.getBoundingClientRect();
        const ghost = current.cloneNode(true);
        ghost.removeAttribute('id');
        ghost.classList.remove('has-entered');
        ghost.classList.add('lyric-ghost');
        ghost.style.left = `${bounds.left - stageBounds.left}px`;
        ghost.style.top = `${bounds.top - stageBounds.top}px`;
        ghost.style.width = `${bounds.width}px`;
        ghost.style.height = `${bounds.height}px`;
        ghost.style.margin = '0';
        stage.appendChild(ghost);
        const flying = ghost.animate([
            { transform: 'translate3d(0, 0, 0)', opacity: .88, filter: 'blur(0px)' },
            { transform: 'translate3d(0, -72px, 0)', opacity: 0, filter: 'blur(2px)' }
        ], { duration: 930, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'forwards' });
        flying.onfinish = () => ghost.remove();
        flying.oncancel = () => ghost.remove();
    }
    return true;
}

function updateLyrics(time, force = false) {
    const adjustedTime = time - Number(config.lyricOffset || 0);
    const index = findCue(adjustedTime);
    if (index !== state.currentCue || force) {
        const oldIndex = state.currentCue;
        const text = cueText(index);
        const current = $('#lyricCurrent');
        const previousNode = $('#lyricPrevious');
        const nextNode = $('#lyricNext');
        const glide = animateLyricChange(current, previousNode, nextNode, oldIndex, index, adjustedTime, force);
        if (state.lyricEntrance) {
            state.lyricEntrance.cancel();
            state.lyricEntrance = null;
        }
        state.currentCue = index;
        current.replaceChildren();

        let previous = '';
        let next = '';
        for (let i = index - 1; i >= 0; i -= 1) {
            if (cueText(i)) {
                previous = cueText(i);
                break;
            }
        }
        for (let i = index + 1; i < LYRIC_CUES.length; i += 1) {
            if (cueText(i)) {
                next = cueText(i);
                break;
            }
        }
        previousNode.textContent = previous;
        nextNode.textContent = next;

        if (index === -1) {
            current.textContent = 'Every story has a song.';
        } else if (!text) {
            current.textContent = '';
            previousNode.textContent = '';
            nextNode.textContent = '';
        } else {
            current.appendChild(createWords(text));
        }
        // Incoming line rises while the outgoing line continues upward.
        // The three rows have fixed geometry to avoid layout shifts.
        if (glide) {
            state.lyricEntrance = current.animate([
                { opacity: .10, transform: 'translate3d(0, 56px, 0)', filter: 'blur(2px)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'blur(0px)' }
            ], { duration: 1050, easing: 'cubic-bezier(.16,.78,.18,1)' });
            previousNode.animate([
                { opacity: 0, transform: 'translate3d(0, 30px, 0)' },
                { opacity: .46, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 890, easing: 'cubic-bezier(.2,.75,.2,1)' });
            nextNode.animate([
                { opacity: 0, transform: 'translate3d(0, 21px, 0)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 850, easing: 'cubic-bezier(.2,.75,.2,1)' });
        }
    }
    state.lastLyricUpdate = adjustedTime;

    const cue = LYRIC_CUES[index];
    const wordElements = $$('#lyricCurrent .word');
    if (!cue || !cue.text || !wordElements.length) {
        return;
    }
    const nextCue = LYRIC_CUES[index + 1];
    const lineEnd = nextCue ? Math.min(nextCue.time, cue.time + 7.5) : cue.time + 5;
    const fraction = clamp((adjustedTime - cue.time) / Math.max(.7, lineEnd - cue.time - .3), 0, 1);
    const weighted = wordElements.map((node) => Math.max(.85, Math.sqrt(node.textContent.length)));
    const total = weighted.reduce((sum, weight) => sum + weight, 0);
    let cumulative = 0;
    wordElements.forEach((node, wordIndex) => {
        const beginning = cumulative / total;
        cumulative += weighted[wordIndex];
        const ending = cumulative / total;
        const wordProgress = clamp((fraction - beginning) / Math.max(.001, ending - beginning), 0, 1);
        node.style.setProperty('--word-rise', `${(1 - wordProgress) * .3}em`);
        node.style.setProperty('--word-scale', String(.96 + wordProgress * .04));
        node.style.setProperty('--word-opacity', String(.52 + wordProgress * .48));
        node.classList.toggle('lit', fraction >= ending);
        node.classList.toggle('in-progress', fraction >= beginning && fraction < ending);
    });
}

function easeNote(t) {
    const value = clamp(t, 0, 1);
    return value * value * (3 - 2 * value);
}

function updateFloatingNotes(time) {
    const node = $('#floatingNote');
    if (!state.started) {
        node.style.opacity = '0';
        return;
    }
    const index = FLOATING_NOTES.findIndex((note) => time >= note.start && time < note.start + note.duration);
    if (index < 0) {
        node.style.opacity = '0';
        state.activeFloatingNote = -1;
        return;
    }
    const note = FLOATING_NOTES[index];
    const personalizedText = config.floatingNotes[index];
    if (!personalizedText.trim()) {
        node.style.opacity = '0';
        state.activeFloatingNote = -1;
        return;
    }
    if (index !== state.activeFloatingNote) {
        state.activeFloatingNote = index;
        node.textContent = personalizedText;
        node.dataset.side = note.side;
    }
    const elapsed = time - note.start;
    const progress = elapsed / note.duration;
    const appear = easeNote(elapsed / 1.05);
    const vanish = easeNote((note.duration - elapsed) / 1.5);
    const opacity = .61 * appear * vanish;
    node.style.opacity = opacity.toFixed(3);
    if (state.reducedMotion) {
        node.style.transform = 'none';
    } else {
        const sway = Math.sin(progress * Math.PI * 2.2) * 7;
        const lift = 13 - progress * 32;
        const scale = .91 + .09 * appear;
        node.style.transform = `translate3d(${sway.toFixed(2)}px, ${lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    }
}

function loadHeartCollection() {
    try {
        const stored = JSON.parse(localStorage.getItem(HEART_STORAGE_KEY) || '[]');
        return new Set(Array.isArray(stored) ? stored.filter((index) => Number.isInteger(index) && index >= 0 && index < HIDDEN_HEARTS.length) : []);
    } catch (error) {
        return new Set();
    }
}

function updateHeartCollection() {
    const count = state.foundHearts.size;
    $('#heartProgressCount').textContent = `${count} / ${HIDDEN_HEARTS.length}`;
    $('#heartProgress').setAttribute('aria-label', `${count} of ${HIDDEN_HEARTS.length} little notes found`);
    $('#heartSummary').textContent = `♡ ${count} / ${HIDDEN_HEARTS.length} little notes found${count === HIDDEN_HEARTS.length ? ' ♡ all yours' : ''}`;
    try {
        localStorage.setItem(HEART_STORAGE_KEY, JSON.stringify(Array.from(state.foundHearts)));
    } catch (error) {
        // Browsers in private mode can disallow storage. Collection still works for this visit.
    }
}

function hideHeartNote() {
    clearTimeout(state.heartDismissTimeout);
    const note = $('#secretHeartNote');
    note.classList.remove('visible');
    note.hidden = true;
}

function updateHiddenHearts(time) {
    const heart = $('#secretHeart');
    if (!state.started || state.replaying) {
        heart.hidden = true;
        return;
    }
    const index = HIDDEN_HEARTS.findIndex((item) => time >= item.start && time < item.start + item.duration);
    if (index !== state.heartIndex) {
        state.heartIndex = index;
        hideHeartNote();
    }
    if (index < 0 || state.foundHearts.has(index) || !config.heartNotes[index].trim()) {
        heart.hidden = true;
        return;
    }
    const item = HIDDEN_HEARTS[index];
    heart.style.setProperty('--heart-x', `${item.x}%`);
    heart.style.setProperty('--heart-y', `${item.y}%`);
    heart.hidden = false;
}

function revealHiddenHeart() {
    const index = state.heartIndex;
    if (index < 0 || state.foundHearts.has(index)) return;
    state.foundHearts.add(index);
    updateHeartCollection();
    const heart = $('#secretHeart');
    heart.hidden = true;
    const note = $('#secretHeartNote');
    $('#secretHeartMessage').textContent = config.heartNotes[index];
    note.hidden = false;
    note.classList.remove('visible');
    // Flush layout for the tiny unfolding-paper transition.
    if (state.reducedMotion) {
        note.classList.add('visible');
    } else {
        requestAnimationFrame(() => note.classList.add('visible'));
    }
    clearTimeout(state.heartDismissTimeout);
    state.heartDismissTimeout = setTimeout(hideHeartNote, 8800);
}

function cancelLetterWriting() {
    if (state.letterFrame !== null) {
        cancelAnimationFrame(state.letterFrame);
        state.letterFrame = null;
    }
}

function finishLetterWriting() {
    cancelLetterWriting();
    $('#letterText').textContent = config.letter || DEFAULT_CONFIG.letter;
    $('#letterText').classList.remove('writing');
    $('#letterOverlay .letter-sheet').classList.add('letter-complete');
    $('#skipLetter').hidden = true;
    state.letterComplete = true;
}

function startLetterWriting() {
    cancelLetterWriting();
    state.letterComplete = false;
    const sheet = $('#letterOverlay .letter-sheet');
    const text = $('#letterText');
    sheet.classList.remove('letter-complete');
    const content = Array.from(config.letter || DEFAULT_CONFIG.letter);
    text.textContent = '';
    text.classList.add('writing');
    $('#skipLetter').hidden = false;
    text.scrollTop = 0;
    if (state.reducedMotion || content.length === 0) {
        finishLetterWriting();
        return;
    }
    const totalDuration = clamp(content.length * 37, 7800, 20000);
    let start = null;
    let lastCount = -1;
    const write = (now) => {
        if (start === null) start = now;
        const fraction = clamp((now - start) / totalDuration, 0, 1);
        const count = Math.min(content.length, Math.floor(fraction * content.length));
        if (count !== lastCount) {
            text.textContent = content.slice(0, count).join('');
            text.scrollTop = text.scrollHeight;
            lastCount = count;
        }
        if (fraction < 1) {
            state.letterFrame = requestAnimationFrame(write);
        } else {
            finishLetterWriting();
        }
    };
    state.letterFrame = requestAnimationFrame(write);
}

function replayOurStory() {
    if (state.replaying) return;
    state.replaying = true;
    cancelLetterWriting();
    closeOverlay('letter');
    hideHeartNote();
    $('#secretHeart').hidden = true;
    const veil = $('#replayVeil');
    veil.classList.add('visible');
    // The film keeps its place when the song is replayed.
    // Keep discovered hearts across replays so Jasmin can complete the collection.
    state.heartIndex = -1;
    state.activeFloatingNote = -1;
    // Play in the actual click gesture. This is required for reliable audio
    // playback on phones, which can block playback started inside a timer.
    audio.currentTime = 0;
    playAudio();
    updatePlayer();
    // The first instrumental second accompanies the soft visual rewind.
    const pause = state.reducedMotion ? 30 : 900;
    clearTimeout(state.replayTimeout);
    state.replayTimeout = setTimeout(() => {
        if (!state.reducedMotion) $('#playButton').focus({ preventScroll: true });
        veil.classList.remove('visible');
        state.replaying = false;
    }, pause);
}

function updateChapter(time) {
    const index = chapterAt(time);
    if (index === state.currentChapter) {
        return;
    }
    state.currentChapter = index;
    document.body.dataset.scene = String(index);
    const chapter = CHAPTERS[index];
    setText('#chapterNumber', `CHAPTER ${String(index + 1).padStart(2, '0')} / 05`);
    setText('#chapterName', chapter.title);
    setText('#topQuote', chapter.quote);
    setText('#sceneCaption', chapter.caption);
    setText('#bottomNote', chapter.bottom);
    $$('.chapter-point').forEach((button, i) => {
        button.classList.toggle('active', i === index);
        button.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
}

function fillPhoto(container, index, className) {
    container.replaceChildren();
    const memory = config.memories[index];
    if (memory && memory.image) {
        const img = document.createElement('img');
        img.src = memory.image;
        img.alt = `Photo for ${memory.title}`;
        img.className = className || '';
        container.appendChild(img);
    } else if (container.id === 'postcardPhoto') {
        const backdrop = document.createElement('div');
        backdrop.className = 'photo-sunset';
        const sun = document.createElement('span');
        sun.className = 'sun-disc';
        const horizon = document.createElement('span');
        horizon.className = 'horizon';
        backdrop.append(sun, horizon);
        const label = document.createElement('span');
        label.className = 'placeholder-label';
        label.textContent = 'little moments, big feelings';
        container.append(backdrop, label);
    } else {
        const label = document.createElement('span');
        label.className = 'no-photo';
        label.textContent = 'add a photo to this memory';
        container.appendChild(label);
    }
}

function updateMemory(time, force = false) {
    const index = memoryAt(time);
    if (!force && state.currentMemory === index) return;
    state.currentMemory = index;
    fillPhoto($('#postcardPhoto'), index);
    $('#postcardTitle').textContent = `${config.memories[index].title} ♡`;
    $('#currentMemoryButton').setAttribute('aria-label', `Open memory: ${config.memories[index].title}`);
}

function wrappedFilmPosition(position) {
    const count = config.memories.length;
    return count ? ((position % count) + count) % count : 0;
}

function nearFilmPosition(index, position) {
    const count = config.memories.length;
    if (!count) return 0;
    let delta = index - wrappedFilmPosition(position);
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    return position + delta;
}

function renderFilm() {
    film.track.replaceChildren();
    film.frames = [];
    for (let copy = 0; copy < 3; copy += 1) {
        config.memories.forEach((memory, index) => {
            const frame = document.createElement('button');
            frame.type = 'button';
            frame.className = 'film-frame';
            frame.dataset.frame = String(index);
            if (copy !== 1) {
                frame.tabIndex = -1;
                frame.setAttribute('aria-hidden', 'true');
            }
            frame.setAttribute('aria-label', `Open memory ${index + 1}: ${memory.title}`);
    
            const art = document.createElement('div');
            art.className = `film-frame-art film-art-${index}`;
            if (memory.image) {
                const photo = document.createElement('img');
                photo.src = memory.image;
                photo.alt = '';
                photo.loading = 'lazy';
                photo.decoding = 'async';
                photo.draggable = false;
                art.appendChild(photo);
            } else {
                const mark = document.createElement('span');
                mark.className = 'film-placeholder-mark';
                mark.textContent = '♡';
                art.appendChild(mark);
            }
            const meta = document.createElement('div');
            meta.className = 'film-frame-meta';
            const title = document.createElement('span');
            title.textContent = memory.title;
            const date = document.createElement('small');
            date.textContent = memory.date || `FRAME ${String(index + 1).padStart(2, '0')}`;
            meta.append(title, date);
            frame.append(art, meta);
            frame.addEventListener('click', () => {
                if (film.ignoreClick) return;
                const now = performance.now();
                film.position = nearFilmPosition(index, currentFilmPosition(now));
                film.holdUntil = now + 2600;
                updateFilm(audio.currentTime, performance.now(), true);
                showMemory(index);
            });
            film.frames.push(frame);
            film.track.appendChild(frame);
        });
    }
    film.activeIndex = -1;
    film.lastX = NaN;
    recalculateFilm();
    updateFilm(audio.currentTime, performance.now(), true);
}

function recalculateFilm() {
    if (!film.viewport || film.viewport.clientWidth === 0) return;
    film.width = film.viewport.clientWidth;
    film.centers = film.frames.map((frame) => frame.offsetLeft + frame.offsetWidth / 2);
    film.lastX = NaN;
}

function currentFilmPosition(now) {
    // A separate continuous clock keeps the film at the user's last position.
    // We intentionally do not read audio.currentTime, so a lyric change,
    // seek, pause, or replay can never snap the reel back to another picture.
    if (!film.lastTick) {
        film.lastTick = now;
        return film.position;
    }
    const elapsed = clamp(now - film.lastTick, 0, 80);
    film.lastTick = now;
    const overlayOpen = Boolean(document.querySelector('.overlay:not(.hidden)'));
    if (state.started && film.pointerId === null && now >= film.holdUntil &&
        !state.reducedMotion && !document.hidden && !overlayOpen) {
        const framesPerMillisecond = config.memories.length / 150000;
        film.position += elapsed * framesPerMillisecond;
    }
    return film.position;
}

function updateFilm(time, now = performance.now(), force = false) {
    if (!film.width) recalculateFilm();
    if (!film.width) return;
    if (film.centers.length !== film.frames.length || !film.centers.length) recalculateFilm();
    if (!film.centers.length) return;

    const count = config.memories.length;
    if (!count) return;
    const rawPosition = currentFilmPosition(now);
    const position = count + wrappedFilmPosition(state.reducedMotion ? Math.round(rawPosition) : rawPosition);
    const before = Math.floor(position);
    const after = Math.min(film.centers.length - 1, Math.ceil(position));
    const center = film.centers[before] + (film.centers[after] - film.centers[before]) * (position - before);
    const x = film.width / 2 - center;
    if (force || !Number.isFinite(film.lastX) || Math.abs(x - film.lastX) > .025) {
        film.track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
        film.lastX = x;
    }
    const active = Math.round(position);
    const logicalActive = ((active % count) + count) % count;
    if (force || active !== film.activeIndex) {
        film.activeIndex = active;
        film.frames.forEach((frame, index) => {
            frame.classList.toggle('is-focused', index === active);
            if (index === count + logicalActive) frame.setAttribute('aria-current', 'true');
            else frame.removeAttribute('aria-current');
        });
        const memory = config.memories[logicalActive];
        $('#filmDateLabel').textContent = memory.date || 'A LITTLE MEMORY';
        $('#filmTitleLabel').textContent = memory.title;
        $('#filmFrameCount').textContent = `${String(logicalActive + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
        updateMemory(audio.currentTime);
    }
    const status = film.pointerId !== null ? 'exploring our memories' : now < film.holdUntil ? 'take your time' : 'memories keep rolling';
    if (status !== film.lastStatus) {
        film.lastStatus = status;
        setText('#filmMotionLabel', status);
    }
}

function setupFilmGestures() {
    film.viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (!film.centers.length) recalculateFilm();
        film.pointerId = event.pointerId;
        film.dragStartX = event.clientX;
        film.dragStartPosition = currentFilmPosition(performance.now());
        film.holdUntil = Infinity;
        film.moved = false;
        // Capture only after an actual drag; capturing a tap would steal the frame click.
    });
    film.viewport.addEventListener('pointermove', (event) => {
        if (event.pointerId !== film.pointerId) return;
        const dx = event.clientX - film.dragStartX;
        if (Math.abs(dx) > 6 && !film.moved) {
            film.moved = true;
            film.viewport.setPointerCapture(event.pointerId);
        }
        if (!film.moved) return;
        const stride = film.centers.length > 1 ? film.centers[1] - film.centers[0] : 180;
        film.position = film.dragStartPosition - dx / Math.max(1, stride);
        updateFilm(audio.currentTime, performance.now());
    });
    const release = (event) => {
        if (event.pointerId !== film.pointerId) return;
        film.pointerId = null;
        film.holdUntil = performance.now() + (film.moved ? 2200 : 180);
        if (film.moved) {
            film.ignoreClick = true;
            // Suppress the synthetic click dispatched at the end of a swipe.
            setTimeout(() => { film.ignoreClick = false; }, 100);
        }
        film.moved = false;
        updateFilm(audio.currentTime, performance.now(), true);
    };
    film.viewport.addEventListener('pointerup', release);
    film.viewport.addEventListener('pointercancel', release);
    film.viewport.addEventListener('lostpointercapture', (event) => {
        if (film.pointerId === event.pointerId) release(event);
    });
}

// Only feature real uploaded photos, never substitute stock photos for personal memories.
function updateMemoryEcho(time) {
    let featured = -1;
    if (time >= 74 && time < 81) featured = 7;
    if (time >= 187 && time < 195) featured = 12;
    const echo = $('#memoryEcho');
    if (featured >= 0 && config.memories[featured].image && state.started) {
        const photo = $('#memoryEchoPhoto');
        if (echo.dataset.memory !== String(featured)) {
            photo.src = config.memories[featured].image;
            echo.dataset.memory = String(featured);
        }
        echo.classList.add('visible');
    } else {
        echo.classList.remove('visible');
    }
}

// The background follows audio.currentTime, so seeking, pausing and replaying
// all produce the correct light. Crossfades overlap instead of switching panels.
function updateDayNightScenery(time) {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 263.34;
    const fraction = clamp(time / duration, 0, 1);
    if (Math.abs(state.sceneryBlend - fraction) < 0.0015) return;
    state.sceneryBlend = fraction;
    const panels = $$('.scenery-panel');
    const segment = fraction * (panels.length - 1);
    const first = Math.min(panels.length - 1, Math.floor(segment));
    const raw = segment - first;
    const blend = raw * raw * (3 - 2 * raw);
    panels.forEach((panel, index) => {
        let opacity = 0;
        if (index === first) opacity = 1 - blend;
        if (index === first + 1) opacity = blend;
        panel.style.opacity = opacity.toFixed(3);
    });
    // The paper tone stays legible while dusk slowly cools into evening.
    document.documentElement.style.setProperty('--v7-night', String(clamp((fraction - .62) / .38, 0, 1).toFixed(3)));
}

function updatePlayer() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 263.34;
    const time = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const percentage = clamp(time / Math.max(1, duration) * 100, 0, 100);
    $('#seekBar').max = String(duration);
    $('#seekBar').value = String(time);
    $('#seekBar').style.setProperty('--value', `${percentage}%`);
    $('#currentTime').textContent = formatTime(time);
    $('#totalTime').textContent = formatTime(duration);
    const playing = !audio.paused && !audio.ended;
    $('#playButton .icon-pause').classList.toggle('hidden', !playing);
    $('#playButton .icon-play').classList.toggle('hidden', playing);
    $('#playButton').setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    $('.dock-vinyl').classList.toggle('spinning', playing);
    document.body.classList.toggle('music-playing', playing);
    updateLyrics(time);
    updateFloatingNotes(time);
    updateHiddenHearts(time);
    updateDayNightScenery(time);
    updateChapter(time);
    updateMemory(time);
    updateFilm(time);
    updateMemoryEcho(time);
}

function showToast(message) {
    clearTimeout(state.toastTimeout);
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('visible');
    state.toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2900);
}

function persistConfig() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        return true;
    } catch (error) {
        showToast('Your browser storage is full. Export the gift configuration to preserve it.');
        return false;
    }
}

function applyConfig() {
    $$('[data-recipient]').forEach((node) => node.textContent = config.theirName || 'Jasmin');
    $$('[data-sender]').forEach((node) => node.textContent = config.yourName || 'Jorge');
    document.title = `Our Three-Year Journey | From ${config.yourName || 'Jorge'} to ${config.theirName || 'Jasmin'}`;
    setText('#memoryFrom', `love, ${config.yourName || 'Jorge'} ♡`);
    $('#introMessage').textContent = config.introMessage || DEFAULT_CONFIG.introMessage;
    if (!$('#letterOverlay').classList.contains('hidden') && state.letterComplete) {
        $('#letterText').textContent = config.letter || DEFAULT_CONFIG.letter;
    }
    $('#letterFrom').textContent = `${config.yourName || 'Jorge'} ♡`;
    $('.letter-greeting').textContent = `to ${config.theirName || 'Jasmin'},`;
    if (config.anniversaryDate) {
        const start = new Date(`${config.anniversaryDate}T00:00:00`);
        const today = new Date();
        if (Number.isFinite(start.getTime())) {
            const days = Math.max(0, Math.floor((today - start) / 86400000));
            const anniversary = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric' }).format(start).toUpperCase();
            setText('#introDateText', `${anniversary} • ${days.toLocaleString()} DAYS TOGETHER`);
            $('#introAnniversary').textContent = anniversary;
            setText('#headerAnniversary', anniversary);
        }
    } else {
        setText('#introDateText', 'ONE SONG. OUR STORY.');
        $('#introAnniversary').textContent = 'THE DAY OUR STORY BEGAN';
        setText('#headerAnniversary', 'OUR ANNIVERSARY');
    }
    updateMemory(audio.currentTime, true);
    renderFilm();
    updateMemoryEcho(audio.currentTime);
    updateLyrics(audio.currentTime, true);
}

async function initializeAudio() {
    if (state.audioContext) {
        if (state.audioContext.state === 'suspended') {
            await state.audioContext.resume();
        }
        return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
        state.audioContext = new AudioContextClass();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 512;
        state.analyser.smoothingTimeConstant = .84;
        state.spectrum = new Uint8Array(state.analyser.frequencyBinCount);
        const source = state.audioContext.createMediaElementSource(audio);
        source.connect(state.analyser);
        state.analyser.connect(state.audioContext.destination);
        await state.audioContext.resume();
    } catch (error) {
        console.warn('Audio reactive visualizer unavailable:', error);
    }
}

async function playAudio() {
    try {
        // Invoke play() directly in the user's click gesture for mobile browsers.
        const playback = audio.play();
        await initializeAudio();
        await playback;
        updatePlayer();
    } catch (error) {
        showToast('Could not play the track. Check the MP3 file or your browser audio permissions.');
    }
}

function enterExperience() {
    if (state.started || state.opening) return;
    state.opening = true;
    const intro = $('#intro');
    const button = $('#beginButton');
    button.disabled = true;
    intro.classList.add('unwrapping');

    // Start audio within the initiating user gesture so browsers permit playback.
    playAudio();

    const reduced = state.reducedMotion;
    window.setTimeout(() => {
        state.started = true;
        $('#app').classList.remove('hidden');
        $('#app').setAttribute('aria-hidden', 'false');
        recalculateFilm();
        updateFilm(audio.currentTime, performance.now(), true);
        intro.classList.add('intro-leaving');
        window.setTimeout(() => {
            intro.classList.add('hidden');
            state.opening = false;
            button.disabled = false;
            button.focus({ preventScroll: true });
        }, reduced ? 30 : 700);
    }, reduced ? 40 : 1350);
}

function showIntro() {
    cancelLetterWriting();
    clearTimeout(state.replayTimeout);
    state.replaying = false;
    $('#replayVeil').classList.remove('visible');
    hideHeartNote();
    $('#secretHeart').hidden = true;
    audio.pause();
    audio.currentTime = 0;
    state.started = false;
    state.opening = false;
    $('#intro').classList.remove('hidden', 'intro-leaving', 'unwrapping');
    $('#beginButton').disabled = false;
    $('#app').classList.add('hidden');
    $('#app').setAttribute('aria-hidden', 'true');
    // Going home does not discard the memory the visitor was exploring.
    film.lastTick = performance.now();
    film.activeIndex = -1;
    updatePlayer();
}

function openOverlay(name) {
    const overlay = $(`#${name}Overlay`);
    if (!overlay) return;
    state.previousFocus = document.activeElement;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const close = overlay.querySelector('.close-button');
    if (close) close.focus();
}

function closeOverlay(name) {
    if (name === 'letter') cancelLetterWriting();
    const overlay = $(`#${name}Overlay`);
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    if ($$('.overlay:not(.hidden)').length === 0) {
        document.body.classList.remove('modal-open');
    }
    if (state.previousFocus && document.contains(state.previousFocus)) {
        state.previousFocus.focus();
    }
}

function makeMemoryCard(index) {
    const memory = config.memories[index];
    const button = document.createElement('button');
    button.className = 'memory-card';
    button.type = 'button';
    button.style.setProperty('--rotate', `${[-2, 2, -1, 2.5, -2, 1][index % 6]}deg`);
    button.setAttribute('aria-label', `Open memory ${index + 1}: ${memory.title}`);
    const art = document.createElement('div');
    art.className = 'memory-card-art';
    const palettes = [['#8d9fb3','#ddafb1'], ['#baa3b8','#d8ae9a'], ['#769e9f','#d4b5a5'], ['#ae8190','#bcaeb7'], ['#788ba2','#d9a3a8'], ['#9da2c0','#d6b7a8']];
    art.style.setProperty('--memory-a', palettes[index % palettes.length][0]);
    art.style.setProperty('--memory-b', palettes[index % palettes.length][1]);
    if (memory.image) {
        const img = document.createElement('img');
        img.src = memory.image;
        img.alt = '';
        art.appendChild(img);
    } else {
        const glyph = document.createElement('span');
        glyph.textContent = '♡';
        art.appendChild(glyph);
    }
    const foot = document.createElement('div');
    foot.className = 'memory-card-foot';
    const title = document.createElement('strong');
    title.textContent = memory.title;
    const number = document.createElement('span');
    number.textContent = `${memory.year} / ${String(index % 5 + 1).padStart(2, '0')}`;
    foot.append(title, number);
    button.append(art, foot);
    button.addEventListener('click', () => {
        closeOverlay('memories');
        showMemory(index);
    });
    return button;
}

function renderMemories() {
    const grid = $('#memoryGrid');
    grid.replaceChildren();
    MEMORY_YEARS.forEach((year) => {
        const group = document.createElement('section');
        group.className = 'memory-year-section';
        const heading = document.createElement('h3');
        heading.className = 'memory-year-title';
        heading.textContent = String(year);
        const cards = document.createElement('div');
        cards.className = 'memory-year-grid';
        config.memories.forEach((memory, index) => {
            if (memory.year === year) cards.appendChild(makeMemoryCard(index));
        });
        group.append(heading, cards);
        grid.appendChild(group);
    });
}

function showMemory(index) {
    const memory = config.memories[index];
    $('#singleMemoryHeading').textContent = memory.title;
    $('#singleMemoryNote').textContent = memory.note;
    $('#singleMemoryNumber').textContent = `${memory.year} / MEMORY ${String(index % 5 + 1).padStart(2, '0')} OF 05`;
    fillPhoto($('#singleMemoryPhoto'), index);
    openOverlay('singleMemory');
}

function makePhotoEditor(memory, index) {
    const editor = document.createElement('div');
    editor.className = 'photo-editor';
    const thumb = document.createElement('div');
    thumb.className = 'photo-editor-thumb';
    thumb.id = `photoThumb${index}`;
    if (memory.image) {
        const img = document.createElement('img');
        img.src = memory.image;
        img.alt = '';
        thumb.appendChild(img);
    } else {
        const glyph = document.createElement('span');
        glyph.textContent = '♡';
        thumb.appendChild(glyph);
    }
    const fields = document.createElement('div');
    fields.className = 'photo-editor-fields';
    const titleLabel = document.createElement('label');
    titleLabel.textContent = `${memory.year} PHOTO ${index % 5 + 1}. TITLE`;
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = memory.title;
    titleInput.maxLength = 70;
    titleInput.id = `memoryTitle${index}`;
    titleLabel.appendChild(titleInput);
    const noteLabel = document.createElement('label');
    noteLabel.textContent = 'LOVE NOTE';
    const noteInput = document.createElement('input');
    noteInput.type = 'text';
    noteInput.value = memory.note;
    noteInput.maxLength = 300;
    noteInput.id = `memoryNote${index}`;
    noteLabel.appendChild(noteInput);
    const fileLabel = document.createElement('label');
    fileLabel.textContent = 'PHOTO (OPTIONAL)';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.setAttribute('aria-label', `Photo for memory ${index + 1}`);
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            config.memories[index].image = compressed;
            const image = document.createElement('img');
            image.src = compressed;
            image.alt = '';
            thumb.replaceChildren(image);
            showToast('Photo prepared. Click Save our story to keep it.');
        } catch (error) {
            showToast('This image could not be loaded. Try a JPG or PNG.');
        }
    });
    fileLabel.appendChild(fileInput);
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'DATE / YEAR (OPTIONAL)';
    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.value = memory.date || '';
    dateInput.maxLength = 32;
    dateInput.placeholder = 'e.g. NOV 2023';
    dateInput.id = `memoryDate${index}`;
    dateLabel.appendChild(dateInput);
    fields.append(titleLabel, dateLabel, noteLabel, fileLabel);
    editor.append(thumb, fields);
    return editor;
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('Not an image'));
            return;
        }
        const objectURL = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const maxSize = 850;
                const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
                canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
                const context = canvas.getContext('2d');
                context.fillStyle = '#f5ede5';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/jpeg', .70);
                URL.revokeObjectURL(objectURL);
                resolve(dataURL);
            } catch (error) {
                URL.revokeObjectURL(objectURL);
                reject(error);
            }
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectURL);
            reject(new Error('Could not decode image'));
        };
        image.src = objectURL;
    });
}

// Messages are editable in Settings, while their song timings stay fixed.
// Create elements directly so Jorge's text is always treated as plain text.
function makeMessageEditor(index, value, kind, seconds) {
    const field = document.createElement('label');
    field.className = 'message-editor-field';
    const heading = document.createElement('span');
    heading.className = 'message-editor-label';
    heading.textContent = `${kind === 'floating' ? 'FLOATING NOTE' : 'SECRET HEART'} ${String(index + 1).padStart(2, '0')}  ·  ${formatTime(seconds)}`;
    const input = document.createElement('textarea');
    input.id = `${kind}Message${index}`;
    input.rows = 2;
    input.maxLength = kind === 'floating' ? 180 : 220;
    input.placeholder = 'Leave empty to hide this message';
    input.value = value;
    field.append(heading, input);
    return field;
}

function populateMessageEditors() {
    const floatingContainer = $('#floatingMessageEditors');
    const heartContainer = $('#heartMessageEditors');
    floatingContainer.replaceChildren();
    heartContainer.replaceChildren();
    FLOATING_NOTES.forEach((note, index) => {
        floatingContainer.appendChild(makeMessageEditor(index, config.floatingNotes[index], 'floating', note.start));
    });
    HIDDEN_HEARTS.forEach((heart, index) => {
        heartContainer.appendChild(makeMessageEditor(index, config.heartNotes[index], 'heart', heart.start));
    });
}

function populateSettings() {
    $('#yourName').value = config.yourName;
    $('#theirName').value = config.theirName;
    $('#anniversaryDate').value = config.anniversaryDate;
    $('#messageInput').value = config.introMessage;
    $('#letterInput').value = config.letter;
    $('#lyricsOffset').value = String(config.lyricOffset || 0);
    $('#offsetValue').textContent = `${Number(config.lyricOffset || 0).toFixed(1)}s`;
    populateMessageEditors();
    const photoEditors = $('#photoEditors');
    photoEditors.replaceChildren();
    MEMORY_YEARS.forEach((year, groupIndex) => {
        const details = document.createElement('details');
        details.className = 'photo-year-group';
        details.open = groupIndex === 0;
        const summary = document.createElement('summary');
        summary.textContent = `${year} · 5 photos`;
        const body = document.createElement('div');
        body.className = 'photo-year-editors';
        config.memories.forEach((memory, index) => {
            if (memory.year === year) body.appendChild(makePhotoEditor(memory, index));
        });
        details.append(summary, body);
        photoEditors.appendChild(details);
    });
}

function collectSettings() {
    config.yourName = $('#yourName').value.trim() || 'me';
    config.theirName = $('#theirName').value.trim() || 'you';
    config.anniversaryDate = $('#anniversaryDate').value;
    config.introMessage = $('#messageInput').value.trim() || DEFAULT_CONFIG.introMessage;
    config.letter = $('#letterInput').value.trim() || DEFAULT_CONFIG.letter;
    config.lyricOffset = Number($('#lyricsOffset').value) || 0;
    config.floatingNotes = FLOATING_NOTES.map((_, index) => $(`#floatingMessage${index}`).value.trim().slice(0, 180));
    config.heartNotes = HIDDEN_HEARTS.map((_, index) => $(`#heartMessage${index}`).value.trim().slice(0, 220));
    state.activeFloatingNote = -1;
    hideHeartNote();
    config.memories.forEach((memory, index) => {
        memory.title = $(`#memoryTitle${index}`).value.trim() || DEFAULT_MEMORIES[index].title;
        memory.note = $(`#memoryNote${index}`).value.trim() || DEFAULT_MEMORIES[index].note;
        memory.date = $(`#memoryDate${index}`).value.trim().slice(0, 32);
    });
    applyConfig();
    renderMemories();
    persistConfig();
}

function exportConfigFile() {
    collectSettings();
    const content = `// Personalized gift configuration. generated by Our Three-Year Journey.\nwindow.GIFT_CONFIG = ${JSON.stringify(config, null, 4)};\n`;
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gift-config.js';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast('Exported! Replace gift-config.js in the project with your downloaded file.');
}

function resetConfig() {
    if (!window.confirm('Reset your local names, messages, and photos? Export first to keep a backup.')) return;
    localStorage.removeItem(STORAGE_KEY);
    config = normalizeConfig(window.GIFT_CONFIG || {});
    populateSettings();
    applyConfig();
    renderMemories();
    showToast('Local personalization reset.');
}

function resizeSky() {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const quantity = state.reducedMotion ? 18 : clamp(Math.floor(canvasWidth * canvasHeight / 21000), 38, 105);
    state.stars = Array.from({ length: quantity }, () => ({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 1.35 + .3,
        alpha: Math.random() * .24 + .07,
        speed: Math.random() * .07 + .01,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > .76 ? 12 : 0
    }));
}

function audioEnergy() {
    if (!state.analyser || !state.spectrum || audio.paused) {
        return { bass: 0, mid: 0, high: 0 };
    }
    state.analyser.getByteFrequencyData(state.spectrum);
    const average = (begin, end) => {
        let total = 0;
        for (let i = begin; i < end; i += 1) total += state.spectrum[i];
        return total / Math.max(1, end - begin) / 255;
    };
    return { bass: average(1, 10), mid: average(10, 65), high: average(65, 160) };
}

function renderSky(now, energy) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const time = now * .0002;
    const pulse = energy.bass * 33;
    const cx = canvasWidth * .51;
    const cy = canvasHeight * .45;
    const radius = Math.min(canvasWidth, canvasHeight) * .21;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (let ring = 0; ring < 4; ring += 1) {
        const r = radius * (.65 + ring * .45) + pulse * (ring + 1) * .27;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.48, r * .64, -0.27 + Math.sin(time + ring) * .055, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(93, 117, 133, ${.05 + energy.mid * .06 - ring * .008})`;
        ctx.lineWidth = .7;
        ctx.stroke();
    }

    state.stars.forEach((star, index) => {
        const twinkle = Math.sin(time * 6 + star.phase) * .18;
        const alpha = clamp(star.alpha + twinkle + energy.high * .26, .05, .88);
        const x = star.x + (state.reducedMotion ? 0 : Math.sin(time * 1.1 + star.phase) * (4 + energy.mid * 8));
        const y = ((star.y - (state.reducedMotion ? 0 : now * .006 * star.speed)) % canvasHeight + canvasHeight) % canvasHeight;
        const size = star.size * (1 + energy.bass * .85);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = star.hue ? `rgba(110, 133, 145, ${alpha * .63})` : `rgba(97, 119, 128, ${alpha * .56})`;
        ctx.fill();
        if (index % 31 === 0 && alpha > .44) {
            ctx.strokeStyle = `rgba(87, 111, 125, ${alpha * .2})`;
            ctx.beginPath();
            ctx.moveTo(x - 7, y);
            ctx.lineTo(x + 7, y);
            ctx.moveTo(x, y - 7);
            ctx.lineTo(x, y + 7);
            ctx.stroke();
        }
    });

    const waveBase = canvasHeight * .86;
    for (let layer = 0; layer < 4; layer += 1) {
        ctx.beginPath();
        for (let x = 0; x <= canvasWidth + 15; x += 12) {
            const phase = x / (170 + layer * 45) + now * .00032 * (layer % 2 ? -1 : 1);
            const y = waveBase + layer * 13 + Math.sin(phase * 2.3) * (10 + layer * 2 + energy.bass * 26) + Math.cos(phase * .9) * 7;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(101, 126, 140, ${.08 - layer * .012 + energy.mid * .06})`;
        ctx.lineWidth = layer === 0 ? 1.1 : .7;
        ctx.stroke();
    }
    ctx.restore();
}

function animate(now) {
    state.frame = requestAnimationFrame(animate);
    // Cap animation redraws at ~30 FPS and control updates at ~20 FPS.
    // This avoids unnecessary DOM writes on high-refresh-rate devices.
    if (document.hidden) return;
    // Move the lightweight film transform at display refresh rate; canvas stays capped.
    if (state.started) updateFilm(audio.currentTime, now);
    const frameDelay = state.reducedMotion ? 150 : 33;
    if (now - state.lastRender < frameDelay) return;
    state.lastRender = now;
    const energy = audioEnergy();
    renderSky(now, energy);
    if (state.started && now - state.lastPlayerUpdate >= 48) {
        updatePlayer();
        state.lastPlayerUpdate = now;
    }
    if (now - state.lastVisualizerUpdate >= 70) {
        state.lastVisualizerUpdate = now;
        $$('#miniVisualizer i').forEach((bar, index) => {
            const modulation = Math.sin(now * .005 + index * .65) * .24 + .76;
            bar.style.height = `${3 + energy.mid * modulation * 24 + energy.bass * 9}px`;
        });
    }
}

function positionFilmInCenter() {
    const module = $('#filmModule');
    const experience = $('#experience');
    // Measure untransformed geometry so repeated toggles and resizes stay centered.
    module.style.transform = 'none';
    const moduleRect = module.getBoundingClientRect();
    const experienceRect = experience.getBoundingClientRect();
    module.style.removeProperty('transform');
    const targetY = experienceRect.top + experienceRect.height * .49;
    const offset = targetY - (moduleRect.top + moduleRect.height / 2);
    module.style.setProperty('--film-lift', `${offset.toFixed(2)}px`);
}

function toggleLyricsVisibility() {
    state.lyricsVisible = !state.lyricsVisible;
    if (!state.lyricsVisible) positionFilmInCenter();
    document.body.classList.toggle('lyrics-hidden', !state.lyricsVisible);
    $('#lyricArea').setAttribute('aria-hidden', String(!state.lyricsVisible));
    $('#lyricSecret').tabIndex = state.lyricsVisible ? 0 : -1;
    $('#lyricsButton').classList.toggle('selected', state.lyricsVisible);
    $('#lyricsButton').setAttribute('aria-pressed', String(state.lyricsVisible));
}

function makePhotoboothPreview() {
    const picker = $('#photoboothPicker');
    const slots = $('#photoboothSlots');
    picker.replaceChildren();
    slots.replaceChildren();
    config.memories.forEach((memory, index) => {
        const chosen = state.photoboothSelections.includes(index);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `photobooth-option${chosen ? ' chosen' : ''}`;
        button.setAttribute('aria-pressed', String(chosen));
        button.setAttribute('aria-label', `${chosen ? 'Remove' : 'Choose'} ${memory.title}, ${memory.year}`);
        const picture = document.createElement('span');
        picture.className = 'photobooth-thumb';
        if (memory.image) {
            const img = document.createElement('img');
            img.src = memory.image;
            img.alt = '';
            img.loading = 'lazy';
            picture.append(img);
        } else {
            picture.textContent = '♡';
        }
        const name = document.createElement('span');
        name.textContent = `${index + 1}. ${memory.title}`;
        button.append(picture, name);
        button.addEventListener('click', () => {
            if (chosen) state.photoboothSelections = state.photoboothSelections.filter((item) => item !== index);
            else if (state.photoboothSelections.length < 4) state.photoboothSelections.push(index);
            else { showToast('Choose up to four memories.'); return; }
            makePhotoboothPreview();
        });
        picker.append(button);
    });
    for (let slot = 0; slot < 4; slot += 1) {
        const index = state.photoboothSelections[slot];
        const item = document.createElement('div');
        item.className = 'photobooth-slot';
        if (index !== undefined) {
            const memory = config.memories[index];
            if (memory.image) {
                const img = document.createElement('img');
                img.src = memory.image;
                img.alt = memory.title;
                item.append(img);
            } else {
                const placeholder = document.createElement('span');
                placeholder.textContent = '♡';
                item.append(placeholder);
            }
            const caption = document.createElement('small');
            caption.textContent = memory.date || String(memory.year);
            item.append(caption);
        } else {
            item.textContent = `${slot + 1}`;
            item.classList.add('empty');
        }
        slots.append(item);
    }
    $('#savePhotobooth').disabled = state.photoboothSelections.length !== 4;
    $('#savePhotobooth').textContent = state.photoboothSelections.length === 4 ? 'save our little strip ↓' : `choose ${4 - state.photoboothSelections.length} more ♡`;
}

function loadPhotoboothImage(src) {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = src;
    });
}

async function downloadPhotobooth() {
    if (state.photoboothSelections.length !== 4) return;
    const button = $('#savePhotobooth');
    button.disabled = true;
    button.textContent = 'making your strip...';
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 720;
        canvas.height = 1920;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas unavailable');
        context.fillStyle = '#edf0ee';
        context.fillRect(0, 0, 720, 1920);
        context.fillStyle = '#465b66';
        context.textAlign = 'center';
        context.font = 'bold 28px Quicksand, sans-serif';
        context.fillText('OUR THREE-YEAR JOURNEY', 360, 70);
        const images = await Promise.all(state.photoboothSelections.map((index) => {
            const photo = config.memories[index].image;
            return photo ? loadPhotoboothImage(photo) : Promise.resolve(null);
        }));
        images.forEach((image, position) => {
            const y = 112 + position * 414;
            context.fillStyle = '#d5ddde';
            context.fillRect(54, y, 612, 345);
            if (image && image.width && image.height) {
                const scale = Math.max(612 / image.width, 345 / image.height);
                const width = 612 / scale;
                const height = 345 / scale;
                context.drawImage(image, (image.width - width) / 2, (image.height - height) / 2, width, height, 54, y, 612, 345);
            } else {
                context.fillStyle = '#718895';
                context.font = '62px Caveat, cursive';
                context.fillText('♡', 360, y + 205);
            }
            context.fillStyle = '#4d6370';
            context.font = '22px Quicksand, sans-serif';
            context.fillText(config.memories[state.photoboothSelections[position]].date || String(config.memories[state.photoboothSelections[position]].year), 360, y + 378);
        });
        context.fillStyle = '#485e6a';
        context.font = '52px Caveat, cursive';
        context.fillText(`${config.theirName || 'Jasmin'} & ${config.yourName || 'Jorge'} ♡`, 360, 1812);
        context.font = '22px Quicksand, sans-serif';
        context.fillText('20.11.2023', 360, 1865);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error('Could not render strip');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'jasmin-and-jorge-photobooth.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        showToast('Your four-photo strip is ready ♡');
    } catch (error) {
        showToast('Could not save this strip. Try another set of photos.');
    } finally {
        makePhotoboothPreview();
    }
}

function setUpEvents() {
    $('#beginButton').addEventListener('click', enterExperience);
    $('#homeButton').addEventListener('click', (event) => { event.preventDefault(); showIntro(); });
    $('#playButton').addEventListener('click', () => {
        if (audio.paused) playAudio();
        else audio.pause();
        updatePlayer();
    });
    $('#backwardButton').addEventListener('click', () => audio.currentTime = Math.max(0, audio.currentTime - 10));
    $('#forwardButton').addEventListener('click', () => audio.currentTime = Math.min(audio.duration || 263.34, audio.currentTime + 10));
    $('#seekBar').addEventListener('input', (event) => { audio.currentTime = Number(event.target.value); updatePlayer(); });
    $('#volumeBar').value = String(state.volume);
    $('#volumeBar').style.setProperty('--value', '78%');
    audio.volume = state.volume;
    $('#volumeBar').addEventListener('input', (event) => {
        state.volume = Number(event.target.value);
        audio.volume = state.volume;
        event.target.style.setProperty('--value', `${state.volume * 100}%`);
    });
    $('#lyricsButton').addEventListener('click', toggleLyricsVisibility);
    $('#secretHeart').addEventListener('click', revealHiddenHeart);
    $('#secretHeartClose').addEventListener('click', hideHeartNote);
    $('#skipLetter').addEventListener('click', finishLetterWriting);
    audio.addEventListener('ended', () => { updatePlayer(); hideHeartNote(); openOverlay('letter'); startLetterWriting(); });
    audio.addEventListener('loadedmetadata', updatePlayer);
    audio.addEventListener('error', () => showToast('Audio missing. Keep assets/audio/bad.mp3 beside the website files.'));
    audio.addEventListener('play', updatePlayer);
    audio.addEventListener('pause', updatePlayer);
    $('#fullscreenButton').addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => showToast('Fullscreen is unavailable in this browser.'));
    });
    $$('.chapter-point').forEach((button) => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.chapter);
            audio.currentTime = CHAPTERS[index].start;
            updatePlayer();
        });
    });
    $('#currentMemoryButton').addEventListener('click', () => showMemory(state.currentMemory));
    $('#lyricCurrent').addEventListener('click', () => showMemory(state.currentMemory));
    $('#lyricSecret').addEventListener('click', () => showMemory(state.currentMemory));
    $('#openPhotobooth').addEventListener('click', () => { makePhotoboothPreview(); closeOverlay('memories'); openOverlay('photobooth'); });
    $('#closePhotobooth').addEventListener('click', () => closeOverlay('photobooth'));
    $('#savePhotobooth').addEventListener('click', downloadPhotobooth);
    $('#resetPhotobooth').addEventListener('click', () => { state.photoboothSelections = []; makePhotoboothPreview(); });
    $('#openMemories').addEventListener('click', () => { renderMemories(); openOverlay('memories'); });
    $('#openSettings').addEventListener('click', () => { populateSettings(); openOverlay('settings'); });
    $('#closeMemories').addEventListener('click', () => closeOverlay('memories'));
    $('#closeSingleMemory').addEventListener('click', () => closeOverlay('singleMemory'));
    $('#closeSettings').addEventListener('click', () => closeOverlay('settings'));
    $('#closeLetter').addEventListener('click', () => closeOverlay('letter'));
    $$('[data-close]').forEach((backdrop) => backdrop.addEventListener('click', () => closeOverlay(backdrop.dataset.close)));
    $('#replayButton').addEventListener('click', replayOurStory);
    $('#returnToMemories').addEventListener('click', () => {
        closeOverlay('letter');
        renderMemories();
        openOverlay('memories');
    });
    $('#settingsForm').addEventListener('submit', (event) => {
        event.preventDefault();
        collectSettings();
        closeOverlay('settings');
        showToast('Saved! Your gift for Jasmin is ready.');
    });
    $('#lyricsOffset').addEventListener('input', (event) => {
        $('#offsetValue').textContent = `${Number(event.target.value).toFixed(1)}s`;
    });
    $('#exportConfig').addEventListener('click', exportConfigFile);
    $('#resetConfig').addEventListener('click', resetConfig);
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => { resizeSky(); recalculateFilm(); updateFilm(audio.currentTime, performance.now(), true); if (!state.lyricsVisible) positionFilmInCenter(); }, 120);
    });
    if (!('ontouchstart' in window)) {
        const glow = $('#cursorGlow');
        window.addEventListener('pointermove', (event) => {
            glow.style.left = `${event.clientX}px`;
            glow.style.top = `${event.clientY}px`;
            glow.style.opacity = '1';
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const opened = $$('.overlay:not(.hidden)');
            if (opened.length) {
                closeOverlay(opened[opened.length - 1].id.replace('Overlay', ''));
            }
            return;
        }
        const tag = document.activeElement && document.activeElement.tagName;
        if (event.code === 'Space' && state.started && !$$('.overlay:not(.hidden)').length && !['INPUT','TEXTAREA','BUTTON'].includes(tag)) {
            event.preventDefault();
            if (audio.paused) playAudio();
            else audio.pause();
        }
    });
}

function initialize() {
    const visualizer = $('#miniVisualizer');
    for (let index = 0; index < 15; index += 1) visualizer.appendChild(document.createElement('i'));
    applyConfig();
    renderMemories();
    updateHeartCollection();
    setupFilmGestures();
    setUpEvents();
    resizeSky();
    updatePlayer();
    state.frame = requestAnimationFrame(animate);
}

initialize();
