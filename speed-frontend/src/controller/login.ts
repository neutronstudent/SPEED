import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';

import { firebaseConfig } from '@/secrets/secrets.firebase';

// Initialize Firebase app and auth once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Loads Firebase auth module asynchronously when needed
export const firebaseHandler = {
  async init() {
    await import('firebase/app');
    await import('firebase/auth');
  }
};

// Login function for Firebase authentication
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout function for Firebase authentication
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};