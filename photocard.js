'use strict';

function drawPhotocard(canvas, context, memory, track, photo, sky) {
    const { width, height } = canvas;
    // A fresh canvas can be exported after previewing an image from another origin.
    canvas.width = width;
    const palette = track.palette;
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette['player-bg']);
    gradient.addColorStop(1, palette.glow);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (sky) {
        const skyWidth = height * sky.naturalWidth / sky.naturalHeight;
        const skyPosition = track.photocardSkyPosition ?? .78;
        context.drawImage(sky, (width - skyWidth) * skyPosition, 0, skyWidth, height);
    }

    context.strokeStyle = palette['player-border'];
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(22, 22, width - 44, height - 44, 30);
    context.stroke();

    const left = 46;
    const top = 112;
    const photoWidth = width - left * 2;
    const photoHeight = 704;
    const fit = memory.showFullImage ? Math.min : Math.max;
    const scale = fit(photoWidth / photo.naturalWidth, photoHeight / photo.naturalHeight);
    const imageWidth = photo.naturalWidth * scale;
    const imageHeight = photo.naturalHeight * scale;

    context.save();
    context.beginPath();
    context.roundRect(left, top, photoWidth, photoHeight, 23);
    context.fillStyle = palette.surface;
    context.shadowColor = palette.shadow;
    context.shadowBlur = 23;
    context.shadowOffsetY = 8;
    context.fill();
    context.shadowColor = 'transparent';
    context.clip();
    context.drawImage(photo, left + (photoWidth - imageWidth) / 2, top + (photoHeight - imageHeight) / 2, imageWidth, imageHeight);
    context.restore();

    const family = '"Bricolage Grotesque", sans-serif';
    context.fillStyle = palette.accent;
    context.font = '700 29px ' + family;
    context.fillText(config.names.sender + ' & ' + config.names.recipient, left, 78, photoWidth);

    context.fillStyle = palette.ink;
    context.font = '750 42px ' + family;
    context.fillText(memory.title, left, 878, photoWidth);
    context.fillStyle = palette.muted;
    context.font = '550 25px ' + family;
    context.fillText(memory.date || '', left, 918, photoWidth);

    context.strokeStyle = palette['player-border'];
    context.beginPath();
    context.moveTo(left, 950);
    context.lineTo(width - left, 950);
    context.stroke();
    context.fillStyle = palette.accent;
    context.font = '700 27px ' + family;
    context.fillText(track.title + ' · ' + track.artist, left, 1002, photoWidth);
}

function bindPhotocard(memories) {
    const photos = memories.filter(({ image }) => image);
    if (!config.tracks.length) return () => {};

    const card = $('#photocardCard');
    const backdrop = $('#photocardBackdrop');
    const theme = $('#photocardTheme');
    const open = $('#openPhotocard');
    const dialog = $('#photocardDialog');
    const picker = $('#photocardPicker');
    const addPhoto = $('#addPhotocardPhoto');
    const fileInput = $('#photocardFile');
    const tracks = $('#photocardTracks');
    const canvas = $('#photocardCanvas');
    const download = $('#savePhotocard');
    const status = $('#photocardStatus');
    const context = canvas.getContext('2d');
    const images = new Map();
    const customIndex = photos.length;
    let selected = photos.length ? 0 : -1;
    let renderVersion = 0;
    let fileVersion = 0;

    function loadImage(src) {
        if (!images.has(src)) {
            const photo = new Image();
            photo.src = src;
            images.set(src, photo.decode().then(() => photo, (error) => {
                images.delete(src);
                throw error;
            }));
        }
        return images.get(src);
    }

    async function render() {
        const version = ++renderVersion;
        const memory = photos[selected];
        const track = config.tracks[Math.max(0, trackIndex)];
        download.disabled = true;
        if (!memory) {
            canvas.hidden = true;
            status.textContent = 'Choose a photo to make a photocard.';
            return;
        }
        status.textContent = 'Preparing photocard…';

        try {
            const [photo, sky] = await Promise.all([
                loadImage(memory.image),
                track.ambience ? loadImage(track.ambience).catch(() => null) : null,
                document.fonts.ready
            ]);
            if (version !== renderVersion || !dialog.open) return;
            drawPhotocard(canvas, context, memory, track, photo, sky);
            canvas.setAttribute('aria-label', `${memory.title} photocard, themed to ${track.title}`);
            canvas.hidden = false;
            download.disabled = false;
            status.textContent = '';
        } catch {
            if (version !== renderVersion || !dialog.open) return;
            canvas.hidden = true;
            status.textContent = 'This photo couldn’t load. Choose another photo or try again.';
        }
    }

    function selectPhoto(index) {
        photoButtons[selected]?.setAttribute('aria-pressed', 'false');
        selected = index;
        photoButtons[index].setAttribute('aria-pressed', 'true');
        if (dialog.open) render();
    }

    function makePhotoButton(memory, index, label = memory.title) {
        const button = create('button', 'photocard-photo');
        button.type = 'button';
        button.title = label;
        button.setAttribute('aria-label', label);
        button.setAttribute('aria-pressed', String(index === selected));
        const thumbnail = image(memory.image);
        if (memory.showFullImage) thumbnail.style.objectFit = 'contain';
        button.append(thumbnail);
        button.addEventListener('click', () => selectPhoto(index));
        return button;
    }

    const photoButtons = photos.map((memory, index) => makePhotoButton(memory, index));
    const songButtons = config.tracks.map((track, index) => {
        const button = create('button', 'track-option', track.title);
        button.type = 'button';
        button.addEventListener('click', () => setTrack(index, !audio.paused));
        return button;
    });
    picker.prepend(...photoButtons);
    tracks.append(...songButtons);

    addPhoto.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        fileInput.value = '';
        if (!file) return;

        const version = ++fileVersion;
        const url = URL.createObjectURL(file);
        try {
            await loadImage(url);
        } catch {
            URL.revokeObjectURL(url);
            if (version === fileVersion) status.textContent = 'This photo couldn’t open. Try a JPG or PNG.';
            return;
        }
        if (version !== fileVersion) {
            images.delete(url);
            URL.revokeObjectURL(url);
            return;
        }

        const previousPhoto = photos[customIndex];
        const previousButton = photoButtons[customIndex];
        const memory = { title: config.title, image: url, showFullImage: true };
        const button = makePhotoButton(memory, customIndex, 'Your custom photo');
        photos[customIndex] = memory;
        photoButtons[customIndex] = button;
        if (previousPhoto) {
            previousButton.replaceWith(button);
            images.delete(previousPhoto.image);
            URL.revokeObjectURL(previousPhoto.image);
        } else {
            picker.insertBefore(button, addPhoto);
        }
        selectPhoto(customIndex);
    });

    function syncTrack() {
        const active = Math.max(0, trackIndex);
        const track = config.tracks[active];
        theme.textContent = track.title;
        backdrop.hidden = !track.ambience;
        if (track.ambience && backdrop.getAttribute('src') !== track.ambience) backdrop.src = track.ambience;
        songButtons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === active)));
        if (dialog.open) render();
    }

    card.hidden = !context;
    open.addEventListener('click', () => {
        dialog.showModal();
        syncTrack();
    });
    download.addEventListener('click', async () => {
        const version = renderVersion;
        const track = config.tracks[Math.max(0, trackIndex)];
        const filename = `photocard-${track.id}-${selected === customIndex ? 'custom' : selected + 1}.png`;
        download.disabled = true;
        let message;
        try {
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Could not encode photocard');
            const url = URL.createObjectURL(blob);
            const link = create('a');
            link.href = url;
            link.download = filename;
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 3000);
            message = 'Photocard ready to save.';
        } catch {
            message = location.protocol === 'file:'
                ? 'Open the site through localhost to save a PNG.'
                : 'This photocard couldn’t be saved. Try another photo.';
        }
        if (version === renderVersion && dialog.open) {
            download.disabled = false;
            status.textContent = message;
        }
    });

    return syncTrack;
}
