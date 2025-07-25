import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface ChatUser {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
}

interface ChatContextType {
  messages: Message[];
  users: ChatUser[];
  activeChat: ChatUser | null;
  sendMessage: (content: string) => void;
  startChat: (user: ChatUser) => void;
  clearActiveChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chatapp_messages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }

    // Load users and simulate online status
    const allUsers = JSON.parse(localStorage.getItem('chatapp_users') || '[]');
    const chatUsers = allUsers
      .filter((u: any) => u.email !== user?.email)
      .map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        isOnline: Math.random() > 0.5 // Simulate random online status
      }));
    setUsers(chatUsers);

    // Restore active chat
    const savedActiveChat = localStorage.getItem('chatapp_activeChat');
    if (savedActiveChat) {
      const parsed = JSON.parse(savedActiveChat);
      const chatUser = chatUsers.find((u: ChatUser) => u.id === parsed.id);
      if (chatUser) {
        setActiveChat(chatUser);
      }
    }
  }, [user]);

  const sendMessage = (content: string) => {
    if (!user || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: activeChat.id,
      content,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatapp_messages', JSON.stringify(updatedMessages));

    // Simulate receiving a response after a delay
    setTimeout(() => {
      const responses = [
        "Thanks for your message!",
        "How are you doing?",
        "That's interesting!",
        "I see what you mean.",
        "Can you tell me more?",
        "Great to hear from you!",
        "What's new with you?",
        "Hope you're having a good day!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: activeChat.id,
        receiverId: user.id,
        content: randomResponse,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, responseMessage];
      setMessages(finalMessages);
      localStorage.setItem('chatapp_messages', JSON.stringify(finalMessages));
    }, 1000 + Math.random() * 2000);
  };

  const startChat = (chatUser: ChatUser) => {
    setActiveChat(chatUser);
    localStorage.setItem('chatapp_activeChat', JSON.stringify(chatUser));
  };

  const clearActiveChat = () => {
    setActiveChat(null);
    localStorage.removeItem('chatapp_activeChat');
  };

  const filteredMessages = messages.filter(
    msg => 
      activeChat && 
      ((msg.senderId === user?.id && msg.receiverId === activeChat.id) ||
       (msg.senderId === activeChat.id && msg.receiverId === user?.id))
  );

  return (
    <ChatContext.Provider value={{
      messages: filteredMessages,
      users,
      activeChat,
      sendMessage,
      startChat,
      clearActiveChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};