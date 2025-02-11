import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Discussions.css';

const DiscussionPage = ({ teacherId, loggedInStudent }) => {
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({}); // Store replies for each discussion

  // Fetch discussions when the component mounts or when teacherId changes
  useEffect(() => {
    const fetchDiscussions = async () => {
      setLoading(true);
      try {
        // Fetching from 'discussions' collection
        const response = await axios.get(`http://localhost:5000/api/discussions/${teacherId}`);
        setDiscussions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching discussions:", err);
        setError("Failed to load discussions.");
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchDiscussions();
    } else {
      setError("Teacher ID is missing.");
      setLoading(false);
    }
  }, [teacherId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      const response = await axios.post('http://localhost:5000/api/discussions', {
        teacherId,
        name: loggedInStudent,
        message: newMessage.trim(),
      });

      // Add the new message to the existing list
      setDiscussions([...discussions, response.data]);
      setNewMessage('');  // Clear input after sending the message
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message.");
    }
  };

  // Handle replying to a discussion message
  const handleReply = async (discussionId, replyMessage) => {
    if (!replyMessage.trim()) return; // Prevent empty replies

    try {
      const response = await axios.post('http://localhost:5000/api/discussions/reply', {
        discussionId,
        reply: {
          name: loggedInStudent,
          replyMessage: replyMessage.trim(),
          date: new Date(),
        }
      });

      // Update the discussion with the new reply
      const updatedDiscussions = discussions.map(discussion =>
        discussion._id === discussionId ? { ...discussion, replies: [...discussion.replies, response.data.replies[0]] } : discussion
      );
      setDiscussions(updatedDiscussions);

      // Clear the reply input for this particular discussion
      setReplies(prevReplies => ({ ...prevReplies, [discussionId]: '' }));
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Failed to send reply.");
    }
  };

  // Handle the change of the reply input for each message
  const handleReplyChange = (discussionId, value) => {
    setReplies(prevReplies => ({ ...prevReplies, [discussionId]: value }));
  };

  return (
    <div className="discussion-container">
      <h1 className="discussion-header">Discussions</h1>

      {/* Display error messages */}
      {error && <div className="error-message">{error}</div>}

      {/* Show loading state */}
      {loading && <div>Loading discussions...</div>}

      {/* Discussion list */}
      <div className="message-list">
        {discussions.map(discussion => (
          <div key={discussion._id} className="message">
            <p className="message-text">
              <strong className="message-author">{discussion.name}</strong>: {discussion.message}
            </p>

            <div className="replies">
              {/* List of replies */}
              {discussion.replies.map((reply, index) => (
                <div key={index} className="reply">
                  <p className="reply-text">
                    <strong className="reply-author">{reply.name}</strong>: {reply.replyMessage}
                  </p>
                </div>
              ))}

              {/* Input for replying */}
              <div className="reply-input">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replies[discussion._id] || ''}
                  onChange={(e) => handleReplyChange(discussion._id, e.target.value)} // Track reply input
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleReply(discussion._id, replies[discussion._id]);  // Send the reply on Enter
                    }
                  }}
                  className="reply-input-field"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input for new messages */}
      <div className="new-message">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          rows={3}
          className="new-message-input"
        />
        <button onClick={handleSendMessage} className="send-message-button">Send</button>
      </div>
    </div>
  );
};

export default DiscussionPage;
