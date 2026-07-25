/* ============================================================
   Rayyan Azher — Portfolio interactions
   ============================================================ */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Loader ---------- */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 450);
    });
    // Safety net in case a remote asset stalls the load event.
    setTimeout(() => loader.classList.add('hidden'), 3500);

    /* ---------- Theme ---------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        localStorage.setItem('theme', theme);
    };

    applyTheme(localStorage.getItem('theme') || 'dark');

    themeToggle.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    /* ---------- Mobile navigation ---------- */
    const nav = document.getElementById('nav');
    const navLinksWrap = document.getElementById('navLinks');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const navBackdrop = document.getElementById('navBackdrop');

    const openMenu = () => {
        navLinksWrap.classList.add('open');
        navBackdrop.classList.add('open');
        document.body.classList.add('nav-open');
    };
    const closeMenu = () => {
        navLinksWrap.classList.remove('open');
        navBackdrop.classList.remove('open');
        document.body.classList.remove('nav-open');
    };

    document.getElementById('navBurger').addEventListener('click', openMenu);
    document.getElementById('navClose').addEventListener('click', closeMenu);
    navBackdrop.addEventListener('click', closeMenu);
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    /* ---------- Scroll: navbar state, progress bar, back-to-top, scroll spy ---------- */
    const progressBar = document.getElementById('scrollProgress');
    const toTop = document.getElementById('toTop');
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const onScroll = () => {
        const y = window.scrollY;

        nav.classList.toggle('scrolled', y > 30);
        toTop.classList.toggle('show', y > 600);

        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

        // Highlight the section currently occupying the upper third of the viewport.
        let current = sections[0];
        sections.forEach((section) => {
            if (y >= section.offsetTop - window.innerHeight / 3) current = section;
        });
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
        });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            onScroll();
            ticking = false;
        });
    }, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    /* ---------- Typing effect ---------- */
    const typedEl = document.getElementById('typed');
    const phrases = [
        'Software Developer',
        'Full-Stack Engineer',
        'Cloud & AI Explorer',
        'Computer Science Student'
    ];

    if (prefersReducedMotion) {
        typedEl.textContent = phrases[0];
    } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const type = () => {
            const phrase = phrases[phraseIndex];
            charIndex += deleting ? -1 : 1;
            typedEl.textContent = phrase.slice(0, charIndex);

            let delay = deleting ? 45 : 85;
            if (!deleting && charIndex === phrase.length) {
                delay = 1800;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 350;
            }
            setTimeout(type, delay);
        };
        setTimeout(type, 700);
    }

    /* ---------- Reveal on scroll ---------- */
    const revealItems = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const delay = Number(entry.target.dataset.revealDelay || 0);
            setTimeout(() => entry.target.classList.add('revealed'), delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = Number(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const duration = 1400;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => countObserver.observe(counter));

    /* ---------- Pointer tilt on cards ---------- */
    if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform =
                    `translateY(-8px) perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Contact form ---------- */
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxQ77n4KIWtBPlQawIDXXXjUYAXOyf758m6m6QOmZC8r55EfWSR1z3PPC04bhTUZZ9V/exec';
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('msg');
    const submitBtn = document.getElementById('submitBtn');
    const btnLabel = submitBtn.querySelector('.btn-label');

    const showMessage = (text, type) => {
        msg.textContent = text;
        msg.className = 'form-msg ' + type;
        setTimeout(() => {
            msg.textContent = '';
            msg.className = 'form-msg';
        }, 6000);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;
        form.querySelectorAll('input, textarea').forEach((input) => {
            const invalid = !input.value.trim() || (input.type === 'email' && !input.checkValidity());
            input.parentElement.classList.toggle('invalid', invalid);
            if (invalid) valid = false;
        });

        if (!valid) {
            showMessage('Please fill in every field with a valid entry.', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        btnLabel.textContent = 'Sending...';

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => {
                showMessage('Message sent successfully — I\'ll get back to you soon!', 'success');
                form.reset();
            })
            .catch(() => {
                showMessage('Something went wrong. Please email me directly instead.', 'error');
            })
            .finally(() => {
                submitBtn.classList.remove('loading');
                btnLabel.textContent = 'Send message';
            });
    });

    form.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('input', () => input.parentElement.classList.remove('invalid'));
    });

    /* ---------- Footer year ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();
})();
