import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../secrets/secrets.firebase';

// Initialize Firebase app and auth once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const firebaseHandler = {
  async init() {
    await import('firebase/app');
    await import('firebase/auth');
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};