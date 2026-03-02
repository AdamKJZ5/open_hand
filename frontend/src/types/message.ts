// Message type definitions

export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  recipient: {
    _id: string;
    name: string;
    role: string;
  };
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  _id: string;
  participants: {
    _id: string;
    name: string;
    role: string;
  }[];
  lastMessage: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount: number;
}

export interface NewMessage {
  recipientId: string;
  subject: string;
  content: string;
}
