import React, { createContext, useContext, useState } from 'react';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  isAppUser: boolean;
}

interface ContactsContextType {
  contacts: Contact[];
  requestContactAccess: () => Promise<boolean>;
  hasContactPermission: boolean;
  inviteContact: (contact: Contact) => Promise<void>;
  syncContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
};

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [hasContactPermission, setHasContactPermission] = useState(false);

  const requestContactAccess = async (): Promise<boolean> => {
    try {
      // For web demo, we'll simulate contact access
      // In a real app, you'd use the Contacts API or native plugins
      const permission = await new Promise<boolean>((resolve) => {
        if ('contacts' in navigator) {
          // @ts-ignore - Web Contacts API (experimental)
          navigator.contacts.select(['name', 'tel']).then(() => {
            resolve(true);
          }).catch(() => {
            resolve(false);
          });
        } else {
          // Simulate permission request
          setTimeout(() => {
            const granted = window.confirm(
              '📱 SimpleChat would like to access your contacts to help you find friends who are already using the app. Allow access?'
            );
            resolve(granted);
          }, 100);
        }
      });

      setHasContactPermission(permission);
      
      if (permission) {
        await syncContacts();
      }
      
      return permission;
    } catch (error) {
      console.error('Error requesting contact access:', error);
      return false;
    }
  };

  const syncContacts = async () => {
    // Simulate fetching contacts
    const mockContacts: Contact[] = [
      {
        id: 'contact1',
        name: 'Alice Johnson',
        phoneNumber: '+1234567890',
        isAppUser: true
      },
      {
        id: 'contact2', 
        name: 'Bob Smith',
        phoneNumber: '+1234567891',
        isAppUser: false
      },
      {
        id: 'contact3',
        name: 'Carol Wilson',
        phoneNumber: '+1234567892',
        isAppUser: true
      },
      {
        id: 'contact4',
        name: 'David Brown',
        phoneNumber: '+1234567893',
        isAppUser: false
      },
      {
        id: 'contact5',
        name: 'Emma Davis',
        phoneNumber: '+1234567894',
        isAppUser: false
      }
    ];

    setContacts(mockContacts);
  };

  const inviteContact = async (contact: Contact) => {
    // Simulate sending invitation
    const message = `🚀 Hey ${contact.name}! I'm using SimpleChat for messaging. Join me: https://simplechat.app/invite?ref=${encodeURIComponent('your-user-id')}`;
    
    // In a real app, you'd integrate with SMS API or share API
    if ('share' in navigator) {
      try {
        await navigator.share({
          title: 'Join me on SimpleChat!',
          text: message,
          url: 'https://simplechat.app'
        });
      } catch (error) {
        // Fallback to copying to clipboard
        try {
          await navigator.clipboard?.writeText(message);
          alert('Invitation message copied to clipboard!');
        } catch (clipboardError) {
          alert('Invitation prepared! Please share manually.');
        }
      }
      } else {
        // Fallback for browsers without share API
        try {
          await (navigator as any).clipboard?.writeText(message);
          alert(`Invitation sent to ${contact.name}! Message copied to clipboard.`);
        } catch (error) {
          alert(`Invitation for ${contact.name} prepared! Please copy and share: ${message}`);
        }
      }
  };

  return (
    <ContactsContext.Provider value={{
      contacts,
      requestContactAccess,
      hasContactPermission,
      inviteContact,
      syncContacts
    }}>
      {children}
    </ContactsContext.Provider>
  );
};