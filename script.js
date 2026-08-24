/**
 * HIGH-END PORTFOLIO INTERACTIONS
 * Handles: Custom cursor, Magnetic buttons, 3D Card Tilt, Hover Glow, Particles, Reveals
 */

// 1. CUSTOM CURSOR GLOW
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }
});
document.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
});

// 2. MOUSE TRACKING GLOW ON CARDS (The "Bestest" Hover Effect)
const handleOnMouseMove = e => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
    
    target.style.setProperty("--mouse-x", x + 'px');
    target.style.setProperty("--mouse-y", y + 'px');
}

for(const card of document.querySelectorAll(".card")) {
    card.onmousemove = e => handleOnMouseMove(e);
}

// 3. 3D TILT EFFECT (Vanilla JS)
const tiltCards = document.querySelectorAll('.tilt');
tiltCards.forEach(card => {
    const content = card.querySelector('.card-content');
    
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        content.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateZ(10px)";
    });
    
    card.addEventListener('mouseleave', () => {
        content.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
});

// 4. MAGNETIC BUTTONS
const magnets = document.querySelectorAll('.magnetic');
magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', e => {
        const position = magnet.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        
        magnet.style.transform = "translate(" + (x * 0.3) + "px, " + (y * 0.5) + "px)";
    });
    
    magnet.addEventListener('mouseleave', () => {
        magnet.style.transform = 'translate(0px, 0px)';
    });
});

// 5. PARTICLES NETWORK (Interactive Constellation)
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let width, height, particles = [];
let mouse = { x: null, y: null, radius: 150 };

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    
    const count = Math.min(80, Math.floor(width / 20)); 
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        });
    }
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});
window.addEventListener('resize', initParticles);

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0, 242, 254, " + (0.1 - dist/1200) + ")";
                ctx.lineWidth = 1;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
        
        if (mouse.x != null) {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < mouse.radius) {
                p.x += dx * 0.01;
                p.y += dy * 0.01;
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// 6. TYPING EFFECT
const el = document.getElementById('typed');
const phrases = ['Developer.', 'Creator.', 'BCA Graduate.', 'Tech Enthusiast.'];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
    if(!el) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(type, 2000);
            return;
        }
    } else {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
        }
    }
    setTimeout(type, deleting ? 50 : 100);
}
setTimeout(type, 1000);

// 7. INTERSECTION OBSERVER FOR REVEALS & STATS
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            if(entry.target.classList.contains('card') && !entry.target.classList.contains('counted')) {
                const numEl = entry.target.querySelector('.stat-num');
                if (numEl) {
                    entry.target.classList.add('counted');
                    const target = parseFloat(numEl.dataset.target);
                    const isDec = target % 1 !== 0;
                    let current = 0;
                    const update = () => {
                        current += target / 60;
                        if (current < target) {
                            numEl.textContent = isDec ? current.toFixed(2) : Math.ceil(current);
                            requestAnimationFrame(update);
                        } else {
                            numEl.textContent = target;
                        }
                    };
                    update();
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-fade, .reveal-text').forEach(el => observer.observe(el));

// 8. HEADER & SCROLL SPY
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) {
            current = sec.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// 9. MOBILE MENU
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navList.classList.toggle('open');
});
document.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navList.classList.remove('open');
}));

// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// 10. DISABLE COPY & SELECTION
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'x')) {
        e.preventDefault();
    }
});
