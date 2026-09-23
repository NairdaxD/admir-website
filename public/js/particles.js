/**
 * AdMir Consulting — Animated Particle Canvas
 * Premium constellation/network effect on hero section.
 * Particles connected by lines, reacting to mouse movement.
 */

(function () {
    'use strict';

    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    // Respect accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width, height, particles, mouse, animId;
    const isMobile = window.innerWidth < 768;

    const CONFIG = {
        count: isMobile ? 40 : 80,
        maxDistance: isMobile ? 100 : 150,
        speed: 0.3,
        size: { min: 1, max: 2.5 },
        mouseRadius: 120,
        mouseRepel: 0.8,
        lineOpacity: 0.15,
        particleColor: { r: 226, g: 192, b: 141 },  // Champagne Slate
        lineColor: { r: 226, g: 192, b: 141 }
    };

    mouse = { x: -9999, y: -9999 };

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = canvas.width = rect.width;
        height = canvas.height = rect.height;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * CONFIG.speed,
            vy: (Math.random() - 0.5) * CONFIG.speed,
            r: CONFIG.size.min + Math.random() * (CONFIG.size.max - CONFIG.size.min),
            opacity: 0.3 + Math.random() * 0.5
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < CONFIG.count; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const { r, g, b } = CONFIG.particleColor;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
    }

    function drawLine(a, b, dist) {
        const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
        const { r, g, b } = CONFIG.lineColor;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }

    function update() {
        for (const p of particles) {
            // Mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * CONFIG.mouseRepel;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Clamp speed
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > CONFIG.speed * 2) {
                p.vx = (p.vx / speed) * CONFIG.speed * 2;
                p.vy = (p.vy / speed) * CONFIG.speed * 2;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Draw lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.maxDistance) {
                    drawLine(particles[i], particles[j], dist);
                }
            }
        }

        // Draw particles
        for (const p of particles) {
            drawParticle(p);
        }
    }

    function loop() {
        update();
        draw();
        animId = requestAnimationFrame(loop);
    }

    // Event listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    }, { passive: true });

    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animId);
            init();
            loop();
        }, 200);
    }, { passive: true });

    // Pause when not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            loop();
        }
    });

    init();
    loop();
})();
