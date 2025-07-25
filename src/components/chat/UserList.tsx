import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageCircle } from 'lucide-react';

export const UserList: React.FC = () => {
  const { users, startChat, activeChat } = useChat();

  const handleUserClick = (user: any) => {
    startChat(user);
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Available Users
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {users.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users available</p>
              <p className="text-sm">Register more accounts to start chatting!</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-all duration-200 border-l-2 ${
                  activeChat?.id === user.id 
                    ? 'bg-accent/30 border-l-primary' 
                    : 'border-l-transparent hover:border-l-accent'
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <Badge 
                  variant={user.isOnline ? "default" : "secondary"}
                  className={user.isOnline ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {user.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};