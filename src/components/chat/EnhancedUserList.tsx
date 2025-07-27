import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useContacts } from '@/contexts/ContactsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  MessageCircle, 
  UserPlus, 
  Contact, 
  Search, 
  Bot,
  Heart,
  UserMinus,
  Send,
  Phone,
  LogOut,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const EnhancedUserList: React.FC = () => {
  const { 
    bots, 
    friends, 
    suggestedFriends, 
    startChat, 
    activeChat, 
    addFriend, 
    removeFriend 
  } = useChat();
  const { 
    contacts, 
    requestContactAccess, 
    hasContactPermission, 
    inviteContact 
  } = useContacts();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserClick = (user: any) => {
    startChat(user);
    toast({
      title: `Chat started with ${user.name}`,
      description: user.isBot ? "You're now chatting with a bot!" : "You can now send messages"
    });
  };

  const handleAddFriend = (userId: string) => {
    addFriend(userId);
    const user = suggestedFriends.find(u => u.id === userId);
    toast({
      title: "Friend added!",
      description: `${user?.name} has been added to your friends list`
    });
  };

  const handleRemoveFriend = (userId: string) => {
    removeFriend(userId);
    const user = friends.find(u => u.id === userId);
    toast({
      title: "Friend removed",
      description: `${user?.name} has been removed from your friends list`
    });
  };

  const handleRequestContacts = async () => {
    const granted = await requestContactAccess();
    if (granted) {
      toast({
        title: "Contacts accessed!",
        description: "You can now see which of your contacts are using SimpleChat"
      });
    } else {
      toast({
        title: "Permission denied",
        description: "Contact access is needed to find friends",
        variant: "destructive"
      });
    }
  };

  const handleInviteContact = async (contact: any) => {
    await inviteContact(contact);
    toast({
      title: "Invitation sent!",
      description: `Invited ${contact.name} to join SimpleChat`
    });
  };

  const filteredFriends = friends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedFriends.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const UserCard = ({ user, showAddButton = false, showRemoveButton = false }: any) => (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-all duration-200 border-l-2 rounded-r-lg ${
        activeChat?.id === user.id 
          ? 'bg-accent/30 border-l-primary shadow-md' 
          : 'border-l-transparent hover:border-l-accent'
      }`}
      onClick={() => handleUserClick(user)}
    >
      <Avatar className="h-12 w-12">
        <AvatarFallback className={`${
          user.isBot 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg' 
            : 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground'
        }`}>
          {user.avatar || user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground truncate">
            {user.name}
          </p>
          {user.isBot && <Bot className="h-4 w-4 text-purple-500" />}
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {user.email}
        </p>
        {user.phoneNumber && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {user.phoneNumber}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showAddButton && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleAddFriend(user.id);
            }}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
        {showRemoveButton && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFriend(user.id);
            }}
            className="hover:bg-destructive hover:text-destructive-foreground"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        )}
        <Badge 
          variant={user.isOnline ? "default" : "secondary"}
          className={user.isOnline ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {user.isOnline ? "Online" : "Offline"}
        </Badge>
      </div>
    </div>
  );

  const ContactCard = ({ contact }: any) => (
    <div className="flex items-center gap-3 p-4 hover:bg-accent/20 rounded-lg border border-border/50">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
          {contact.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {contact.name}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {contact.phoneNumber}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {contact.isAppUser ? (
          <Badge className="bg-green-500">
            On SimpleChat
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleInviteContact(contact)}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <Send className="h-4 w-4 mr-1" />
            Invite
          </Button>
        )}
      </div>
    </div>
  );

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of SimpleChat"
    });
  };

  return (
    <Card className="h-full bg-card/50 backdrop-blur-lg border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
            SimpleChat
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border/30 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              {user?.display_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {user?.display_name || user?.email}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Online
            </p>
          </div>
          <Badge className="bg-green-500">
            Online
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, friends, contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input/50 border-border/50"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1">
        <Tabs defaultValue="bots" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
            <TabsTrigger value="bots" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              Bots
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1">
              <Contact className="h-4 w-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="flex-1 m-0">
            <ScrollArea className="h-full px-2">
              <div className="space-y-1">
                {bots.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No bots available</p>
                  </div>
                ) : (
                  bots.map((bot) => (
                    <UserCard key={bot.id} user={bot} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="friends" className="flex-1 m-0">
            <ScrollArea className="h-full px-2">
              <div className="space-y-1">
                {filteredFriends.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No friends yet</p>
                    <p className="text-sm">Add some friends to start chatting!</p>
                  </div>
                ) : (
                  filteredFriends.map((friend) => (
                    <UserCard 
                      key={friend.id} 
                      user={friend} 
                      showRemoveButton={true}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="discover" className="flex-1 m-0">
            <ScrollArea className="h-full px-2">
              <div className="space-y-1">
                {filteredSuggested.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No users to discover</p>
                    <p className="text-sm">Register more accounts or invite friends!</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-2">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Add Friends
                      </h3>
                    </div>
                    {filteredSuggested.map((user) => (
                      <UserCard 
                        key={user.id} 
                        user={user} 
                        showAddButton={true}
                      />
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 m-0">
            <ScrollArea className="h-full px-2">
              {!hasContactPermission ? (
                <div className="p-6 text-center">
                  <Contact className="h-12 w-12 mx-auto mb-3 text-primary opacity-70" />
                  <h3 className="font-medium mb-2">Find Friends from Contacts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Allow access to your contacts to see who's already using SimpleChat
                  </p>
                  <Button onClick={handleRequestContacts} className="bg-gradient-to-r from-primary to-primary-glow">
                    <Contact className="h-4 w-4 mr-2" />
                    Access Contacts
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {filteredContacts.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Contact className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No contacts found</p>
                    </div>
                  ) : (
                    filteredContacts.map((contact) => (
                      <ContactCard key={contact.id} contact={contact} />
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};