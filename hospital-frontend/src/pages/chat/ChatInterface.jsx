import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../../api/chatApi';
import { useToast } from '../../components/common/Toast';
import './ChatInterface.css';

// Simple formatter: bold headers and bullet points from AI response
const formatMessage = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="msg-spacer" />;

        // Emoji header lines (e.g. "🏥 Tövsiyə Olunan Şöbə:")
        if (/^[\p{Emoji}]/u.test(trimmed)) {
            return <p key={i} className="msg-heading">{trimmed}</p>;
        }
        // Bullet points
        if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
            return <li key={i} className="msg-bullet">{trimmed.slice(1).trim()}</li>;
        }
        // Separator lines
        if (/^[-—]{3,}$/.test(trimmed)) {
            return <hr key={i} className="msg-divider" />;
        }
        return <p key={i} className="msg-line">{trimmed}</p>;
    });
};

const suggestions = [
    'Başım ağrıyır',
    'Qızdırmam var',
    'Sinə ağrısı hissedirəm',
    'Paracetamol nə üçün istifadə olunur?',
    'Sağlam qidalanma haqqında məlumat ver',
];

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatApi.sendMessage(text);
            const aiMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            showToast('AI ilə əlaqə zamanı xəta baş verdi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        await sendMessage(input);
    };

    const handleSuggestion = (s) => {
        if (!loading) sendMessage(s);
    };

    return (
        <div className="chat-container">
            {ToastComponent}

            {/* Header */}
            <div className="chat-header">
                <div className="chat-header-icon">🏥</div>
                <div>
                    <h2>AI Sağlamlıq Köməkçisi</h2>
                    <p className="chat-header-sub">Simptomlarınızı yazın, ilkin tibbi məsləhət alın</p>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <div className="chat-welcome-icon">💬</div>
                        <h3>Salam! Sizə necə kömək edə bilərəm?</h3>
                        <p>Simptomlarınızı, dərman suallarınızı və ya sağlamlıq mövzularını yazın.</p>
                        <p className="chat-disclaimer">⚠️ Bu sistem peşəkar tibbi məsləhətin əvəzedicisi deyil.</p>
                        <div className="chat-suggestions">
                            {suggestions.map((s, i) => (
                                <button key={i} className="suggestion-chip" onClick={() => handleSuggestion(s)}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        {message.role === 'assistant' && (
                            <div className="ai-avatar">🤖</div>
                        )}
                        <div className="message-bubble">
                            {message.role === 'assistant' ? (
                                <div className="formatted-msg">
                                    {formatMessage(message.content)}
                                </div>
                            ) : (
                                <span>{message.content}</span>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-message ai-message">
                        <div className="ai-avatar">🤖</div>
                        <div className="message-bubble">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="chat-input-form">
                <input
                    type="text"
                    className="form-input chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Simptomlarınızı və ya sualınızı yazın..."
                    disabled={loading}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="btn btn-primary chat-send-btn"
                    disabled={loading || !input.trim()}
                >
                    {loading ? '⏳' : '➤ Göndər'}
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
