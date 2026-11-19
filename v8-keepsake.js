/* The preview and exported PNG share the exact same canvas rendering. */
'use strict';
(function () {
    const select = document.querySelector('#keepsakePhoto');
    const canvas = document.querySelector('#keepsakeCanvas');
    const ctx = canvas.getContext('2d');
    const message = document.querySelector('#keepsakeMessage');
    const button = document.querySelector('#downloadKeepsake');
    const modal = document.querySelector('#keepsakeOverlay');
    let previousOverlay = null;
    let renderVersion = 0;
    let latestRender = Promise.resolve();

    function safeName(value, fallback) {
        return (String(value || '').trim() || fallback).slice(0, 38);
    }
    function imageLoaded(src) {
        return new Promise((resolve) => {
            if (!src) {
                resolve(null);
                return;
            }
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }
    function cover(ctx, img, x, y, w, h) {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        const sw = w / scale;
        const sh = h / scale;
        ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
    }
    function roundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
    }
    function paperGrain(ctx) {
        // Repeatable grain. No animation or network requests.
        for (let i = 0; i < 1800; i += 1) {
            const x = (i * 1123 + 41) % 1200;
            const y = (i * 6571 + 97) % 1500;
            ctx.fillStyle = i % 3 === 0 ? '#153d4814' : '#ffffff24';
            ctx.fillRect(x, y, 2, 2);
        }
    }
    function wrap(ctx, text, width, maxLines) {
        const words = text.trim().split(/\s+/).filter(Boolean);
        const lines = [];
        let current = '';
        for (const word of words) {
            const proposed = current ? current + ' ' + word : word;
            if (ctx.measureText(proposed).width > width && current) {
                lines.push(current);
                current = word;
            } else {
                current = proposed;
            }
        }
        if (current) lines.push(current);
        return lines.slice(0, maxLines);
    }
    function formatDate(value) {
        const parts = String(value || '2023-11-20').split('-');
        return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : String(value || '20.11.2023');
    }
    function drawArt(photo, album) {
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const background = ctx.createLinearGradient(0, 0, 1050, 1500);
        background.addColorStop(0, '#a9c5c9');
        background.addColorStop(.42, '#658a9f');
        background.addColorStop(1, '#35576f');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, W, H);

        // Large handcut-paper shapes that echo the grainy movement of the album cover.
        ctx.fillStyle = '#dbe4d9';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(480, 36, 520, 170, 1180, 60);
        ctx.lineTo(1200, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#d4a7a1';
        ctx.beginPath();
        ctx.arc(1035, 218, 178, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b4c9b6';
        ctx.beginPath();
        ctx.moveTo(0, 560);
        ctx.bezierCurveTo(235, 415, 352, 460, 510, 380);
        ctx.bezierCurveTo(610, 328, 730, 372, 900, 245);
        ctx.lineTo(0, 1050);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#24475e';
        ctx.beginPath();
        ctx.moveTo(0, 1180);
        ctx.bezierCurveTo(420, 990, 570, 1250, 1200, 980);
        ctx.lineTo(1200, 1500);
        ctx.lineTo(0, 1500);
        ctx.fill();
        if (album) {
            ctx.save();
            ctx.globalAlpha = .14;
            cover(ctx, album, 0, 0, 1200, 1500);
            ctx.restore();
        }

        // Offset warm shadow gives the photo the feeling of a real print.
        ctx.save();
        ctx.translate(603, 618);
        ctx.rotate(-.021);
        ctx.fillStyle = '#c99789';
        roundedRect(ctx, -504, -435, 1010, 1010, 5);
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.translate(594, 600);
        ctx.rotate(.012);
        ctx.shadowColor = '#1c384c66';
        ctx.shadowBlur = 44;
        ctx.shadowOffsetY = 22;
        ctx.fillStyle = '#e8eee6';
        roundedRect(ctx, -508, -440, 1016, 1025, 3);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.save();
        roundedRect(ctx, -481, -413, 962, 913, 2);
        ctx.clip();
        ctx.fillStyle = '#89a9b3';
        ctx.fillRect(-481, -413, 962, 913);
        if (photo) {
            cover(ctx, photo, -481, -413, 962, 913);
        } else {
            if (album) {
                ctx.globalAlpha = .5;
                cover(ctx, album, -481, -413, 962, 913);
                ctx.globalAlpha = 1;
            }
            ctx.textAlign = 'center';
            ctx.fillStyle = '#e9ece6';
            ctx.font = '140px Caveat, cursive';
            ctx.fillText('♡', 0, 40);
        }
        ctx.restore();
        ctx.restore();

        // Tiny accent marks, no extra paragraphs or decorative headlines.
        ctx.strokeStyle = '#e9d8c0';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(70, 1173);
        ctx.lineTo(150, 1173);
        ctx.stroke();
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f4eee4';
        ctx.font = '76px Caveat, cursive';
        const names = `${safeName(config.theirName, 'Jasmin')} & ${safeName(config.yourName, 'Jorge')}`;
        ctx.fillText(names, 88, 1250, 1000);
        ctx.font = '500 26px Quicksand, sans-serif';
        ctx.fillStyle = '#c7dcdd';
        ctx.fillText(formatDate(config.anniversaryDate), 90, 1301);
        const note = message.value.trim() || 'three years, and still you ♡';
        ctx.font = '44px Caveat, cursive';
        ctx.fillStyle = '#f3ded0';
        const lines = wrap(ctx, note, 1010, 2);
        lines.forEach((line, i) => ctx.fillText(line, 90, 1383 + i * 55, 1015));
        paperGrain(ctx);
    }
    function updatePreview() {
        const version = ++renderVersion;
        const item = config.memories[Number(select.value)] || config.memories[0];
        latestRender = Promise.all([
            imageLoaded(item?.image),
            imageLoaded('assets/flaws-album-art.jpg'),
            document.fonts ? document.fonts.ready : Promise.resolve()
        ]).then(([photo, album]) => {
            if (version !== renderVersion) return;
            drawArt(photo, album);
        });
        return latestRender;
    }
    function openKeepsake() {
        select.replaceChildren();
        config.memories.forEach((memory, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = `${memory.year} | ${memory.title}`;
            select.append(option);
        });
        const first = config.memories.findIndex(memory => Boolean(memory.image));
        select.value = String(first < 0 ? 0 : first);
        updatePreview();
        const open = document.querySelector('.overlay:not(.hidden)');
        previousOverlay = open && open.id !== modal.id ? open.id : null;
        if (open && open.id !== modal.id) closeOverlay(open.id.replace('Overlay', ''));
        openOverlay('keepsake');
    }
    async function saveKeepsake() {
        button.disabled = true;
        button.textContent = 'making your keepsake...';
        try {
            await updatePreview();
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Could not export PNG');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'jasmin-and-jorge-keepsake.png';
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            showToast('Your keepsake is ready ♡');
        } catch (error) {
            showToast('Could not save the card. Try another photo.');
        } finally {
            button.disabled = false;
            button.textContent = 'save this card ↓';
        }
    }
    document.querySelector('#openKeepsakeGallery').addEventListener('click', openKeepsake);
    document.querySelector('#openKeepsakeFinale').addEventListener('click', openKeepsake);
    document.querySelector('#closeKeepsake').addEventListener('click', () => closeOverlay('keepsake'));
    select.addEventListener('change', updatePreview);
    message.addEventListener('input', updatePreview);
    button.addEventListener('click', saveKeepsake);
})();
