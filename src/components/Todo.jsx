import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TodoList from './TodoList';
import FilterButtons from './FilterButtons';
import { BsSearch, BsPlus } from 'react-icons/bs';
import { addTodo, updateSearchTerm, setTodos } from '../redux/actions'; // Make sure to import setTodos
import { auth } from '../firebase'; // import the auth object
import { signOut } from 'firebase/auth'; // import signOut function
import { db } from '../firebase'; // import db for Firestore
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'; // Firestore functions

const Todo = () => {
  const todos = useSelector((state) => state.todos);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();
  const [newTodoText, setNewTodoText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [user, setUser] = useState(auth.currentUser); // Assuming you set the user from Firebase login

  // Fetch todos from Firestore on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch(setTodos(todosList)); // Dispatch the action to set todos in Redux
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleAddTodo = async (text) => {
    await addDoc(collection(db, 'todos'), { text, completed: false }); // Add new todo to Firestore
  };

  const handleAddTodoClick = () => {
    if (newTodoText.trim() !== '') {
      handleAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id)); // Delete todo from Firestore
  };

  const handleToggleComplete = async (id, completed) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { completed: !completed }); // Toggle completion status in Firestore
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    dispatch(updateSearchTerm(value));
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      window.location.reload(); // Optionally, reload the page after sign-out
    }).catch((error) => {
      console.error("Error during sign-out: ", error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white py-4 px-6 shadow-lg">
        <h1 className="text-xl font-bold text-gray-700">Todo App</h1>
        <div className="relative">
          {/* User Profile Picture */}
          {user && (
            <img
              src={user.photoURL} // Google's profile picture URL
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          )}
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Todo App Content */}
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-gray-100 rounded">
        <h2 className="mt-3 mb-6 text-2xl font-bold text-center uppercase">Personal TODO APP</h2>
        <div className="flex items-center mb-4">
          <input
            id="addTodoInput"
            className="flex-grow p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Add Todo"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleAddTodoClick}
          >
            <BsPlus size={20} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <FilterButtons />
          <div className="flex items-center mb-4">
            <input
              className="flex-grow p-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Search Todos"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <button className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none">
              <BsSearch size={20} />
            </button>
          </div>
        </div>

        {/* Pass the handleDeleteTodo and handleToggleComplete functions to TodoList */}
        <TodoList 
          onDeleteTodo={handleDeleteTodo}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
};

export default Todo;
