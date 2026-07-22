(function () {
    'use strict';

    const CONFIG = {
        frameCount: 158,
        frameRate: 24,
        framePath: (index) => `./frames/frame_${String(index).padStart(6, '0')}.jpg`,
        loop: true,
        sourceWidth: 1916,
        sourceHeight: 858,
    };

    const canvas = document.getElementById('sequenceCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false });
    const wrapper = document.querySelector('.video-wrapper');
    const loading = document.getElementById('loading');

    let frames = [];
    let currentFrame = 0;
    let isPlaying = false;
    let animationId = null;
    let lastTime = 0;
    const frameInterval = 1000 / CONFIG.frameRate;
    let canvasWidth = 0,
        canvasHeight = 0;

    function initCanvas() {
        const rect = wrapper.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = Math.floor(rect.width * dpr);
        canvasHeight = Math.floor(rect.height * dpr);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
    }

    function loadFrames() {
        return new Promise((resolve, reject) => {
            const images = new Array(CONFIG.frameCount);
            let loaded = 0,
                failed = 0;

            function onLoad() {
                loaded++;
                if (loaded + failed === CONFIG.frameCount) {
                    frames = images.filter(Boolean);
                    resolve(frames);
                }
            }
            function onError(i) {
                return () => {
                    failed++;
                    if (loaded + failed === CONFIG.frameCount) {
                        frames = images.filter(Boolean);
                        resolve(frames);
                    }
                };
            }

            for (let i = 0; i < CONFIG.frameCount; i++) {
                const img = new Image();
                img.decoding = 'async';
                img.onload = onLoad;
                img.onerror = onError(i);
                img.src = CONFIG.framePath(i);
                images[i] = img;
            }
            setTimeout(() => {
                if (loaded + failed < CONFIG.frameCount) reject(new Error('Timeout'));
            }, 3000);
        });
    }

    function drawFrame(index) {
        if (index < 0 || index >= frames.length) return;
        const frame = frames[index];
        if (!frame || frame.width === 0) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const sourceAspect = CONFIG.sourceWidth / CONFIG.sourceHeight;
        const canvasAspect = canvasWidth / canvasHeight;

        let sx, sy, sWidth, sHeight;

        if (isMobile) {
            const cropSize = Math.min(CONFIG.sourceWidth, CONFIG.sourceHeight); // 858
            sWidth = cropSize;
            sHeight = cropSize;
            sx = CONFIG.sourceWidth - cropSize;
            sy = 0;
        } else {
            if (sourceAspect > canvasAspect) {
                sHeight = CONFIG.sourceHeight;
                sWidth = CONFIG.sourceHeight * canvasAspect;
                sx = (CONFIG.sourceWidth - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = CONFIG.sourceWidth;
                sHeight = CONFIG.sourceWidth / canvasAspect;
                sx = 0;
                sy = (CONFIG.sourceHeight - sHeight) / 2;
            }
        }

        ctx.drawImage(frame, sx, sy, sWidth, sHeight, 0, 0, canvasWidth, canvasHeight);
        currentFrame = index;
    }

    function animate(time) {
        if (!isPlaying) return;
        if (time - lastTime >= frameInterval) {
            let nextFrame = currentFrame + 1;
            if (nextFrame >= frames.length) {
                if (CONFIG.loop) nextFrame = 0;
                else return;
            }
            drawFrame(nextFrame);
            lastTime = time;
        }
        animationId = requestAnimationFrame(animate);
    }

    function play() {
        if (frames.length === 0) return;
        isPlaying = true;
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
    }

    function handleResize() {
        const wasPlaying = isPlaying;
        if (wasPlaying) {
            isPlaying = false;
            if (animationId) cancelAnimationFrame(animationId);
        }
        initCanvas();
        drawFrame(currentFrame);
        if (wasPlaying) play();
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 100);
    });

    async function init() {
        try {
            await loadFrames();
            loading.classList.add('hidden');
            initCanvas();
            drawFrame(0);
            play();
        } catch (err) {
            console.error(err);
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
