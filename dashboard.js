'use strict';

const config = window.ANNIVERSARY_CONFIG;
const isLocalSite = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const isOwnerPreview = isLocalSite && new URLSearchParams(location.search).get('preview') === '1';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const svgNamespace = 'http://www.w3.org/2000/svg';

function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function icon(name) {
    const svg = document.createElementNS(svgNamespace, 'svg');
    const use = document.createElementNS(svgNamespace, 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', '#i-' + name);
    svg.append(use);
    return svg;
}

function image(src, className) {
    const img = create('img', className);
    img.src = src;
    img.alt = '';
    return img;
}

function setIcon(button, name) {
    $('use', button).setAttribute('href', '#i-' + name);
}

const storagePrefix = isOwnerPreview ? 'our-little-orbit-preview:' : 'our-little-orbit:';
const temporaryStorage = new Map();

function saved(key, fallback = null) {
    if (temporaryStorage.has(key)) return temporaryStorage.get(key);
    try {
        const value = localStorage.getItem(storagePrefix + key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

function save(key, value) {
    try {
        if (value === null) localStorage.removeItem(storagePrefix + key);
        else localStorage.setItem(storagePrefix + key, JSON.stringify(value));
        temporaryStorage.delete(key);
    } catch {
        temporaryStorage.set(key, value);
    }
}

const dayMs = 24 * 60 * 60 * 1000;
const dateOptions = { timeZone: config.timeZone };
const calendarDate = new Intl.DateTimeFormat('en-PH', { ...dateOptions, year: 'numeric', month: 'short', day: 'numeric' });
const longDate = new Intl.DateTimeFormat('en-PH', { ...dateOptions, year: 'numeric', month: 'long', day: 'numeric' });
const shortDate = new Intl.DateTimeFormat('en-PH', { ...dateOptions, weekday: 'long', month: 'long', day: 'numeric' });
const phtClock = new Intl.DateTimeFormat('en-PH', { ...dateOptions, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
const meetupFormat = new Intl.DateTimeFormat('en-PH', { ...dateOptions, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
const phtCalendar = new Intl.DateTimeFormat('en-PH', { ...dateOptions, year: 'numeric', month: '2-digit', day: '2-digit' });

function phtDay(time) {
    const parts = Object.fromEntries(phtCalendar.formatToParts(time).map(({ type, value }) => [type, value]));
    return parts.year + '-' + parts.month + '-' + parts.day;
}

function dateInPht(value) {
    if (typeof value !== 'string') return NaN;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return Date.parse(value + 'T00:00:00+08:00');
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return Date.parse(value + ':00+08:00');
    return NaN;
}

function splitTime(ms, roundUp = false) {
    const seconds = (roundUp ? Math.ceil : Math.floor)(Math.max(0, ms) / 1000);
    return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}

function pad(number) {
    return String(number).padStart(2, '0');
}

function counter(counterNode, values, largeUnits) {
    values.forEach((value, index) => {
        const text = index < largeUnits ? String(value) : pad(value);
        if (counterNode[index].textContent !== text) counterNode[index].textContent = text;
    });
}

const anniversaryStart = dateInPht(config.anniversaryDate);
const unlockAt = dateInPht(config.unlockAt);
const [startYear, startMonth, startDay] = config.anniversaryDate.split('-').map(Number);
const anniversaryUnits = $$('#anniversaryCounter b');
const meetupUnits = $$('#meetupCounter b');

function anniversaryIn(year) {
    const lastDayOfMonth = new Date(Date.UTC(year, startMonth, 0)).getUTCDate();
    const day = Math.min(startDay, lastDayOfMonth);
    return dateInPht(year + '-' + pad(startMonth) + '-' + pad(day));
}

function updateClock(now) {
    $('#sharedClock').textContent = phtClock.format(now);
    const thisYear = Number(phtDay(now).slice(0, 4));
    const lastYear = thisYear - Number(anniversaryIn(thisYear) > now);
    const years = Math.max(0, lastYear - startYear);
    counter(anniversaryUnits, [years, ...splitTime(now - anniversaryIn(startYear + years))], 2);
}

const defaultMeetup = { dateTime: config.meetup.dateTime, note: config.meetup.note };
let meetup;
let giftOpened = false;
let lastReasonDay = '';
let shownReason = -1;

function loadMeetup() {
    const value = saved('meetup');
    meetup = Number.isFinite(dateInPht(value?.dateTime)) ? value : defaultMeetup;
    $('#meetupDate').textContent = meetupFormat.format(dateInPht(meetup.dateTime)) + ' PHT';
    $('#meetupNote').textContent = typeof meetup.note === 'string' ? meetup.note : '';
    $('#meetupNote').hidden = !$('#meetupNote').textContent;
    updateMeetup(Date.now());
}

function updateMeetup(now) {
    const deadline = dateInPht(meetup.dateTime);
    const remaining = deadline - now;
    const reached = remaining <= 0;
    const message = $('#meetupReached');
    $('#meetupCounter').hidden = reached;
    message.hidden = !reached;
    if (reached) {
        message.textContent = phtDay(now) === phtDay(deadline) ? 'It’s meetup day!' : 'This meetup has passed.';
    } else {
        counter(meetupUnits, splitTime(remaining, true), 1);
    }
}

function updateReason(now) {
    const today = phtDay(now);
    if (today === lastReasonDay) return;

    lastReasonDay = today;
    const dayIndex = Math.floor(Date.parse(today + 'T00:00:00Z') / dayMs);
    shownReason = ((dayIndex % config.reasons.length) + config.reasons.length) % config.reasons.length;
    $('#dailyReason').textContent = config.reasons[shownReason] || '';
    $('#reasonDate').dateTime = today;
    $('#reasonDate').textContent = shortDate.format(now);
}

function shuffleReason() {
    if (config.reasons.length < 2) return;
    const offset = 1 + Math.floor(Math.random() * (config.reasons.length - 1));
    shownReason = (shownReason + offset) % config.reasons.length;
    $('#dailyReason').textContent = config.reasons[shownReason];
}

function bindMeetup() {
    const dialog = $('#meetupDialog');
    const input = $('#meetupInput');
    const note = $('#meetupNoteInput');
    $('#editMeetup').addEventListener('click', () => {
        input.value = meetup.dateTime.includes('T') ? meetup.dateTime : meetup.dateTime + 'T00:00';
        note.value = meetup.note || '';
        dialog.showModal();
    });
    $('#meetupForm').addEventListener('submit', (event) => {
        event.preventDefault();
        if (!Number.isFinite(dateInPht(input.value))) return;
        save('meetup', { dateTime: input.value, note: note.value.trim() });
        loadMeetup();
        dialog.close();
    });
    $('#resetMeetup').addEventListener('click', () => {
        save('meetup', null);
        loadMeetup();
        dialog.close();
    });
    $('#meetupTravel').textContent = '≈ ' + config.meetup.distanceKm + ' km · ' + config.meetup.travelHours + ' hrs via ' + config.meetup.route;
}

const weatherTiles = [];
const weatherRefreshMs = 15 * 60 * 1000;
let lastWeatherRequest = 0;

function weatherLabel(code, isDay) {
    if (code === 0) return isDay ? ['sun', 'Clear'] : ['moon', 'Clear'];
    if (code === 1 || code === 2) return ['cloud', 'Partly cloudy'];
    if (code === 3) return ['cloud', 'Overcast'];
    if (code === 45 || code === 48) return ['cloud', 'Fog'];
    if (code >= 95) return ['rain', 'Thunderstorms'];
    if (code >= 80 && code <= 82) return ['rain', 'Showers'];
    if (code >= 71 && code <= 77 || code === 85 || code === 86) return ['cloud', 'Snow'];
    if (code >= 51 && code <= 57) return ['rain', 'Drizzle'];
    if (code >= 61 && code <= 67) return ['rain', 'Rain'];
    return ['cloud', 'Conditions unavailable'];
}

function renderWeather(readings, failure = false) {
    weatherTiles.forEach((tile, index) => {
        const current = readings?.[index];
        const svg = $('.weather-reading use', tile);
        const temperature = $('.temperature', tile);
        const condition = $('.weather-condition', tile);
        if (!current || !Number.isFinite(current.temperature_2m)) {
            temperature.textContent = '—';
            condition.textContent = failure ? 'Unavailable' : 'Loading weather…';
            return;
        }

        const [weatherIcon, label] = weatherLabel(current.weather_code, current.is_day);
        svg.setAttribute('href', '#i-' + weatherIcon);
        temperature.textContent = Math.round(current.temperature_2m) + '°C';
        condition.textContent = label + (failure ? ' · Last known' : '');
    });
}

function buildWeather() {
    config.locations.forEach((location) => {
        const tile = create('div', 'weather-tile');
        const reading = create('div', 'weather-reading');
        reading.append(icon('cloud'), create('strong', 'temperature', '—'), create('span', 'weather-condition', 'Loading weather…'));
        tile.append(create('strong', 'place', location.city), create('span', 'province', location.province), reading);
        weatherTiles.push(tile);
        $('#weatherPair').append(tile);
    });
}

async function refreshWeather() {
    if (Date.now() - lastWeatherRequest < weatherRefreshMs) return;
    lastWeatherRequest = Date.now();

    const locationKey = config.locations.map(({ lat, lon }) => lat + ',' + lon).join('/');
    const cache = saved('weather');
    const cached = cache?.locations === locationKey && Date.now() - cache.fetchedAt < 6 * 60 * 60 * 1000 ? cache.readings : null;
    if (cached) renderWeather(cached, true);

    const query = new URLSearchParams({
        latitude: config.locations.map((location) => location.lat).join(','),
        longitude: config.locations.map((location) => location.lon).join(','),
        current: 'temperature_2m,weather_code,is_day',
        timezone: config.timeZone
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const result = await fetch('https://api.open-meteo.com/v1/forecast?' + query, { signal: controller.signal });
        if (!result.ok) throw new Error('Weather request failed');
        const response = await result.json();
        const readings = (Array.isArray(response) ? response : [response]).map((location) => location.current);
        if (readings.length !== weatherTiles.length || readings.some((reading) => !Number.isFinite(reading?.temperature_2m))) {
            throw new Error('Incomplete weather data');
        }
        save('weather', { locations: locationKey, fetchedAt: Date.now(), readings });
        renderWeather(readings);
    } catch {
        renderWeather(cached, true);
    } finally {
        clearTimeout(timeout);
    }
}

const audio = $('#audio');
const seek = $('#seek');
const lyricPanel = $('#lyricPanel');
const lyricLine = $('#lyricCurrent');
const lyricOutgoing = $('#lyricOutgoing');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const audioError = $('#playerError');
let trackIndex = -1;
let syncPhotocardTrack = () => {};
let visibleCue = null;
let lyricEntrance;
let lyricExit;
let playerInView = true;
let hasPlayedAudio = false;
const trackButtons = [];
const skyLayers = [];

function playTime(time) {
    const second = Math.floor(Number.isFinite(time) ? time : 0);
    return Math.floor(second / 60) + ':' + pad(second % 60);
}

function updateMiniPlayer() {
    $('#miniPlayer').hidden = !giftOpened || playerInView || !hasPlayedAudio;
}

function updatePlayButtons() {
    const playing = !audio.paused && !audio.ended;
    [$('#playTrack'), $('#miniPlay')].forEach((button) => {
        button.setAttribute('aria-label', playing ? 'Pause' : 'Play');
        setIcon(button, playing ? 'pause' : 'play');
    });
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
}

function stopLyricSlide() {
    lyricEntrance?.cancel();
    lyricExit?.cancel();
    lyricEntrance = null;
    lyricExit = null;
    lyricOutgoing.hidden = true;
}

function slideLyricDown(previousLine) {
    lyricOutgoing.textContent = previousLine;
    lyricOutgoing.hidden = false;
    const timing = { duration: 620, easing: 'cubic-bezier(.22, .65, .28, 1)' };
    lyricEntrance = lyricLine.animate([
        { transform: 'translateY(-1.7em)', opacity: .18 },
        { transform: 'translateY(0)', opacity: 1 }
    ], timing);
    const exit = lyricOutgoing.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(1.7em)', opacity: 0 }
    ], timing);
    lyricExit = exit;
    exit.onfinish = () => {
        if (lyricExit === exit) stopLyricSlide();
    };
}

function updateLyrics() {
    const track = config.tracks[trackIndex];
    const cues = track.lyrics;
    const clock = audio.currentTime - (track.lyricOffset || 0);
    let index = -1;
    for (let i = 0; i < cues.length && cues[i][0] <= clock; i++) index = i;
    if (index === visibleCue) return;

    const previousLine = lyricLine.textContent;
    const nextLine = cues.length ? cues[index]?.[1] || 'Instrumental' : 'Lyrics unavailable';
    const advancesDuringPlayback = visibleCue !== null && index === visibleCue + 1 && !audio.paused && !audio.seeking;
    stopLyricSlide();
    visibleCue = index;
    $('#lyricBefore').textContent = cues[index - 1]?.[1] || '';
    $('#lyricAfter').textContent = cues[index + 1]?.[1] || '';
    lyricLine.textContent = nextLine;
    lyricLine.scrollTop = 0;
    if (advancesDuringPlayback && !lyricPanel.hidden && !reducedMotion.matches && previousLine !== nextLine) {
        slideLyricDown(previousLine);
    }
}

function updatePlayback() {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !ready;
    seek.max = ready ? audio.duration : 0;
    seek.value = audio.currentTime;
    seek.style.setProperty('--fill', (ready ? audio.currentTime / audio.duration * 100 : 0) + '%');
    seek.setAttribute('aria-valuetext', playTime(audio.currentTime) + ' of ' + playTime(audio.duration));
    $('#elapsedTime').textContent = playTime(audio.currentTime);
    $('#duration').textContent = playTime(audio.duration);
    if (trackIndex >= 0) updateLyrics();
}

function showTrackError(message) {
    audioError.textContent = message;
    audioError.hidden = !message;
}

async function playAudio() {
    if (!giftOpened || trackIndex < 0) return;
    showTrackError('');
    const requestedTrack = trackIndex;
    try {
        await audio.play();
        hasPlayedAudio = true;
        updateMiniPlayer();
    } catch (error) {
        if (requestedTrack === trackIndex && error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
            showTrackError('Couldn’t play this song. Tap play to try again.');
        }
    }
}

function togglePlayback() {
    if (audio.paused || audio.ended) {
        if (audio.error) audio.load();
        playAudio();
    } else {
        audio.pause();
    }
}

function setTrack(index, autoplay = false) {
    const track = config.tracks[index];
    if (!track || trackIndex === index) return;

    const root = document.documentElement;
    const previousTrack = config.tracks[trackIndex];
    Object.keys(previousTrack?.palette || {}).forEach((token) => {
        if (!(token in track.palette)) root.style.removeProperty('--' + token);
    });
    Object.entries(track.palette).forEach(([token, value]) => root.style.setProperty('--' + token, value));
    root.style.colorScheme = track.colorScheme;
    $('#themeColor').content = track.palette.page;

    trackIndex = index;
    visibleCue = null;
    $('#trackCover').src = track.cover;
    $('#miniCover').src = track.cover;
    $('#trackTitle').textContent = track.title;
    $('#miniTitle').textContent = track.title;
    $('#trackArtist').textContent = track.artist;
    $('#miniArtist').textContent = track.artist;
    trackButtons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
    skyLayers.forEach((layer, position) => layer.classList.toggle('active', position === index));
    showTrackError('');
    audio.src = track.audio;
    audio.load();
    updatePlayback();
    updatePlayButtons();
    syncPhotocardTrack();

    if ('mediaSession' in navigator && 'MediaMetadata' in window) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            artwork: [{ src: track.cover, type: track.coverType || 'image/svg+xml' }]
        });
    }
    if (autoplay) playAudio();
}

function stepTrack(direction) {
    const next = (trackIndex + direction + config.tracks.length) % config.tracks.length;
    setTrack(next, !audio.paused);
}

function buildPlayer() {
    config.tracks.forEach((track, index) => {
        const layer = image(track.ambience);
        $('#ambience').append(layer);
        skyLayers.push(layer);

        const button = create('button', 'track-option');
        button.type = 'button';
        button.setAttribute('aria-pressed', 'false');
        button.append(image(track.cover), create('span', '', track.title));
        button.addEventListener('click', () => setTrack(index, !audio.paused));
        $('#playlist').append(button);
        trackButtons.push(button);
    });
    $('#prevTrack').addEventListener('click', () => stepTrack(-1));
    $('#nextTrack').addEventListener('click', () => stepTrack(1));
    $('#playTrack').addEventListener('click', togglePlayback);
    $('#miniPlay').addEventListener('click', togglePlayback);
    $('#returnPlayer').addEventListener('click', () => {
        $('#player').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        $('#playTrack').focus({ preventScroll: true });
    });
    new IntersectionObserver(([entry]) => {
        playerInView = entry.isIntersecting;
        updateMiniPlayer();
    }).observe($('#player'));

    $('#toggleLyrics').addEventListener('click', (event) => {
        lyricPanel.hidden = !lyricPanel.hidden;
        if (lyricPanel.hidden) stopLyricSlide();
        event.currentTarget.setAttribute('aria-pressed', String(!lyricPanel.hidden));
    });
    seek.addEventListener('input', () => {
        if (!Number.isFinite(audio.duration)) return;
        stopLyricSlide();
        audio.currentTime = Number(seek.value);
        updatePlayback();
    });
    audio.addEventListener('seeking', stopLyricSlide);
    reducedMotion.addEventListener('change', stopLyricSlide);
    ['loadedmetadata', 'durationchange', 'timeupdate', 'seeked', 'emptied'].forEach((event) => audio.addEventListener(event, updatePlayback));
    ['play', 'pause', 'ended'].forEach((event) => audio.addEventListener(event, updatePlayButtons));
    audio.addEventListener('ended', () => setTrack(trackIndex + 1, true));
    audio.addEventListener('error', () => showTrackError('This audio file couldn’t load. Tap play to retry.'));
    if (config.tracks.length < 2) {
        $('#prevTrack').disabled = true;
        $('#nextTrack').disabled = true;
    }
    const mediaActions = {
        play: playAudio,
        pause: () => audio.pause(),
        previoustrack: () => stepTrack(-1),
        nexttrack: () => stepTrack(1)
    };
    if ('mediaSession' in navigator) Object.entries(mediaActions).forEach(([action, handler]) => {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch {
            // Some browsers support only a subset of lock-screen controls.
        }
    });
}

function buildVoicemails() {
    const configured = Array.isArray(config.voicemails) ? config.voicemails : [];
    const messages = configured.map((entry) => ({
        title: typeof entry?.title === 'string' ? entry.title.trim() : '',
        url: typeof entry?.audio === 'string' ? entry.audio.trim() : '',
        date: entry?.date,
        addedOn: dateInPht(entry?.date)
    })).filter(({ url, date, addedOn }) => url && Number.isFinite(addedOn) && phtDay(addedOn) === date)
        .sort((a, b) => b.addedOn - a.addedOn);

    $('#voicemailSetup').hidden = !isOwnerPreview;
    if (!messages.length) return;

    const recording = $('#voicemailAudio');
    const error = $('#voicemailError');
    const previous = $('#voicemailPrev');
    const next = $('#voicemailNext');
    let page = 0;
    let resumeSoundtrack = false;

    function showPage(index) {
        const message = messages[index];
        if (!message) return;

        page = index;
        recording.pause();
        error.hidden = true;
        recording.src = message.url;
        const date = $('#voicemailDate');
        date.dateTime = message.date;
        date.textContent = calendarDate.format(message.addedOn);
        $('#voicemailSubject').textContent = message.title || 'Voicemail';
        $('#voicemailPage').textContent = (page + 1) + ' of ' + messages.length;
        previous.disabled = page === 0;
        next.disabled = page === messages.length - 1;
    }

    function resumeMusic() {
        if (!resumeSoundtrack || (!recording.paused && !recording.ended && !recording.error)) return;
        resumeSoundtrack = false;
        playAudio();
    }

    recording.addEventListener('play', () => {
        if (recording.paused || audio.paused) return;
        resumeSoundtrack = true;
        audio.pause();
    });
    recording.addEventListener('pause', resumeMusic);
    recording.addEventListener('ended', resumeMusic);
    recording.addEventListener('error', () => {
        if (!recording.error) return;
        error.textContent = 'This voicemail couldn’t be loaded.';
        error.hidden = false;
        resumeMusic();
    });
    audio.addEventListener('play', () => {
        if (audio.paused || recording.paused) return;
        resumeSoundtrack = false;
        recording.pause();
    });
    previous.addEventListener('click', () => showPage(page - 1));
    next.addEventListener('click', () => showPage(page + 1));

    $('#voicemailEmpty').hidden = true;
    $('#voicemailEntry').hidden = false;
    $('#voicemailPages').hidden = messages.length < 2;
    showPage(0);
}

function openLetter(letter) {
    $('#letterTitle').textContent = letter.title;
    $('#letterBody').textContent = letter.body;
    const link = $('#letterLink');
    link.hidden = true;
    if (letter.link?.url) {
        try {
            const url = new URL(letter.link.url, document.baseURI);
            if (['https:', 'http:'].includes(url.protocol)) {
                link.href = url.href;
                link.textContent = letter.link.label || 'Open attachment';
                link.hidden = false;
            }
        } catch {
            // A malformed optional link leaves the letter readable.
        }
    }
    $('#letterDialog').showModal();
}

function buildLetters(legacyGift) {
    config.letters.forEach((letter) => {
        const button = create('button', 'envelope');
        button.type = 'button';
        button.append(icon('mail'), create('span', '', letter.title), icon('right'));
        const preservedLetter = letter.id === 'anniversary' && legacyGift.letter ? { ...letter, body: legacyGift.letter } : letter;
        button.addEventListener('click', () => openLetter(preservedLetter));
        $('#envelopes').append(button);
    });
}

function readLegacyGift() {
    if (!config.importLegacyGift) return {};
    let previous = {};
    try {
        previous = JSON.parse(localStorage.getItem('our-three-year-journey-config-v2') || '{}') || {};
    } catch {
        // Published customizations can still be loaded when storage is blocked.
    }
    return { ...window.GIFT_CONFIG, ...previous };
}

function readMemories(legacyGift) {
    const legacyMemories = legacyGift.memories;
    return Array.isArray(legacyMemories) && legacyMemories.length === 15
        ? legacyMemories.map((memory, index) => ({ ...config.memories[index], ...memory }))
        : config.memories;
}

function buildGallery(configuredMemories) {
    const gallery = $('#gallery');
    const memories = configuredMemories.map((data, index) => {
        const placeholder = config.memoryArtwork[index % config.memoryArtwork.length];
        const frontImage = image(data.image || placeholder, 'polaroid-image');
        frontImage.loading = 'lazy';
        if (data.showFullImage) frontImage.style.objectFit = 'contain';
        const name = create('span', 'polaroid-name', data.title);
        name.append(icon('flip'));
        const front = create('span', 'polaroid-face');
        front.append(frontImage, name, create('span', 'polaroid-date', data.date));

        const back = create('span', 'polaroid-face polaroid-back');
        back.append(create('span', '', data.note), create('span', 'polaroid-date', data.date));
        back.setAttribute('aria-hidden', 'true');

        const inner = create('span', 'polaroid-inner');
        inner.append(front, back);
        const card = create('button', 'polaroid');
        card.type = 'button';
        card.setAttribute('aria-pressed', 'false');
        card.append(inner);

        // The repeated cards bridge the end of the strip without adding duplicate tab stops.
        const copy = create('div', 'polaroid polaroid-copy');
        copy.setAttribute('aria-hidden', 'true');
        copy.hidden = true;
        copy.append(inner.cloneNode(true));
        [frontImage, $('.polaroid-image', copy)].forEach((photo) => {
            photo.addEventListener('error', () => {
                if (photo.getAttribute('src') !== placeholder) photo.src = placeholder;
            });
        });
        card.addEventListener('click', () => {
            const flipped = card.getAttribute('aria-pressed') !== 'true';
            card.setAttribute('aria-pressed', String(flipped));
            front.setAttribute('aria-hidden', String(flipped));
            back.setAttribute('aria-hidden', String(!flipped));
            copy.classList.toggle('is-flipped', flipped);
        });
        copy.addEventListener('click', () => card.click());
        return { card, copy };
    });
    gallery.append(...memories.map(({ card }) => card), ...memories.map(({ copy }) => copy));

    const previous = $('#galleryPrev');
    const next = $('#galleryNext');
    const auto = $('#galleryAuto');
    let step = 0;
    let loopWidth = 0;
    let inView = false;
    let manuallyPaused;
    let pointerDown = false;
    let resumeAt = 0;
    let frame = 0;
    let lastFrame = 0;
    let remainder = 0;

    function animateGallery(now) {
        const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
        lastFrame = now;
        const keyboardFocus = gallery.matches(':focus-visible') || gallery.querySelector(':focus-visible');
        if (!pointerDown && !keyboardFocus && now >= resumeAt) {
            remainder += elapsed * .028;
            const pixels = Math.floor(remainder);
            remainder -= pixels;
            if (pixels) gallery.scrollLeft = (Math.max(0, gallery.scrollLeft) + pixels) % loopWidth;
        }
        frame = requestAnimationFrame(animateGallery);
    }

    function syncAutomaticScroll() {
        const paused = manuallyPaused ?? reducedMotion.matches;
        auto.hidden = !loopWidth;
        const label = paused ? 'Resume automatic memory scrolling' : 'Pause automatic memory scrolling';
        auto.setAttribute('aria-label', label);
        auto.title = label;
        setIcon(auto, paused ? 'play' : 'pause');

        if (loopWidth && inView && !paused) {
            if (!frame) frame = requestAnimationFrame(animateGallery);
        } else if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
            lastFrame = 0;
        }
    }

    function updateGalleryLayout() {
        const first = memories[0]?.card.getBoundingClientRect();
        const last = memories.at(-1)?.card.getBoundingClientRect();
        const scrollable = memories.length > 1 && gallery.clientWidth > 0 && last.right - first.left > gallery.clientWidth + 1;
        memories.forEach(({ copy }) => { copy.hidden = !scrollable; });
        loopWidth = scrollable ? memories[0].copy.getBoundingClientRect().left - first.left : 0;
        step = scrollable ? memories[1].card.getBoundingClientRect().left - first.left : 0;
        previous.disabled = next.disabled = !loopWidth;
        syncAutomaticScroll();
    }

    function giveTimeToRead() {
        resumeAt = performance.now() + 4500;
    }

    function scrollGallery(direction) {
        if (!loopWidth) return;
        giveTimeToRead();
        const position = Math.max(0, gallery.scrollLeft) % loopWidth;
        const start = direction < 0 && position < step ? position + loopWidth : position;
        if (Math.abs(gallery.scrollLeft - start) > 1) gallery.scrollLeft = start;
        gallery.scrollTo({ left: start + direction * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }

    previous.addEventListener('click', () => scrollGallery(-1));
    next.addEventListener('click', () => scrollGallery(1));
    auto.addEventListener('click', () => {
        manuallyPaused = !(manuallyPaused ?? reducedMotion.matches);
        if (!manuallyPaused) resumeAt = 0;
        syncAutomaticScroll();
    });
    gallery.addEventListener('click', giveTimeToRead);
    gallery.addEventListener('wheel', giveTimeToRead, { passive: true });
    gallery.addEventListener('pointerdown', () => { pointerDown = true; });
    ['pointerup', 'pointercancel'].forEach((type) => {
        window.addEventListener(type, () => {
            if (!pointerDown) return;
            pointerDown = false;
            giveTimeToRead();
        });
    });
    reducedMotion.addEventListener('change', syncAutomaticScroll);
    new ResizeObserver(updateGalleryLayout).observe(gallery);
    new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncAutomaticScroll();
    }).observe(gallery);
}

function bindDialogs() {
    $$('dialog').forEach((dialog) => {
        $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) dialog.close();
        });
    });
}

function openGift(remember = false) {
    if (giftOpened || (!isOwnerPreview && !(Date.now() >= unlockAt))) return;
    if (remember) save('unwrapped', config.unlockAt);
    giftOpened = true;
    $('#giftScreen').hidden = true;
    $('#dashboard').hidden = false;
    $('#dashboard').inert = false;
    if (remember) {
        $('#dashboard').classList.add('gift-reveal');
        $('#dashboardTitle').focus({ preventScroll: true });
        window.scrollTo(0, 0);
    }
    setTrack(0, true);
    refreshWeather();
    tick();
}

function tick() {
    const now = Date.now();
    if (!giftOpened) {
        const ready = now >= unlockAt;
        const button = $('#unwrapGift');
        const [days, hours, minutes, seconds] = splitTime(unlockAt - now, true);
        $('#giftCountdown').textContent = ready ? 'Your gift is ready.' : days + 'd ' + pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
        if (button.disabled === ready) {
            button.disabled = !ready;
            setIcon(button, ready ? 'gift' : 'lock');
            $('span', button).textContent = ready ? 'Unwrap your gift' : 'Locked until the anniversary';
        }
        return;
    }
    updateClock(now);
    updateMeetup(now);
    updateReason(now);
}

function init() {
    const legacyGift = readLegacyGift();
    const sender = config.names.sender;
    const recipient = config.names.recipient;
    document.title = config.title;
    $$('[data-site-title]').forEach((node) => node.textContent = config.title);
    $$('[data-sender]').forEach((node) => node.textContent = sender);
    $$('[data-recipient]').forEach((node) => node.textContent = recipient);
    $('#brandNames').textContent = sender + ' & ' + recipient;
    const giftTime = new Intl.DateTimeFormat('en-PH', { ...dateOptions, hour: 'numeric', minute: '2-digit', hour12: true });
    $('#giftDate').textContent = 'Opens ' + longDate.format(unlockAt) + ' · ' + giftTime.format(unlockAt) + ' PHT';
    $('#giftMessage').textContent = legacyGift.introMessage || config.giftMessage;
    $('#previewGift').hidden = !isLocalSite;
    $('#previewBar').hidden = !isOwnerPreview;
    $('#anniversarySince').textContent = 'Together since ' + calendarDate.format(anniversaryStart);
    $('#unwrapGift').addEventListener('click', () => openGift(true));

    buildPlayer();
    buildWeather();
    bindMeetup();
    loadMeetup();
    buildVoicemails();
    buildLetters(legacyGift);
    const memories = readMemories(legacyGift);
    buildGallery(memories);
    syncPhotocardTrack = bindPhotocard(memories);
    bindDialogs();
    $('#shuffleReason').disabled = config.reasons.length < 2;
    $('#shuffleReason').addEventListener('click', shuffleReason);

    if (isOwnerPreview || saved('unwrapped') === config.unlockAt) openGift();
    tick();
    setInterval(tick, 1000);
    setInterval(() => {
        if (giftOpened && document.visibilityState === 'visible') refreshWeather();
    }, weatherRefreshMs);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        tick();
        if (giftOpened) refreshWeather();
    });
    window.addEventListener('storage', (event) => {
        if (event.key === storagePrefix + 'meetup') loadMeetup();
    });
}

init();
