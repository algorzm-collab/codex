/* ===========================
   STRATEGY 컨설팅 - Main JavaScript
   =========================== */

// ===========================
// Navigation & Mobile Menu
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isOpen = navMenu.classList.contains('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.setAttribute('aria-label', '메뉴 열기');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

// ===========================
// CEO & Leadership Quotes API
// ===========================
const leadershipQuotes = [
    // 피터 드러커
    "경영의 본질은 효율성이 아니라 효과성이다 - 피터 드러커",
    "리더십의 핵심은 올바른 일을 하는 것이다 - 피터 드러커",
    "미래를 예측하는 가장 좋은 방법은 미래를 창조하는 것이다 - 피터 드러커",

    // 짐 콜린스
    "좋은 것은 위대한 것의 적이다 - 짐 콜린스",
    "위대한 비전은 위대한 사람 없이는 이루어질 수 없다 - 짐 콜린스",
    "누구를 버스에 태울 것인가가 어디로 갈 것인가보다 중요하다 - 짐 콜린스",

    // 마이클 포터
    "전략의 핵심은 무엇을 하지 않을 것인가를 선택하는 것이다 - 마이클 포터",
    "경쟁우위는 차별화에서 나온다 - 마이클 포터",
    "운영 효율성만으로는 충분하지 않다. 전략이 필요하다 - 마이클 포터",

    // 스티브 잡스
    "혁신은 리더와 추종자를 구분한다 - 스티브 잡스",
    "단순함은 복잡함보다 어렵다 - 스티브 잡스",
    "고객은 당신이 보여주기 전까지 무엇을 원하는지 모른다 - 스티브 잡스",

    // 잭 웰치
    "변화는 고통스럽지만, 변화하지 않는 것은 치명적이다 - 잭 웰치",
    "리더의 역할은 답을 제시하는 것이 아니라 올바른 질문을 던지는 것이다 - 잭 웰치",
    "승리하는 조직은 학습하는 조직이다 - 잭 웰치",

    // 워렌 버핏
    "리스크는 자신이 무엇을 하는지 모를 때 발생한다 - 워렌 버핏",
    "가격은 당신이 지불하는 것이고, 가치는 당신이 얻는 것이다 - 워렌 버핏",
    "명성을 쌓는 데는 20년이 걸리지만, 무너뜨리는 데는 5분이면 충분하다 - 워렌 버핏",

    // 빌 게이츠
    "성공은 최악의 스승이다. 똑똑한 사람들을 자만하게 만든다 - 빌 게이츠",
    "당신의 가장 불만족스러운 고객이 가장 위대한 학습의 원천이다 - 빌 게이츠",

    // 이나모리 카즈오
    "경영에는 원리원칙이 있다. 올바른 것을 올바르게 추구하라 - 이나모리 카즈오",
    "동기가 선해야 하고, 과정이 선해야 한다 - 이나모리 카즈오",

    // 앤디 그로브
    "편집증 환자만이 살아남는다 - 앤디 그로브",
    "전략적 변곡점을 놓치지 마라 - 앤디 그로브",

    // 클레이튼 크리스텐슨
    "혁신의 딜레마: 성공이 실패의 씨앗이 될 수 있다 - 클레이튼 크리스텐슨",
    "고객이 해결하려는 문제(Job to be Done)에 집중하라 - 클레이튼 크리스텐슨",

    // 게리 해멀
    "미래는 과거의 연장선이 아니다 - 게리 해멀",
    "전략적 혁신 없이는 생존할 수 없다 - 게리 해멀",

    // 톰 피터스
    "탁월함을 추구하라. 성공은 그 부산물일 뿐이다 - 톰 피터스",
    "브랜드는 약속이다. 약속을 지켜라 - 톰 피터스",

    // STRATEGY 고유 명언
    "좋은 전략은 현실(Sein)과 당위(Sollen)의 균형에서 시작됩니다",
    "조직의 미래는 오늘의 의사결정에서 결정됩니다",
    "변화는 선택이 아닌 생존의 조건입니다",
    "데이터는 말하고, 전략은 실행됩니다",
    "문제해결의 핵심은 Insight와 Outstanding의 Fermat Point입니다",
    "좋은 컨설턴트는 Sein과 Sollen을 함께 설계할 줄 아는 이입니다",
    "탁월함(Sheer Excellence)은 디테일에서 완성됩니다",
    "실행 없는 전략은 환상이고, 전략 없는 실행은 악몽이다",
    "조직의 경쟁력은 학습 속도에서 나옵니다",
    "현재를 진단하고, 미래를 설계하고, 오늘을 실행하라"
];

// Hero Background Slider
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;
    const slideInterval = 6000; // Change slide every 6 seconds

    setInterval(() => {
        // Deactivate current slide
        slides[currentSlide].classList.remove('active');

        // Pause video in current slide if exists
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
        }

        // Calculate next slide
        currentSlide = (currentSlide + 1) % slides.length;

        // Activate next slide
        slides[currentSlide].classList.add('active');

        // Play video in next slide if exists
        const nextVideo = slides[currentSlide].querySelector('video');
        if (nextVideo) {
            nextVideo.play().catch(e => console.log("Video play failed:", e));
        }
    }, slideInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
});

// Hero Quotes Rotation
let currentQuoteIndex = 0;
const quoteElements = document.querySelectorAll('.hero-quotes .quote');

function rotateQuotes() {
    if (quoteElements.length === 0) return;

    // Hide current quote
    quoteElements.forEach(el => el.classList.remove('active'));

    // Show next quote
    currentQuoteIndex = (currentQuoteIndex + 1) % quoteElements.length;
    quoteElements[currentQuoteIndex].classList.add('active');
}

// Initialize quote rotation
if (quoteElements.length > 0) {
    // Update quotes with random selection from leadershipQuotes
    quoteElements.forEach((el, index) => {
        const randomIndex = Math.floor(Math.random() * leadershipQuotes.length);
        const quote = leadershipQuotes[randomIndex];

        // Extract quote text and author
        const parts = quote.split(' - ');
        const quoteText = parts[0];
        const author = parts[1] || 'STRATEGY';

        // Update DOM structure
        el.querySelector('.quote-text').textContent = quoteText;
        el.querySelector('.quote-author').textContent = `- ${author}`;
    });

    // Start rotation every 5 seconds
    setInterval(rotateQuotes, 5000);
}

// ===========================
// Counter Animation (Enhanced)
// ===========================
function animateCounter(element) {
    // Get target value from data-target or data-count attribute
    const targetAttr = element.getAttribute('data-target') || element.getAttribute('data-count');
    const target = parseInt(targetAttr);

    // Validate target value
    if (isNaN(target) || target === 0) {
        console.warn('Invalid counter target:', element);
        return;
    }

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOutCubic * target);

        if (progress < 1) {
            element.textContent = current;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(updateCounter);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Delay animation slightly for better visual effect
            setTimeout(() => {
                animateCounter(entry.target);
            }, 100);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

// Observe all counter elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });
});

// ===========================
// Project Tabs
// ===========================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        document.getElementById(targetTab)?.classList.add('active');
    });
});

// ===========================
// Contact Form
// ===========================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const formStartedAt = document.getElementById('formStartedAt');

function resetFormClock() {
    if (formStartedAt) formStartedAt.value = String(Date.now());
}

resetFormClock();

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    const original = e.target.value;
    if (original.trim().startsWith('+')) {
        e.target.value = original.replace(/[^\d+\-()\s]/g, '').slice(0, 40);
        return;
    }

    let value = original.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.startsWith('02') && value.length > 2) {
        if (value.length <= 5) {
            value = value.slice(0, 2) + '-' + value.slice(2);
        } else if (value.length <= 9) {
            value = value.slice(0, 2) + '-' + value.slice(2, 5) + '-' + value.slice(5);
        } else {
            value = value.slice(0, 2) + '-' + value.slice(2, 6) + '-' + value.slice(6);
        }
    } else if (value.length > 3 && value.length <= 7) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else if (value.length > 7) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    }

    e.target.value = value;
});

function showFormMessage(type, message) {
    if (!formMessage) return;
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    formMessage.style.display = 'block';
}

// Form submission
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    const submitButton = contactForm.querySelector('.submit-btn');
    const originalButtonHtml = submitButton?.innerHTML;
    const formData = Object.fromEntries(new FormData(contactForm).entries());

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    }

    showFormMessage('sending', '상담 신청을 안전하게 전송하고 있습니다.');

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(result.message || '상담 신청을 전송하지 못했습니다.');
        }

        contactForm.reset();
        resetFormClock();
        showFormMessage('success', '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.');
    } catch (error) {
        console.error('Contact form error:', error);
        showFormMessage('error', '전송에 실패했습니다. ceo@strat.kr로 직접 메일을 보내주시거나 02-6083-0330으로 연락해 주세요.');
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHtml;
        }
    }
});

// ===========================
// Scroll to Top Button
// ===========================
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollToTopBtn?.classList.add('visible');
    } else {
        scrollToTopBtn?.classList.remove('visible');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===========================
// AOS Animation Initialize
// ===========================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
}

// ===========================
// Easter Egg - Konami Code
// ===========================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;

        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Rainbow animation
    document.body.style.animation = 'rainbow 3s linear infinite';

    // Add confetti effect
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
        createConfetti();
    }

    // Alert message
    setTimeout(() => {
        alert('🎉 Sheer Excellence! Fermat Point 발견! 🎯');
        document.body.style.animation = '';
    }, 3000);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';

    document.body.appendChild(confetti);

    const fallDuration = Math.random() * 3 + 2;
    const fallDistance = window.innerHeight + 10;

    confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${fallDistance}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: fallDuration * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    setTimeout(() => {
        confetti.remove();
    }, fallDuration * 1000);
}

// Rainbow keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===========================
// Performance Optimization
// ===========================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Dynamic Quote Refresh
// ===========================

// Refresh quotes every 30 seconds with new random selection
setInterval(() => {
    quoteElements.forEach((el, index) => {
        const randomIndex = Math.floor(Math.random() * leadershipQuotes.length);
        const quote = leadershipQuotes[randomIndex];

        // Extract quote text and author
        const parts = quote.split(' - ');
        const quoteText = parts[0];
        const author = parts[1] || 'STRATEGY';

        // Update DOM structure
        el.querySelector('.quote-text').textContent = quoteText;
        el.querySelector('.quote-author').textContent = `- ${author}`;
    });
}, 30000);

// ===========================
// Page Load Performance
// ===========================
window.addEventListener('load', () => {
    console.log('%c🎯 STRATEGY 컨설팅', 'font-size: 24px; font-weight: bold; color: #5d8ab8;');
    console.log('%cSein & Sollen의 Fermat Point를 찾는 문제해결 전략가', 'font-size: 14px; color: #a9c6e8;');
    console.log('%c프로필 방문을 환영합니다!', 'font-size: 12px; color: #666;');
});

// Track page visibility for analytics
let pageVisible = true;
document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    if (pageVisible) {
        console.log('Welcome back to STRATEGY!');
    }
});

// ===========================
// Responsive Video Background
// ===========================
const heroVideo = document.querySelector('.hero-slide video');
if (heroVideo) {
    // Pause video on mobile to save bandwidth
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        heroVideo.pause();
    }

    // Resume on desktop
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth < 768;
        if (nowMobile && !heroVideo.paused) {
            heroVideo.pause();
        } else if (!nowMobile && heroVideo.paused) {
            heroVideo.play().catch(e => console.log("Video resume failed:", e));
        }
    });
}

// ===========================
// SEO & Analytics Ready
// ===========================

// Google Analytics placeholder
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track form submissions
contactForm?.addEventListener('submit', () => {
    trackEvent('Contact', 'Form Submit', 'Contact Form');
});

// Track tab clicks
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        trackEvent('Projects', 'Tab Click', tabName);
    });
});

// Track external link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('External Link', 'Click', link.href);
    });
});

console.log('✅ STRATEGY 컨설팅 웹사이트 초기화 완료');
console.log('📊 100+ 프로젝트 실적 | 4개 전문 분야 | Fermat Point 방법론');
