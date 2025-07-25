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
  phoneNumber?: string;
  isOnline: boolean;
  avatar?: string;
  isBot?: boolean;
  isFriend?: boolean;
}

interface ChatContextType {
  messages: Message[];
  users: ChatUser[];
  bots: ChatUser[];
  friends: ChatUser[];
  suggestedFriends: ChatUser[];
  activeChat: ChatUser | null;
  sendMessage: (content: string) => void;
  startChat: (user: ChatUser) => void;
  clearActiveChat: () => void;
  addFriend: (userId: string) => void;
  removeFriend: (userId: string) => void;
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
  const [bots, setBots] = useState<ChatUser[]>([]);
  const [friends, setFriends] = useState<ChatUser[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<ChatUser[]>([]);
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

    // Initialize bots
    const initialBots: ChatUser[] = [
      {
        id: 'bot1',
        name: '🤖 AI Assistant',
        email: 'ai@simplechat.app',
        phoneNumber: '+1-AI-BOT-001',
        isOnline: true,
        isBot: true,
        isFriend: false,
        avatar: '🤖'
      },
      {
        id: 'bot2',
        name: '📰 News Bot',
        email: 'news@simplechat.app',
        phoneNumber: '+1-NEWS-BOT',
        isOnline: true,
        isBot: true,
        isFriend: false,
        avatar: '📰'
      },
      {
        id: 'bot3',
        name: '🎵 Music Bot',
        email: 'music@simplechat.app',
        phoneNumber: '+1-MUSIC-BOT',
        isOnline: true,
        isBot: true,
        isFriend: false,
        avatar: '🎵'
      }
    ];
    setBots(initialBots);

    // Load friends
    const savedFriends = JSON.parse(localStorage.getItem('chatapp_friends') || '[]');
    setFriends(savedFriends);

    // Load and setup other users
    const allUsers = JSON.parse(localStorage.getItem('chatapp_users') || '[]');
    const otherUsers = allUsers
      .filter((u: any) => u.email !== user?.email)
      .map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phoneNumber: u.phoneNumber || '',
        isOnline: Math.random() > 0.3, // More users online
        isBot: false,
        isFriend: savedFriends.some((f: any) => f.id === u.id)
      }));

    // Add some demo users if none exist
    if (otherUsers.length === 0) {
      const demoUsers: ChatUser[] = [
        {
          id: 'demo1',
          name: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '+1234567890',
          isOnline: true,
          isBot: false,
          isFriend: false
        },
        {
          id: 'demo2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phoneNumber: '+1234567891',
          isOnline: false,
          isBot: false,
          isFriend: false
        },
        {
          id: 'demo3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phoneNumber: '+1234567892',
          isOnline: true,
          isBot: false,
          isFriend: false
        }
      ];
      setUsers(demoUsers);
      setSuggestedFriends(demoUsers);
    } else {
      setUsers(otherUsers);
      setSuggestedFriends(otherUsers.filter(u => !u.isFriend));
    }

    // Restore active chat
    const savedActiveChat = localStorage.getItem('chatapp_activeChat');
    if (savedActiveChat) {
      const parsed = JSON.parse(savedActiveChat);
      const allPossibleChats = [...initialBots, ...otherUsers];
      const chatUser = allPossibleChats.find((u: ChatUser) => u.id === parsed.id);
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
      let responses: string[] = [];
      
      if (activeChat.isBot) {
        // Bot-specific responses
        if (activeChat.id === 'bot1') {
          responses = [
            "Hello! I'm your AI assistant. How can I help you today?",
            "I can help you with questions, tasks, or just have a conversation!",
            "What would you like to know about?",
            "I'm here to assist you 24/7!",
            "Feel free to ask me anything!"
          ];
        } else if (activeChat.id === 'bot2') {
          responses = [
            "📰 Latest news: Tech stocks are up today!",
            "🌍 Breaking: New discoveries in space exploration!",
            "📊 Market update: Crypto showing positive trends",
            "🏆 Sports: Championship finals this weekend!",
            "🎬 Entertainment: New blockbuster movie releases this month"
          ];
        } else if (activeChat.id === 'bot3') {
          responses = [
            "🎵 Now playing: Your favorite playlist!",
            "🎶 Discovered new music you might like: Jazz Fusion",
            "🎤 Trending song: 'Digital Dreams' by TechBeats",
            "🎸 Classic rock recommendations coming up!",
            "🎹 Would you like me to suggest some chill music?"
          ];
        }
      } else {
        // Regular user responses
        responses = [
          "Thanks for your message!",
          "How are you doing?",
          "That's interesting!",
          "I see what you mean.",
          "Can you tell me more?",
          "Great to hear from you!",
          "What's new with you?",
          "Hope you're having a good day!",
          "Let's catch up soon!",
          "That sounds awesome!"
        ];
      }
      
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

  const addFriend = (userId: string) => {
    const userToAdd = users.find(u => u.id === userId);
    if (userToAdd && !friends.some(f => f.id === userId)) {
      const updatedUser = { ...userToAdd, isFriend: true };
      const newFriends = [...friends, updatedUser];
      setFriends(newFriends);
      
      // Update users list
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      
      // Update suggested friends
      setSuggestedFriends(suggestedFriends.filter(u => u.id !== userId));
      
      localStorage.setItem('chatapp_friends', JSON.stringify(newFriends));
    }
  };

  const removeFriend = (userId: string) => {
    const newFriends = friends.filter(f => f.id !== userId);
    setFriends(newFriends);
    
    // Update users list
    setUsers(users.map(u => u.id === userId ? { ...u, isFriend: false } : u));
    
    // Add back to suggested friends
    const userToSuggest = users.find(u => u.id === userId);
    if (userToSuggest) {
      setSuggestedFriends([...suggestedFriends, { ...userToSuggest, isFriend: false }]);
    }
    
    localStorage.setItem('chatapp_friends', JSON.stringify(newFriends));
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
      bots,
      friends,
      suggestedFriends,
      activeChat,
      sendMessage,
      startChat,
      clearActiveChat,
      addFriend,
      removeFriend
    }}>
      {children}
    </ChatContext.Provider>
  );
};