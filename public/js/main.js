/**
 * AdMir Consulting — Main JavaScript (Multi-page)
 * Shared across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {

    const CONFIG = {
        scrollThreshold: 80,
        animDuration: 300,
        counterDuration: 2000,
        toastDuration: 5000,
        parallaxSpeed: 0.3
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // === UTILITIES ===
    const fmt = (n) => Number(Math.round(n)).toLocaleString('ro-MD');
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const animateValue = (el, start, end, duration) => {
        if (prefersReducedMotion || !el) { if (el) el.textContent = fmt(end); return; }
        let startTs = null;
        const step = (ts) => {
            if (!startTs) startTs = ts;
            const p = Math.min((ts - startTs) / duration, 1);
            el.textContent = fmt(Math.floor(start + (end - start) * easeOutExpo(p)));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = fmt(end);
        };
        requestAnimationFrame(step);
    };

    // === 1. NAVBAR SCROLL ===
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > CONFIG.scrollThreshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // === 2. MOBILE MENU ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    const toggleMenu = () => {
        if (!hamburger || !navMenu) return;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    if (hamburger) hamburger.addEventListener('click', toggleMenu);

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Close mobile menu on nav link click
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) toggleMenu();
            });
        });
    }

    // === 3. SMOOTH SCROLL (for same-page anchors) ===
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // === 4. SCROLL REVEAL ===
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const staggerParent = el.closest('.reveal-stagger');
                if (staggerParent) {
                    const siblings = Array.from(staggerParent.querySelectorAll('.reveal'));
                    el.style.transitionDelay = `${siblings.indexOf(el) * 100}ms`;
                }
                el.classList.add('active');
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Also handle reveal-stagger containers: animate direct children even without .reveal
    const staggerObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const children = Array.from(container.children);
                children.forEach((child, i) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(30px)';
                    child.style.transition = `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        });
                    });
                });
                obs.unobserve(container);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-stagger').forEach(el => {
        // Only auto-animate if children don't already have .reveal
        if (!el.querySelector('.reveal')) {
            staggerObserver.observe(el);
        }
    });

    // === 5. ANIMATED COUNTERS ===
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                if (!isNaN(target)) {
                    if (prefersReducedMotion) { el.textContent = target; }
                    else {
                        let startTs = null;
                        const step = (ts) => {
                            if (!startTs) startTs = ts;
                            const p = Math.min((ts - startTs) / CONFIG.counterDuration, 1);
                            el.textContent = Math.floor(target * easeOutExpo(p));
                            if (p < 1) requestAnimationFrame(step);
                            else el.textContent = target;
                        };
                        requestAnimationFrame(step);
                    }
                }
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-number').forEach(c => counterObserver.observe(c));

    // === 6. LANGUAGE SWITCHER ===
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('admir_lang') || 'ro';

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('admir_lang', lang);

        document.querySelectorAll('[data-ro][data-en]').forEach(el => {
            const val = el.dataset[lang];
            if (!val) return;
            // Skip elements whose children also have data-ro/data-en (avoid double processing)
            if (el.querySelector('[data-ro][data-en]')) return;
            if (el.tagName === 'INPUT' && el.type === 'submit') el.value = val;
            else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder) el.placeholder = val;
            }
            else if (el.tagName === 'OPTION') el.textContent = val;
            else if (el.children.length > 0) el.innerHTML = val;
            else el.textContent = val;
        });

        document.querySelectorAll('.lang-ro').forEach(el => el.style.display = lang === 'ro' ? '' : 'none');
        document.querySelectorAll('.lang-en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');

        if (langToggle) {
            const activeSpan = langToggle.querySelector('.lang-active');
            const inactiveSpan = langToggle.querySelector('.lang-inactive');
            if (activeSpan && inactiveSpan) {
                activeSpan.textContent = lang.toUpperCase();
                inactiveSpan.textContent = lang === 'ro' ? 'EN' : 'RO';
            }
        }
        document.documentElement.lang = lang;
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setLanguage(currentLang === 'ro' ? 'en' : 'ro');
        });
    }
    setLanguage(currentLang);

    // === 7. AIPA CALCULATOR (only on agro.html) ===
    const initAIPA = () => {
        const typeEl = document.getElementById('aipa-type');
        const amountEl = document.getElementById('aipa-amount');
        const amountVal = document.getElementById('aipa-amount-value');
        const hectEl = document.getElementById('aipa-hectares');
        const hectVal = document.getElementById('aipa-hectares-value');
        const entityEl = document.getElementById('aipa-entity');
        const resSubsidy = document.getElementById('aipa-result-subsidy');
        const resRate = document.getElementById('aipa-result-rate');
        const resROI = document.getElementById('aipa-result-roi');

        if (!typeEl || !amountEl) return; // Not on this page

        const rates = {
            equipment:  { rate: 0.50, cap: 3000000 },
            irrigation: { rate: 0.55, cap: 5000000 },
            greenhouse: { rate: 0.50, cap: 4000000 },
            livestock:  { rate: 0.50, cap: 3500000 },
            processing: { rate: 0.40, cap: 6000000 },
            orchard:    { rate: 0.60, cap: 4000000 }
        };

        let lastVal = 0;

        const calc = () => {
            const amount = parseFloat(amountEl.value);
            const entity = entityEl ? entityEl.value : 'srl';
            if (amountVal) amountVal.textContent = fmt(amount);
            if (hectVal) hectVal.textContent = hectEl ? hectEl.value : '50';

            const r = rates[typeEl.value];
            if (!r) return;
            let rate = r.rate;
            if (entity === 'cooperative') rate += 0.05;

            let subsidy = Math.min(amount * rate, r.cap);
            const effRate = amount > 0 ? (subsidy / amount) : 0;

            if (resSubsidy) {
                const display = `${fmt(subsidy)} MDL`;
                if (Math.abs(subsidy - lastVal) > 500) {
                    animateValue(resSubsidy, lastVal, subsidy, CONFIG.animDuration);
                    setTimeout(() => { resSubsidy.textContent = display; }, CONFIG.animDuration + 50);
                } else resSubsidy.textContent = display;
                lastVal = subsidy;
            }
            if (resRate) resRate.textContent = `${(effRate * 100).toFixed(0)}%`;
            if (resROI) resROI.textContent = amount > 0 ? `${(subsidy / amount * 100).toFixed(0)}%` : '0%';
        };

        [typeEl, amountEl, hectEl, entityEl].forEach(el => { if (el) el.addEventListener('input', calc); });
        calc();
    };

    // === 8. IT PARK CALCULATOR (only on itpark.html) ===
    const initITPark = () => {
        const revEl = document.getElementById('itpark-revenue');
        const revVal = document.getElementById('itpark-revenue-value');
        const empEl = document.getElementById('itpark-employees');
        const empVal = document.getElementById('itpark-employees-value');
        const salEl = document.getElementById('itpark-salary');
        const salVal = document.getElementById('itpark-salary-value');
        const countryEl = document.getElementById('itpark-country');
        const resSavings = document.getElementById('itpark-result-savings');
        const resMD = document.getElementById('itpark-result-md');
        const resOther = document.getElementById('itpark-result-other');
        const res5Y = document.getElementById('itpark-result-5year');
        const warningEl = document.getElementById('itpark-warning');

        if (!revEl || !empEl) return; // Not on this page

        const taxRates = {
            romania: 0.45, germany: 0.50, uk: 0.40,
            usa: 0.42, netherlands: 0.48, poland: 0.36, france: 0.55
        };
        let lastSavings = 0;

        const calc = () => {
            const revenue = parseFloat(revEl.value);
            const employees = parseFloat(empEl.value);
            const salary = parseFloat(salEl.value);
            if (revVal) revVal.textContent = fmt(revenue);
            if (empVal) empVal.textContent = employees;
            if (salVal) salVal.textContent = fmt(salary);

            const annualSalary = employees * salary * 12;
            const profitBT = revenue - annualSalary;
            const taxMD = revenue * 0.07;
            const compRate = taxRates[countryEl.value] || 0.45;
            const taxComp = profitBT > 0 ? profitBT * compRate : 0;
            const savings = taxComp - taxMD;

            if (warningEl) {
                warningEl.style.display = profitBT < 0 ? 'block' : 'none';
                if (profitBT < 0) warningEl.textContent = '⚠️ Cheltuielile salariale depășesc venitul.';
            }
            if (resMD) resMD.textContent = `${fmt(taxMD)} EUR`;
            if (resOther) resOther.textContent = `${fmt(taxComp)} EUR`;
            if (resSavings) {
                const display = `${fmt(savings)} EUR`;
                if (Math.abs(savings - lastSavings) > 200) {
                    animateValue(resSavings, lastSavings, savings, CONFIG.animDuration);
                    setTimeout(() => { resSavings.textContent = display; }, CONFIG.animDuration + 50);
                } else resSavings.textContent = display;
                lastSavings = savings;
            }
            if (res5Y) res5Y.textContent = `${fmt(savings * 5)} EUR`;
        };

        [revEl, empEl, salEl, countryEl].forEach(el => { if (el) el.addEventListener('input', calc); });
        calc();
    };

    // === 9. CONTACT FORM ===
    const contactForm = document.getElementById('contact-form');

    const showToast = (msg, type = 'success') => {
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '2rem', right: '-400px',
            background: type === 'success'
                ? 'linear-gradient(135deg, #e2c08d, #f3e4c8)'
                : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: type === 'success' ? '#06101a' : '#fff',
            padding: '1rem 2rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            transition: 'right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: '9999', maxWidth: '400px'
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.right = '2rem'; });
        setTimeout(() => {
            toast.style.right = '-400px';
            setTimeout(() => toast.remove(), 400);
        }, CONFIG.toastDuration);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            contactForm.querySelectorAll('[required]').forEach(f => {
                if (!f.value.trim()) { valid = false; f.classList.add('error'); }
                else f.classList.remove('error');
            });
            if (valid) {
                const btn = contactForm.querySelector('button[type="submit"]');
                const origText = btn ? btn.textContent : '';
                if (btn) { btn.textContent = '⏳ Trimitere...'; btn.disabled = true; }
                setTimeout(() => {
                    showToast('✓ Mesajul a fost trimis cu succes! Vă vom contacta în curând.');
                    contactForm.reset();
                    if (btn) { btn.textContent = origText; btn.disabled = false; }
                }, 800);
            } else {
                showToast('Completați toate câmpurile obligatorii.', 'error');
            }
        });
    }

    // === 10. PARALLAX ===
    const parallaxEls = document.querySelectorAll('.parallax-bg');
    if (parallaxEls.length > 0 && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                parallaxEls.forEach(el => {
                    el.style.backgroundPosition = `center ${-(scrolled * CONFIG.parallaxSpeed)}px`;
                });
            });
        }, { passive: true });
    }

    // === INIT CALCULATORS (safe to call on any page — they self-check) ===
    initAIPA();
    initITPark();

    // Page fade-in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });
});
