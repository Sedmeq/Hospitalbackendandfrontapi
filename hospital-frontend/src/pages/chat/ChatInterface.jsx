import React, { useState } from 'react';
import { chatApi } from '../../api/chatApi';
import { useToast } from '../../components/common/Toast';
import './ChatInterface.css';

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatApi.sendMessage(input);
            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            showToast('Error communicating with AI', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            {ToastComponent}
            <div className="chat-header">
                <h2>🤖 AI Health Assistant</h2>
                <p className="text-muted">Get preliminary health advice and triage suggestions</p>
            </div>

            <div className="chat-messages card">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <h3>Welcome to AI Health Assistant</h3>
                        <p>Ask me about your symptoms and I'll provide preliminary guidance.</p>
                        <p className="text-muted">Note: This is not a substitute for professional medical advice.</p>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        <div className="message-content">
                            {message.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-message ai-message">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    className="form-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your symptoms..."
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !input.trim()}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
