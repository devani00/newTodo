import './App.css';
import { auth, provider, signInWithPopup } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import Todo from './components/Todo';

function App() {
  const [user, setUser] = useState(null);

  // Sign in with Google
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Error during Google login: ", error);
      });
  };

  // Check if the user is already logged in on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // If user is already logged in, set the user state
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
      {user ? (
        <Todo />
      ) : (
        <div className="max-w-4xl p-12 bg-white bg-opacity-90 shadow-2xl rounded-xl text-center transform transition-all hover:scale-105 duration-500">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6">
            Welcome to Your Todo App
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Organize your life with our sleek and modern Todo app. Stay on top of your tasks with ease and make your day productive.
            <br/>
            Sign in with Google to get started!
          </p>
          <button
            className="flex items-center justify-center mx-auto bg-red-500 hover:bg-red-600 text-white font-semibold text-lg py-3 px-6 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300 ease-in-out"
            onClick={signInWithGoogle}
          >
            <img
              className="w-6 h-6 mr-3"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google Logo"
            />
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
