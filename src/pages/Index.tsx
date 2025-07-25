import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from './AuthPage';
import { ChatPage } from './ChatPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { ContactsProvider } from '@/contexts/ContactsContext';

const Index = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

const AuthContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ContactsProvider>
      <ChatProvider>
        <ChatPage />
      </ChatProvider>
    </ContactsProvider>
  );
};

export default Index;
