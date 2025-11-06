// Firebase Configuration - GANTI DENGAN CONFIG MILIKMU
const firebaseConfig = {
  apiKey: "AIzaSyDYoYjYdpZEO97-7zy91Zm69JFNWe2w2S4",
  authDomain: "cloud-computing-project-f886e.firebaseapp.com",
  projectId: "cloud-computing-project-f886e",
  storageBucket: "cloud-computing-project-f886e.firebasestorage.app",
  messagingSenderId: "1069292901579",
  appId: "1:1069292901579:web:649b8140eed3385924374e",
  measurementId: "G-YC699C8BF0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Fungsi navigasi antar halaman
function goToPage(page) {
    window.location.href = page;
}

// Fungsi untuk menampilkan message
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Auto hide setelah 3 detik
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Check auth state
function checkAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (strength >= 3) return 'strong';
    if (strength >= 2) return 'medium';
    return 'weak';
}

// Auth functions
async function registerWithEmail(email, password, userData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save additional user data to Firestore
        await db.collection("users").doc(user.uid).set({
            fullName: userData.fullName,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function loginWithEmail(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login
        await db.collection("users").doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUserData(userId) {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (userDoc.exists) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: "User data not found" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}



// Export functions for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
window.showMessage = showMessage;
window.goToPage = goToPage;
window.checkPasswordStrength = checkPasswordStrength;
window.checkAuth = checkAuth;
window.registerWithEmail = registerWithEmail;
window.loginWithEmail = loginWithEmail;
window.logoutUser = logoutUser;
window.getUserData = getUserData;