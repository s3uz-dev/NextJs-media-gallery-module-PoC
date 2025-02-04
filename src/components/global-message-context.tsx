'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "@/hooks/use-toast";

type Message = { type: 'success' | 'error'; text: string } | null;

type GlobalMessageContextType = {
  message: Message;
  setMessage: (message: Message) => void;
};

const GlobalMessageContext = createContext<GlobalMessageContextType | undefined>(undefined);

export const GlobalMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<Message>(null);
  useEffect(() => {
    if (message) {

      toast({
        duration: 4500,
        variant: message.type === 'success' ? 'default' : 'destructive',
        title:  message.type === 'success' ? 'Éxito' : 'Error',
        description: message.text,
      });


      // Limpia el mensaje después de mostrarlo
      setTimeout(() => setMessage(null), 5000);
    }
  }, [message, setMessage]);
  return (
    <GlobalMessageContext.Provider value={{ message, setMessage }}>
      {children}
    </GlobalMessageContext.Provider>
  );
};

export const useGlobalMessage = () => {
  const context = useContext(GlobalMessageContext);
  if (!context) {
    throw new Error('useGlobalMessage debe ser usado dentro de GlobalMessageProvider');
  }
  return context;
};