
        // =========================================
        // ၁။ Countdown Logic သင်္ချာတွက်ချက်မှု
        // =========================================
        // 💡 ဤနေရာတွင် Hiro ရဲ့ မွေးနေ့ Target Date ကို စိတ်ကြိုက် ပြောင်းလဲနိုင်ပါတယ်
        const birthdayTarget = new Date("August 30, 2026 00:00:00").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const difference = birthdayTarget - now;

            // အကယ်၍ သတ်မှတ်ချိန် ကျော်သွားခဲ့ရင် 00 ချည်းပဲ ပြထားဖို့
            if (difference < 0) {
                document.getElementById("days").innerText = "00";
                document.getElementById("hours").innerText = "00";
                document.getElementById("minutes").innerText = "00";
                document.getElementById("seconds").innerText = "00";
                return;
            }

            // တန်ဖိုးများကို နေ့၊ နာရီ၊ မိနစ်၊ စက္ကန့်အဖြစ် သင်္ချာပုံသေနည်းဖြင့် တွက်ချက်ခြင်း
            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            // ဂဏန်းတွေ ၁ လုံးတည်းဖြစ်နေရင် ရှေ့က 0 ခံပေးဖို့ (ဥပမာ- 09, 05)
            document.getElementById("days").innerText = d < 10 ? "0" + d : d;
            document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
            document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
            document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
        }

        // ၁ စက္ကန့်ပြည့်တိုင်း ကောင်တာကို အလိုအလျောက် Update လုပ်ခိုင်းခြင်း
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Page စဖွင့်ချင်း တစ်ကြိမ် အရင် run ထားခြင်း
