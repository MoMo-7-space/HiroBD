// ၁။ Intro Screen ကို ပိတ်ပြီး Main Content ပြောင်းမယ့် Logic
const introScreen = document.getElementById('intro-screen');
const mainContent = document.getElementById('main-content');

introScreen.addEventListener('click', () => {
    introScreen.style.transition = 'opacity 0.8s ease';
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        mainContent.style.display = 'block'; // လက်ဆောင်ဘူးရှိတဲ့ page ပေါ်လာမယ်
        autoBurstSparkles(); // Sparkles ပေါက်ကွဲတာကို တစ်ခါတည်း ခေါ်လိုက်ခြင်း
    }, 800);
});

// ၂။ Heart Particle Animation Logic
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 300;

const particles = [];
const particleCount = 250;

function getHeartPoint(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
    };
}

for (let i = 0; i < particleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const point = getHeartPoint(t);
    particles.push({
        x: canvas.width / 2 + point.x * 7,
        y: canvas.height / 2 + point.y * 7,
        baseX: canvas.width / 2 + point.x * 7,
        baseY: canvas.height / 2 + point.y * 7,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.5
    });
}

function animateHeart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.x += p.speedX + (Math.sin(Date.now() * 0.005 + p.baseY) * 0.1);
        p.y += p.speedY + (Math.cos(Date.now() * 0.005 + p.baseX) * 0.1);
        
        if (Math.abs(p.x - p.baseX) > 10) p.speedX *= -1;
        if (Math.abs(p.y - p.baseY) > 10) p.speedY *= -1;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
        ctx.fillStyle = "rgba(96, 165, 250, "+ p.alpha +")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    requestAnimationFrame(animateHeart);
}

animateHeart();

function autoBurstSparkles() {
    const positions = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 }
    ];

    positions.forEach((pos, index) => {
        setTimeout(() => {
            // တကယ်လို့ မိုမိုဆီမှာ createSparkles ဖန်ရှင်ရှိရင် အလုပ်လုပ်ဖို့ပါ
            if (typeof createSparkles === "function") {
                createSparkles({ clientX: pos.x, clientY: pos.y });
            }
        }, index * 400);
    });
}

// ၃။ Music Controller Logic (Module သုံးထားလို့ window. ထဲ ထည့်ပေးရပါတယ်)
window.toggleMusic = function() {
    const music = document.getElementById('bg-music');
    const vinyl = document.getElementById('vinyl');
    const statusText = document.getElementById('status-text');

    if (music.paused) {
        music.play().catch(err => console.log("Audio play blocked:", err));
        vinyl.style.animationPlayState = 'running';
        statusText.innerText = '⏸';
    } else {
        music.pause();
        vinyl.style.animationPlayState = 'paused';
        statusText.innerText = '▶';
    }
}
