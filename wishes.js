import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

    wishForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const senderName = document.getElementById("senderName").value;
        const wishMessage = document.getElementById("wishMessage").value;
        const submitBtn = wishForm.querySelector(".submit-btn");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending Wish...";

            // 📝 Firestore Database ထဲကို နာမည်နဲ့ စာသားပဲ တိုက်ရိုက်သွင်းပါတယ်
            await addDoc(collection(db, "wishes"), {
                name: senderName,
                message: wishMessage,
                image: "https://placehold.co/600x400/9bd8f0/04203a?text=Best+Wishes", // ပုံနေရာမှာ Default ပုံလေးပဲ ပြထားပါမယ်
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

    const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (querySnapshot) => {
        galleryGrid.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = document.createElement("div");
            card.classList.add("polaroid-card");
            card.style.cursor = "pointer";
            
            const randomRotate = (Math.transform ? (Math.random() * 10 - 5).toFixed(1) : 0);
            card.style.transform = `rotate(${randomRotate}deg)`;

            card.innerHTML = `
                <img src="${data.image}" alt="Memory Photo">
                <div class="polaroid-text">
                    <p class="sender" style="font-size: 12px; color: #333; font-weight: 600; margin-top: 5px;">- From ${data.name}</p>
                    <small style="font-size: 9px; color: #888; display: block; margin-top: 2px;">✉️ Click to read wish</small>
                </div>
            `;

            card.addEventListener("click", () => {
                document.getElementById("modalSenderName").textContent = `✨ From ${data.name}'s Heart`;
                document.getElementById("modalMessage").textContent = data.message;
                document.getElementById("modalImage").src = data.image;
                
                const wishModal = new bootstrap.Modal(document.getElementById('wishModal'));
                wishModal.show();
            });

            galleryGrid.appendChild(card);
        });
    });
});
