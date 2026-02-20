import React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

export enum View {
  CHAT = 'CHAT',
  MOCK_STUDIO = 'MOCK_STUDIO'
}