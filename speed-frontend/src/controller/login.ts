import { initializeApp } from 'firebase/app';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from '../secrets/secrets.firebase';

export const firebaseHandler = {
  async init() {
    const firebase = await import('firebase/app');
    await import('firebase/auth');
    await firebase.initializeApp(firebaseConfig);
    }
};

export const login = async (email: string, password: string) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = async () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};