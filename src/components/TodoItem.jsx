import { useDispatch } from 'react-redux';
import {
  toggleTodo,
  removeTodo,
  markCompleted,
  markIncomplete,
} from '../redux/actions';
import { FaToggleOn, FaToggleOff, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { db } from '../firebase'; // Import Firestore database
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Firestore functions

const TodoItem = ({ todo, index }) => {
  const dispatch = useDispatch();

  // Function to delete todo from Firestore
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id)); // Delete todo from Firestore using id
      dispatch(removeTodo(index)); // Optionally dispatch action to remove from Redux state
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  // Function to toggle todo completion in Firestore
  const handleToggleComplete = async (id, completed) => {
    try {
      const todoDoc = doc(db, 'todos', id);
      await updateDoc(todoDoc, { completed: !completed }); // Toggle completion in Firestore
      if (!completed) {
        dispatch(markCompleted(index)); // Dispatch action to mark as completed in Redux state
      } else {
        dispatch(markIncomplete(index)); // Dispatch action to mark as incomplete in Redux state
      }
    } catch (error) {
      console.error("Error updating todo: ", error);
    }
  };

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 py-2 gap-4">
      <div className="flex items-center">
        <span className="mr-4 text-gray-500">
          {index + 1}.
        </span>
        <span className={`mr-4 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.text}
        </span>
      </div>
      <div className='space-x-3 ml-8'>
        <button
          className="mr-2 text-sm bg-blue-500 text-white sm:px-2 px-1 py-1 rounded"
          onClick={() => handleToggleComplete(todo.id, todo.completed)} // Use todo.id instead of index
        >
          {todo.completed ? <FaToggleOff /> : <FaToggleOn />}
        </button>
        <button
          className="mr-2 text-sm bg-red-500 text-white sm:px-2 px-1 py-1 rounded"
          onClick={() => handleDelete(todo.id)} // Use todo.id instead of index
        >
          <FaTrash />
        </button>
        {!todo.completed && (
          <button
            className="text-sm bg-green-500 text-white sm:px-2 px-1 py-1 rounded"
            onClick={() => handleToggleComplete(todo.id, todo.completed)} // Use todo.id instead of index
          >
            <FaCheck />
          </button>
        )}
        {todo.completed && (
          <button
            className="text-sm bg-yellow-500 text-white sm:px-2 px-1 py-1 rounded"
            onClick={() => handleToggleComplete(todo.id, todo.completed)} // Use todo.id instead of index
          >
            <FaTimes />
          </button>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
