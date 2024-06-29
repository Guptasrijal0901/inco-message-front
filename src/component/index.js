import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingMessage, setEditingMessage] = useState('');

  // Fetch messages from the server when the component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  // Function to fetch messages from the server
  const fetchMessages = async () => {
    const response = await fetch('http://localhost:5000/api/messages');
    const data = await response.json();
    setMessages(data);
  };

  // Function to handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage.trim() }),
      });
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
    }
  };

  // Function to handle message deletion
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/messages/${id}`, {
      method: 'DELETE',
    });
    setMessages(messages.filter((message) => message._id !== id));
  };

  // Function to handle message editing
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingMessage(messages[index].text);
  };

  // Function to handle message update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editingMessage.trim()) {
      const response = await fetch(`http://localhost:5000/api/messages/${messages[editingIndex]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editingMessage.trim() }),
      });
      const data = await response.json();
      const updatedMessages = messages.map((msg, i) =>
        i === editingIndex ? data : msg
      );
      setMessages(updatedMessages);
      setEditingIndex(null);
      setEditingMessage('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Anonymous Messages</h1>
        <form onSubmit={editingIndex === null ? handleSubmit : handleUpdate}>
          <textarea
            value={editingIndex === null ? newMessage : editingMessage}
            onChange={(e) => {
              if (editingIndex === null) {
                setNewMessage(e.target.value);
              } else {
                setEditingMessage(e.target.value);
              }
            }}
            placeholder="Enter your anonymous message"
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit">
            {editingIndex === null ? 'Submit' : 'Update'}
          </button>
        </form>
        <div className="messages">
          <h2>Messages</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={message._id}>
                <p>{message.text}</p>
                <div>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(message._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
