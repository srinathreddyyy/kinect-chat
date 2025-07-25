import React from 'react';
import { EnhancedUserList } from '@/components/chat/EnhancedUserList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChat } from '@/contexts/ChatContext';

export const ChatPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { activeChat } = useChat();

  if (isMobile) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="relative h-full">
          {activeChat ? <ChatWindow /> : <EnhancedUserList />}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      <div className="relative h-full flex">
        <div className="w-80 border-r border-border/50">
          <EnhancedUserList />
        </div>
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};