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
    const imageUpload = document.getElementById("imageUpload");
    const fileStatus = document.getElementById("fileStatus");
    const galleryGrid = document.getElementById("galleryGrid");

    let selectedImageBase64 = "";

    imageUpload.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            fileStatus.textContent = "Selected: " + file.name;
            const reader = new FileReader();
            reader.onload = function(event) {
                selectedImageBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    wishForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const senderName = document.getElementById("senderName").value;
        const wishMessage = document.getElementById("wishMessage").value;

        if (!selectedImageBase64) {
            alert("Please upload a photo first!");
            return;
        }

        try {
            await addDoc(collection(db, "wishes"), {
                name: senderName,
                message: wishMessage,
                image: selectedImageBase64,
                timestamp: new Date()
            });

            wishForm.reset();
            fileStatus.textContent = "No photo selected";
            selectedImageBase64 = "";
            alert("ဆုတောင်းစကားလေး ပို့လိုက်ပါပြီ! 💖");

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error ဖြစ်သွားပါတယ်။ Firebase Rules ကို သေချာပြင်ခဲ့ရဲ့လား ပြန်စစ်ပေးပါဦးနော်။");
        }
    });

    const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
    
    onSnapshot(q, (querySnapshot) => {
    galleryGrid.innerHTML = "";
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const card = document.createElement("div");
        card.classList.add("polaroid-card");
        
        // ကတ်လေးတွေကို နှိပ်လို့ရမှန်းသိအောင် cursor pointer ပေးပြီး modal ဖွင့်မယ့် data တွေ ထည့်တာပါ
        card.style.cursor = "pointer";
        
        const randomRotate = (Math.random() * 10 - 5).toFixed(1);
        card.style.transform = `rotate(${randomRotate}deg)`;

        // HTML အဟောင်းထဲက message နေရာကို ဖြုတ်ပြီး ဓာတ်ပုံနဲ့ နာမည်ပဲ ပြထားပါတယ်
        card.innerHTML = `
            <img src="${data.image}" alt="Memory Photo">
            <div class="polaroid-text">
                <p class="sender" style="font-size: 12px; color: #333; font-weight: 600; margin-top: 5px;">- From ${data.name}</p>
                <small style="font-size: 9px; color: #888; display: block; margin-top: 2px;">✉️ Click to read wish</small>
            </div>
        `;

        // Polaroid ကတ်ကို Click တဲ့အခါ Bootstrap Modal ပွင့်ပြီး Data တွေ သွားထည့်ပေးမယ့် Function
        card.addEventListener("click", () => {
            document.getElementById("modalSenderName").textContent = `✨ From ${data.name}'s Heart`;
            document.getElementById("modalMessage").textContent = data.message;
            document.getElementById("modalImage").src = data.image;
            
            // Bootstrap Modal ကို JavaScript နဲ့ လှမ်းဖွင့်တာပါ
            const wishModal = new bootstrap.Modal(document.getElementById('wishModal'));
            wishModal.show();
        });

        galleryGrid.appendChild(card);
    });
});
});