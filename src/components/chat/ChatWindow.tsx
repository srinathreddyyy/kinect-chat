import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, MessageCircle, Power } from 'lucide-react';
import { format } from 'date-fns';

export const ChatWindow: React.FC = () => {
  const { messages, activeChat, sendMessage, clearActiveChat } = useChat();
  const { user, logout } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeChat) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!activeChat) {
    return (
      <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50 flex items-center justify-center">
        <CardContent className="text-center p-8">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">Start a Conversation</h3>
          <p className="text-muted-foreground">
            Select a user from the sidebar to begin chatting
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50 flex flex-col">
      <CardHeader className="flex-row items-center justify-between border-b border-border/50 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearActiveChat}
            className="hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              {activeChat.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{activeChat.name}</h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant={activeChat.isOnline ? "default" : "secondary"}
                className={`text-xs ${activeChat.isOnline ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {activeChat.isOnline ? "Online" : "Offline"}
              </Badge>
              <span className="text-xs text-muted-foreground">{activeChat.email}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="hover:bg-destructive/10 hover:text-destructive"
          title="Logout"
        >
          <Power className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isFromUser = message.senderId === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isFromUser
                        ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-br-sm'
                        : 'bg-accent text-accent-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 opacity-70 ${
                        isFromUser ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border/50 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-input/50 border-border/50"
              autoComplete="off"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};