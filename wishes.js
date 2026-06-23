import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Moomies ရဲ့ Firebase project configuration 🔑
const firebaseConfig = {
    apiKey: "AIzaSyDKhHcjnae2RXU8Qk5R0z2d0rn9WJkEpuA",
    authDomain: "hiro-wishes.firebaseapp.com",
    projectId: "hiro-wishes",
    storageBucket: "hiro-wishes.firebasestorage.app",
    messagingSenderId: "222152904767",
    appId: "1:222152904767:web:0bcda3eb8b40656ff0e88a",
    measurementId: "G-KMZ028QH94"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function() {
    const wishForm = document.getElementById("wishForm");
    const galleryGrid = document.getElementById("galleryGrid");

    // Form Submit လုပ်တဲ့အခါ Database ထဲလှမ်းသိမ်းခြင်း
    wishForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const senderName = document.getElementById("senderName").value;
        const wishMessage = document.getElementById("wishMessage").value;
        const submitBtn = wishForm.querySelector(".submit-btn");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending Wish...";

            // Firestore ရဲ့ "wishes" collection ထဲကို တိုက်ရိုက်ထည့်ပါတယ်
            await addDoc(collection(db, "wishes"), {
                name: senderName,
                message: wishMessage,
                timestamp: new Date()
            });

            wishForm.reset();
            alert("ဆုတောင်းစကားလေး ပို့လိုက်ပါပြီ! 💖");

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("ဒေတာတင်ရတာ အဆင်မပြေဖြစ်သွားပါတယ်။");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Wish";
        }
    });

    // Realtime Database ကနေ ဒေတာတွေဆွဲထုတ်ပြီး Board ပေါ်တင်ခြင်း
    const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (querySnapshot) => {
        galleryGrid.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement("div");
            
            // Message Card သီးသန့် Style သတ်မှတ်ခြင်း
            card.classList.add("polaroid-card");
            card.style.cursor = "pointer";
            card.style.padding = "20px";
            card.style.minHeight = "160px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.justifyContent = "space-between";
            
            // ကတ်လေးတွေကို သဘာဝကျကျ စောင်းစောင်းလေးတွေ ဖြစ်နေအောင် လုပ်တာပါ
            const randomRotate = (Math.random() * 6 - 3).toFixed(1);
            card.style.transform = `rotate(${randomRotate}deg)`;

            // စာသား အရမ်းရှည်ရင် ကတ်ထဲမှာ အစက်လေးတွေနဲ့ ဖြတ်ပြထားပါမယ်
            const shortMessage = data.message.length > 70 ? data.message.substring(0, 70) + "..." : data.message;

            card.innerHTML = `
                <div class="card-message-body" style="font-size: 15px; color: #444; font-style: italic; line-height: 1.5; font-family: 'Plus Jakarta Sans', sans-serif;">
                    "${shortMessage}"
                </div>
                <div class="card-footer-sender" style="border-top: 1px dashed #e2e8f0; margin-top: 10px; padding-top: 8px;">
                    <p class="sender" style="font-size: 13px; color: #173358; font-weight: 600; text-align: right; margin: 0;">- From ${data.name}</p>
                </div>
            `;

            // ကတ်ပြားကို နှိပ်လိုက်ရင် Modal Box အကြီးပွင့်လာပြီး စာအပြည့်အစုံ ပြပေးမယ့် Function
            card.addEventListener("click", () => {
                document.getElementById("modalSenderName").textContent = `✨ From ${data.name}'s Heart`;
                document.getElementById("modalMessage").textContent = data.message;
                
                const wishModal = new bootstrap.Modal(document.getElementById('wishModal'));
                wishModal.show();
            });

            galleryGrid.appendChild(card);
        });
    });
});
