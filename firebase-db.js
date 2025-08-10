// firebase-db.js - Skrip Firebase Terkonsolidasi
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- KONFIGURASI FIREBASE ---
// GANTI nilai-nilai di bawah ini dengan kredensial dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- STRUKTUR DATA DI FIRESTORE ---
// users/{username}/produk
// users/{username}/transaksi
// users/{username}/pengeluaran

// ------- PRODUK -------
export async function getProducts(username) {
  const col = collection(db, "users", username, "produk");
  const q = query(col, orderBy("nama"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProduct(username, product) {
  return await addDoc(collection(db, "users", username, "produk"), {
    ...product,
    createdAt: serverTimestamp()
  });
}

export async function updateProduct(username, id, patch) {
  const ref = doc(db, "users", username, "produk", id);
  return await updateDoc(ref, patch);
}

export async function deleteProduct(username, id) {
  const ref = doc(db, "users", username, "produk", id);
  return await deleteDoc(ref);
}

// ------- TRANSAKSI -------
export async function getTransactions(username) {
  const col = collection(db, "users", username, "transaksi");
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addTransaction(username, tx) {
  return await addDoc(collection(db, "users", username, "transaksi"), {
    ...tx,
    createdAt: serverTimestamp()
  });
}

export async function deleteTransaction(username, id) {
  const ref = doc(db, "users", username, "transaksi", id);
  return await deleteDoc(ref);
}

// ------- PENGELUARAN -------
export async function getExpenses(username) {
  const col = collection(db, "users", username, "pengeluaran");
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addExpense(username, exp) {
  return await addDoc(collection(db, "users", username, "pengeluaran"), {
    ...exp,
    createdAt: serverTimestamp()
  });
}

export async function deleteExpense(username, id) {
  const ref = doc(db, "users", username, "pengeluaran", id);
  return await deleteDoc(ref);
}