import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Popup from './components/popup';
import Auth from './components/auth';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Update our state when auth state changes
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);
  console.log(user);
  
  // Show loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Once loaded, show appropriate component based on auth state
  return (
    <main className='w-80 h-full rounded-md'>
      {user ? <Popup /> : <Auth />}
    </main>
  );
}

export default App;