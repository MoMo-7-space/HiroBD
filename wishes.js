import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// 🛠️ Storage အတွက် လိုအပ်တဲ့ functions တွေကို ထပ်မံ import လုပ်လိုက်ပါတယ်
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
const storage = getStorage(app); // 🛠️ Storage ကို စတင်အသုံးပြုရန် သတ်မှတ်ခြင်း

document.addEventListener("DOMContentLoaded", function() {
    const wishForm = document.getElementById("wishForm");
    const imageUpload = document.getElementById("imageUpload");
    const fileStatus = document.getElementById("fileStatus");
    const galleryGrid = document.getElementById("galleryGrid");

    let selectedFile = null; // Base64 အစား ဖိုင်အစစ်ကိုပဲ သိမ်းထားပါမယ်

    imageUpload.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            fileStatus.textContent = "Selected: " + file.name;
            selectedFile = file; // ဖိုင်အစစ်ကို သိမ်းလိုက်ခြင်း
        }
    });

    wishForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const senderName = document.getElementById("senderName").value;
        const wishMessage = document.getElementById("wishMessage").value;
        const submitBtn = wishForm.querySelector(".submit-btn");

        if (!selectedFile) {
            alert("Please upload a photo first!");
            return;
        }

        try {
            // Loading ဖြစ်နေစဉ် ခလုတ်ကို ခေတ္တပိတ်ထားပါမယ်
            submitBtn.disabled = true;
            submitBtn.textContent = "Uploading Wish...";

            // ၁။ ပုံကို Firebase Storage ထဲကို အရင်ဆုံး Upload တင်ပါတယ်
            const storageRef = ref(storage, 'wishes_photos/' + Date.now() + '_' + selectedFile.name);
            const snapshot = await uploadBytes(storageRef, selectedFile);
            
            // ၂။ တင်ပြီးသွားတဲ့ ပုံရဲ့ ထာဝရ အသုံးပြုလို့ရမယ့် URL/Link ကို လှမ်းယူပါတယ်
            const downloadURL = await getDownloadURL(snapshot.ref);

            // ၃။ ပုံရဲ့ Link နဲ့ စာသားတွေကို Firestore Database ထဲကို ပေါင်းပြီး သိမ်းလိုက်ပါတယ်
            await addDoc(collection(db, "wishes"), {
                name: senderName,
                message: wishMessage,
                image: downloadURL, // Base64 စာသားကြီး မဟုတ်တော့ဘဲ ပုံရဲ့ URL ပဲ ဖြစ်သွားပါပြီ
                timestamp: new Date()
            });

            wishForm.reset();
            fileStatus.textContent = "No photo selected";
            selectedFile = null;
            alert("ဆုတောင်းစကားလေး ပို့လိုက်ပါပြီ! 💖");

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("ဒေတာတင်ရတာ အဆင်မပြေဖြစ်သွားပါတယ်။ အင်တာနက်လိုင်း ပြန်စစ်ပေးပါဦးနော်။");
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
            
            const randomRotate = (Math.random() * 10 - 5).toFixed(1);
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
