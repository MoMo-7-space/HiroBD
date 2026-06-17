
    
    // ၁။ Intro Screen ကို ပိတ်ပြီး Main Content ပြောင်းမယ့် Function
        const introScreen = document.getElementById('intro-screen');
        const mainContent = document.getElementById('main-content');

        introScreen.addEventListener('click', () => {
        introScreen.style.transition = 'opacity 0.8s ease';
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.style.display = 'block'; // လက်ဆောင်ဘူးရှိတဲ့ page ပေါ်လာမယ်
        }, 800);
        });

        // ၂။ Heart Particle Animation Logic
        const canvas = document.getElementById('heartCanvas');
        const ctx = canvas.getContext('2d');

        // Canvas size သတ်မှတ်ခြင်း
        canvas.width = 300;
        canvas.height = 300;

        const particles = [];
        const particleCount = 250; // အမှုန်အရေအတွက် (စိတ်ကြိုက်တိုး/လျော့လုပ်နိုင်တယ်)

        // နှလုံးသားပုံဖော်မယ့် သင်္ချာ Equation 
        function getHeartPoint(t) {
        return {
            x: 16 * Math.pow(Math.sin(t), 3),
            y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
        };
        }

        // Particle Object ဆောက်ခြင်း
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

        // Animation ဆွဲမယ့် Loop
        function animateHeart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            // ညင်ညင်သာသာ တုန်ခါနေစေမယ့် လှုပ်ရှားမှု
            p.x += p.speedX + (Math.sin(Date.now() * 0.005 + p.baseY) * 0.1);
            p.y += p.speedY + (Math.cos(Date.now() * 0.005 + p.baseX) * 0.1);
            
            // မူလနေရာကနေ အရမ်းလွင့်မသွားအောင် ထိန်းတာ
            if (Math.abs(p.x - p.baseX) > 10) p.speedX *= -1;
            if (Math.abs(p.y - p.baseY) > 10) p.speedY *= -1;
            
            // အမှုန်လေးတွေ ဆွဲခြင်း (Glow Effect ပါအောင် လုပ်ထားတယ်)
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#3b82f6';
            ctx.fillStyle = "rgba(96, 165, 250, "+ p.alpha +")";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateHeart);
        }

        // Animation စတင်ခြင်း
        animateHeart();
        // 💡 <script> ရဲ့ အောက်ဆုံးမှာ ဒါလေးကို ထပ်တိုးထည့်ပေးပါ
function autoBurstSparkles() {
    // စခရင်ရဲ့ ဘယ်ဘက်၊ အလယ်၊ ညာဘက် နေရာစုံ Coordinate တွေကို သတ်မှတ်တာပါ
    const positions = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3 }, // ဘယ်ဘက်အပေါ်နား
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 }, // အလယ်တည့်တည့်
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3 }  // ညာဘက်အပေါ်နား
    ];

    // တစ်နေရာချင်းစီကို အချိန်နည်းနည်းစီခြားပြီး ဖောင်းခနဲ ပေါက်ကွဲခိုင်းတာပါ
    positions.forEach((pos, index) => {
        setTimeout(() => {
            // အရှေ့မှာ ရေးခဲ့တဲ့ createSparkles Function ထဲကို Coordinate တွေလှမ်းပို့တာပါ
            createSparkles({ clientX: pos.x, clientY: pos.y });
        }, index * 400); // 0.4 စက္ကန့်စီ ခြားပြီး တစ်လုံးချင်းစီ ပေါက်ကွဲမယ်
    });
}// =========================================
        // ၂။ Music Controller Logic 
        // =========================================
        function toggleMusic() {
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