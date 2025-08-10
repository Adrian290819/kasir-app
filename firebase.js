// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// --- Konfigurasi Firebase ---
const firebaseConfig = {
    apiKey: "API_KEY_MU",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Fungsi CRUD Produk ---
export async function getAllProducts(username) {
    const querySnapshot = await getDocs(collection(db, "users", username, "products"));
    return querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    }));
}

export async function addProduct(username, productData) {
    await addDoc(collection(db, "users", username, "products"), {
        ...productData,
        createdAt: serverTimestamp()
    });
}

export async function updateProduct(username, productId, productData) {
    const productRef = doc(db, "users", username, "products", productId);
    await updateDoc(productRef, productData);
}

export async function deleteProduct(username, productId) {
    const productRef = doc(db, "users", username, "products", productId);
    await deleteDoc(productRef);
}
