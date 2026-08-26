(() => {
  'use strict';

  const BOOKING_URL = 'https://cal.com/rami-sebaie/closatix-discovery-call';
  const locale = document.documentElement.lang === 'en' ? 'en-US' : 'ar-SA';
  const isArabic = document.documentElement.lang !== 'en';

  document.querySelectorAll('.js-book').forEach((link) => {
    link.href = BOOKING_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const header = document.querySelector('.site-header');
  const syncHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 14);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('is-open', !open);
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -42px' });
    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('is-visible'));
  }

  const pageSections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if ('IntersectionObserver' in window && pageSections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navAnchors.forEach((anchor) => {
        anchor.toggleAttribute('aria-current', anchor.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-18% 0px -62% 0px' });
    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item').forEach((otherItem) => {
        const otherButton = otherItem.querySelector('.faq-question');
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  const tabs = [...document.querySelectorAll('.use-tab')];
  const panels = [...document.querySelectorAll('.use-panel')];
  const activateTab = (tab) => {
    const panelId = tab.getAttribute('aria-controls');
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.id === panelId));
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
      activateTab(tabs[next]);
    });
  });

  const demoMessages = document.querySelector('.demo-messages');
  const demoStart = document.querySelector('[data-demo-start]');
  const demoReset = document.querySelector('[data-demo-reset]');
  const demoOutput = document.querySelector('[data-demo-output]');
  let demoTimers = [];
  let demoRunning = false;

  const callScripts = {
    ar: [
      ['agent', 'المساعد الذكي', 'السلام عليكم، أهلاً بك في صيانة التكييف. كيف أقدر أخدمك اليوم؟'],
      ['caller', 'العميل', 'المكيف شغال لكن ما عم يبرد، وبدي فني اليوم إذا ممكن.'],
      ['agent', 'المساعد الذكي', 'أكيد. المشكلة بمكيف واحد؟ وبأي مدينة وحي موجود؟'],
      ['caller', 'العميل', 'مكيف واحد، الرياض — حي الياسمين.'],
      ['agent', 'المساعد الذكي', 'المنطقة ضمن نطاق الخدمة. عندي اليوم 5:30 أو 7 مساءً، أي وقت أنسب؟'],
      ['caller', 'العميل', 'الساعة 7 ممتاز.'],
      ['agent', 'المساعد الذكي', 'تم الحجز اليوم الساعة 7. رح يصلك تأكيد، وتم إرسال تفاصيل الطلب للفريق.']
    ],
    en: [
      ['agent', 'AI assistant', 'Hello, thank you for calling AC Service. How can I help you today?'],
      ['caller', 'Customer', 'My AC is running but it is not cooling. I need a technician today if possible.'],
      ['agent', 'AI assistant', 'Of course. Is it one unit, and which city and district are you located in?'],
      ['caller', 'Customer', 'One unit, Riyadh — Al Yasmin.'],
      ['agent', 'AI assistant', 'You are within the service area. I have 5:30 PM or 7:00 PM today. Which works best?'],
      ['caller', 'Customer', '7:00 PM works.'],
      ['agent', 'AI assistant', 'Booked for 7:00 PM today. A confirmation is on the way, and the team has received the job details.']
    ]
  };

  const clearDemoTimers = () => {
    demoTimers.forEach((timer) => window.clearTimeout(timer));
    demoTimers = [];
  };

  const resetDemo = () => {
    clearDemoTimers();
    demoRunning = false;
    if (demoMessages) demoMessages.innerHTML = '';
    if (demoOutput) demoOutput.classList.remove('is-complete');
    if (demoStart) {
      demoStart.disabled = false;
      demoStart.querySelector('span').textContent = isArabic ? 'ابدأ المحاكاة' : 'Play the call';
    }
  };

  const appendDemoMessage = ([type, role, copy]) => {
    if (!demoMessages) return;
    const article = document.createElement('article');
    article.className = `demo-message ${type}`;
    const label = document.createElement('span');
    label.className = 'message-role';
    label.textContent = role;
    const text = document.createElement('p');
    text.className = 'message-copy';
    text.textContent = copy;
    article.append(label, text);
    demoMessages.appendChild(article);
    requestAnimationFrame(() => article.classList.add('is-visible'));
    demoMessages.scrollTo({ top: demoMessages.scrollHeight, behavior: 'smooth' });
  };

  const runDemo = () => {
    if (!demoMessages || !demoStart || demoRunning) return;
    resetDemo();
    demoRunning = true;
    demoStart.disabled = true;
    demoStart.querySelector('span').textContent = isArabic ? 'المكالمة جارية…' : 'Call in progress…';
    const script = callScripts[isArabic ? 'ar' : 'en'];
    script.forEach((message, index) => {
      demoTimers.push(window.setTimeout(() => appendDemoMessage(message), index * 1020));
    });
    demoTimers.push(window.setTimeout(() => {
      demoRunning = false;
      demoStart.disabled = false;
      demoStart.querySelector('span').textContent = isArabic ? 'إعادة تشغيل المكالمة' : 'Replay the call';
      if (demoOutput) demoOutput.classList.add('is-complete');
    }, (script.length * 1020) + 420));
  };

  if (demoStart) demoStart.addEventListener('click', runDemo);
  if (demoReset) demoReset.addEventListener('click', resetDemo);

  const roiInputs = [...document.querySelectorAll('[data-roi-input]')];
  const outputCalls = document.querySelector('[data-roi-calls]');
  const outputJobs = document.querySelector('[data-roi-jobs]');
  const outputRevenue = document.querySelector('[data-roi-revenue]');

  const readNumber = (name, fallback = 0) => {
    const input = document.querySelector(`[data-roi-input="${name}"]`);
    if (!input) return fallback;
    const parsed = Number.parseFloat(input.value);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  };

  const formatNumber = (number, maximumFractionDigits = 0) => new Intl.NumberFormat(locale, {
    maximumFractionDigits
  }).format(number);

  const formatCurrency = (number) => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0
  }).format(number);

  const calculateRoi = () => {
    const monthlyCalls = readNumber('calls');
    const lostRate = Math.min(100, readNumber('lost')) / 100;
    const recoveryRate = Math.min(100, readNumber('recovery')) / 100;
    const closeRate = Math.min(100, readNumber('close')) / 100;
    const averageJob = readNumber('value');

    const recoveredCalls = monthlyCalls * lostRate * recoveryRate;
    const expectedJobs = recoveredCalls * closeRate;
    const potentialRevenue = expectedJobs * averageJob;

    if (outputCalls) outputCalls.textContent = formatNumber(recoveredCalls, 1);
    if (outputJobs) outputJobs.textContent = formatNumber(expectedJobs, 1);
    if (outputRevenue) outputRevenue.textContent = formatCurrency(potentialRevenue);
  };

  roiInputs.forEach((input) => {
    input.addEventListener('input', calculateRoi);
    input.addEventListener('blur', () => {
      const min = Number.parseFloat(input.min || '0');
      const max = Number.parseFloat(input.max || '999999');
      let value = Number.parseFloat(input.value || '0');
      if (!Number.isFinite(value)) value = min;
      input.value = String(Math.min(max, Math.max(min, value)));
      calculateRoi();
    });
  });
  calculateRoi();
})();
