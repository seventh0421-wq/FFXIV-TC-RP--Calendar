import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { RPEvent } from '../types';

// Web Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw4RkAnKxmbDpRabvKi8V8gk3xefwDjlo",
  authDomain: "tc-rp-calendar.firebaseapp.com",
  projectId: "tc-rp-calendar",
  storageBucket: "tc-rp-calendar.firebasestorage.app",
  messagingSenderId: "949030241859",
  appId: "1:949030241859:web:6cdb9d97eeb04dbf8876f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore Collection Reference
const EVENTS_COLLECTION = 'events';

/**
 * Fetch all events from Firestore, sorted by date and start time.
 */
export async function fetchEventsFromFirestore(): Promise<RPEvent[]> {
  try {
    const eventsCol = collection(db, EVENTS_COLLECTION);
    const querySnapshot = await getDocs(eventsCol);
    const fetchedEvents: RPEvent[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      fetchedEvents.push({
        id: docSnap.id,
        title: data.title || '',
        date: data.date || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        dc: data.dc || '',
        world: data.world || '',
        location: {
          housingArea: data.location?.housingArea || '',
          ward: Number(data.location?.ward || 1),
          plot: Number(data.location?.plot || 1),
          roomNumber: data.location?.roomNumber || ''
        },
        category: data.category || 'other',
        host: data.host || '',
        dressCode: data.dressCode || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        bannerGradient: data.bannerGradient || 'from-zinc-800 to-zinc-900',
        discordUrl: data.discordUrl || undefined,
        recruitmentText: data.recruitmentText || undefined,
        isCustom: data.isCustom ?? true
      });
    });
    
    // Client-side sort chronologically
    return fetchedEvents.sort((a, b) => {
      const dComp = a.date.localeCompare(b.date);
      if (dComp !== 0) return dComp;
      return a.startTime.localeCompare(b.startTime);
    });
  } catch (error) {
    console.error('Error fetching events from Firestore:', error);
    throw error;
  }
}

/**
 * Recursive utility to remove undefined properties from an object so Firestore doesn't reject it
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  if (typeof obj === 'object') {
    const clean: any = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        clean[key] = sanitizeForFirestore(obj[key]);
      }
    }
    return clean;
  }
  return obj;
}

/**
 * Add a new event to Firestore
 */
export async function addEventToFirestore(event: Omit<RPEvent, 'id'>): Promise<string> {
  try {
    const eventsCol = collection(db, EVENTS_COLLECTION);
    const sanitized = sanitizeForFirestore({
      ...event,
      isCustom: true // Track it as custom/published event
    });
    const docRef = await addDoc(eventsCol, sanitized);
    return docRef.id;
  } catch (error) {
    console.error('Error adding event to Firestore:', error);
    throw error;
  }
}

/**
 * Update an existing event in Firestore
 */
export async function updateEventInFirestore(id: string, event: Partial<RPEvent>): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    // Remove id from payload just in case
    const { id: _, ...payload } = event as any;
    const sanitized = sanitizeForFirestore(payload);
    await updateDoc(docRef, sanitized);
  } catch (error) {
    console.error('Error updating event in Firestore:', error);
    throw error;
  }
}

/**
 * Delete an event from Firestore
 */
export async function deleteEventFromFirestore(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting event from Firestore:', error);
    throw error;
  }
}

/**
 * Seed sample events if the collection is empty.
 * Requires an authenticated user because of our Firestore rules.
 */
export async function seedSampleEventsInFirestore(sampleEvents: RPEvent[]): Promise<void> {
  try {
    const eventsCol = collection(db, EVENTS_COLLECTION);
    const querySnapshot = await getDocs(eventsCol);
    
    if (querySnapshot.empty) {
      console.log('Firestore events collection is empty. Seeding sample events...');
      for (const evt of sampleEvents) {
        // Exclude the ID to let Firestore generate one, or write with the specified ID
        const { id, ...evtData } = evt;
        // We write with doc() or let docRef = doc(db, EVENTS_COLLECTION, id)
        await setDoc(doc(db, EVENTS_COLLECTION, id), {
          ...evtData,
          isCustom: false // Mark as sample/native event
        });
      }
      console.log('Successfully seeded sample events!');
    }
  } catch (error) {
    console.error('Failed to seed sample events:', error);
    throw error;
  }
}
