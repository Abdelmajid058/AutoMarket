// frontend/src/common/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: 'Bonjour ! Bienvenue chez AutoMarket. Comment puis-je vous aider ?', 
            type: 'text' 
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const quickReplies = [
        "Horaires d'ouverture",
        "Options de financement",
        "Voitures disponibles",
        "Marques proposées",
        "Prendre un rendez-vous"
    ];

    const getImageUrl = (path) => {
        if (!path) return '/images/default-car.jpg';
        // Supposons que vos images sont stockées dans le dossier 'uploads' de votre API
        return path.startsWith('http') ? path : `${process.env.REACT_APP_API_URL}/uploads/${path}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        // Ajouter le message de l'utilisateur
        const userMessage = { sender: 'user', text: input, type: 'text' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // Envoyer au backend
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chatbot/message`, {
                message: input,
                userId: 'guest_user_id'
            });

            // Traiter la réponse
            const { response: botResponse, type = 'text', data = null } = response.data;
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: botResponse,
                type,
                data
            }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { 
                sender: 'bot', 
                text: "Désolé, le service est temporairement indisponible. Veuillez réessayer plus tard.", 
                type: 'text' 
            }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const handleQuickReplyClick = (replyText) => {
        setInput(replyText);
        setTimeout(handleSendMessage, 100);
    };

    const handleItemClick = (type, item) => {
        if (!item) return;
        
        const identifier = item.slug || item._id;
        if (!identifier) {
            console.error("Missing identifier for", item);
            return;
        }

        try {
            navigate(`/${type}/${identifier}`);
        } catch (error) {
            console.error("Navigation error:", error);
            navigate(`/${type}s`); // Fallback vers la page liste
        }
    };

    const renderMessageContent = (msg) => {
        switch (msg.type) {
            case 'cars_list':
                return (
                    <>
                        {msg.text && <p className="bot-message-text">{msg.text}</p>}
                        <div className="car-grid">
                            {msg.data?.map(car => (
                                <div 
                                    key={car._id} 
                                    className="car-card"
                                    onClick={() => handleItemClick('car', car)}
                                >
                                    <div className="car-image-container">
                                        <img
                                            src={getImageUrl(car.productPictures?.[0] || car.image)}
                                            alt={car.name}
                                            onError={(e) => {
                                                e.target.src = '/images/default-car.jpg';
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                    <div className="car-info">
                                        <h4>{car.name}</h4>
                                        <p>{car.price} TND</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );

            case 'brands_list':
                return (
                    <>
                        {msg.text && <p className="bot-message-text">{msg.text}</p>}
                        <div className="brand-grid">
                            {msg.data?.map(brand => (
                                <div 
                                    key={brand._id} 
                                    className="brand-card"
                                    onClick={() => handleItemClick('brand', brand)}
                                >
                                    <div className="brand-logo-container">
                                        <img
                                            src={getImageUrl(brand.image)}
                                            alt={brand.name}
                                            onError={(e) => {
                                                e.target.src = '/images/default-car.jpg';
                                                e.target.onerror = null;
                                            }}
                                        />
                                    </div>
                                    <p>{brand.name}</p>
                                </div>
                            ))}
                        </div>
                    </>
                );

            default:
                return msg.text;
        }
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            <button 
                className="chatbot-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <span>× Fermer</span>
                ) : (
                    <span>💬 Assistance</span>
                )}
            </button>

            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h3>Assistance AutoMarket</h3>
                        <button 
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.sender}`}
                            >
                                {renderMessageContent(msg)}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-replies">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                className="quick-reply-btn"
                                onClick={() => handleQuickReplyClick(reply)}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tapez votre message..."
                        />
                        <button 
                            className="send-btn"
                            onClick={handleSendMessage}
                            disabled={!input.trim()}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;