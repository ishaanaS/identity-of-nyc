const container = document.getElementById('qr-container');
const bgImage = window.getComputedStyle(document.body).backgroundImage;

// Build a temp QR to sample dark vs light modules
const tempDiv = document.createElement('div');
new QRCode(tempDiv, {
    text: 'https://example.com',
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
});

setTimeout(() => {
    const canvas = tempDiv.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const moduleSize = 8; // sampling resolution
    const modules = canvas.width / moduleSize;

    // grid
    container.style.gridTemplateColumns = `repeat(${modules}, 1fr)`;

    // Left inner area
    const inLeftInner = (x, y) => x >= 1 && x <= 5 && y >= 1 && y <= 5;

    // Right inner area - extended one column to the left (excludes rightmost edge)
    const inRightInner = (x, y) => {
        const rx = (modules - 1) - x; // distance from right edge
        return rx >= 1 && rx <= 6 && y >= 1 && y <= 5;
    };

    const leftCluster = [];
    const rightCluster = [];

    for (let y = 0; y < modules; y++) {
        for (let x = 0; x < modules; x++) {
            const pixelX = x * moduleSize + moduleSize / 2;
            const pixelY = y * moduleSize + moduleSize / 2;
            const index = (Math.floor(pixelY) * canvas.width + Math.floor(pixelX)) * 4;
            const isDark = data[index] < 128;

            if (isDark) {
                const cell = document.createElement('div');
                cell.className = 'qr-module';
                cell.style.width = '30px';
                cell.style.height = '26px';

                const bgX = (x / modules) * 100;
                const bgY = (y / modules) * 100;
                cell.style.backgroundImage = bgImage;
                cell.style.backgroundPosition = `${bgX}% ${bgY}%`;

                // Only group dark cells that already exist inside the finder inner area
                const inLeft = inLeftInner(x, y);
                const inRight = inRightInner(x, y);

                // Make one specific module the info button (pick a spot in the middle/bottom)
                const isInfoModule = (x === 20 && y === 8);

                if (inLeft) {
                    cell.classList.add('qr-button');
                    cell.dataset.cluster = 'left';
                    leftCluster.push(cell);
                    cell.addEventListener('click', () => (window.location.href = 'page1.html'));
                } else if (inRight) {
                    cell.classList.add('qr-button');
                    cell.dataset.cluster = 'right';
                    rightCluster.push(cell);
                    cell.addEventListener('click', () => (window.location.href = 'page2.html'));
                } else if (isInfoModule) {
                    cell.classList.add('qr-info-module');
                    cell.addEventListener('click', () => {
                        openPopup();
                    });
                } else {
                    // Regular modules disappear when clicked
                    cell.addEventListener('click', () => {
                        cell.classList.add('hidden');
                    });
                }

                container.appendChild(cell);
            } else {
                // keep small spacers so visuals don't change
                const spacer = document.createElement('div');
                spacer.style.width = '12px';
                spacer.style.height = '12px';
                container.appendChild(spacer);
            }
        }
    }

    // group hover (tints only the existing dark tiles in the region)
    function setLeftActive(active) {
        leftCluster.forEach(el => el.classList.toggle('cluster-active-left', active));
    }
    function setRightActive(active) {
        rightCluster.forEach(el => el.classList.toggle('cluster-active-right', active));
    }

    container.addEventListener('pointerover', (e) => {
        const btn = e.target.closest('.qr-button');
        if (!btn) return;
        if (btn.dataset.cluster === 'left') setLeftActive(true);
        if (btn.dataset.cluster === 'right') setRightActive(true);
    });

    container.addEventListener('pointerout', (e) => {
        const btn = e.target.closest('.qr-button');
        if (!btn) return;
        const next = e.relatedTarget && e.relatedTarget.closest
            ? e.relatedTarget.closest('.qr-button')
            : null;
        if (btn.dataset.cluster === 'left' && !(next && next.dataset.cluster === 'left')) {
            setLeftActive(false);
        }
        if (btn.dataset.cluster === 'right' && !(next && next.dataset.cluster === 'right')) {
            setRightActive(false);
        }
    });
}, 100);

function openPopup() {
    document.getElementById('about-popup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('about-popup').classList.add('hidden');
}

// Optional: Close popup when clicking outside the content
document.getElementById('about-popup').addEventListener('click', (e) => {
    if (e.target.id === 'about-popup') {
        closePopup();
    }
});