import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import Pusher from 'pusher-js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationContextType {
  notifications: string[];
  addNotification: (message: string) => void;
  subscribeToEventChannel: (eventId: number) => (() => void) | undefined;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  subscribeToEventChannel: () => undefined, // typescript orders
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/broadcasting/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    });
    pusherRef.current = pusherInstance;

    return () => {
      pusherInstance.disconnect();
      pusherRef.current = null;
    };
  }, []);

  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message]);
    toast.info(message);
  };

  const subscribeToEventChannel = (eventId: number): (() => void) | undefined => {
    if (!pusherRef.current) {
      return undefined; // Return 'undefined' if Pusher is not initialized
    }

    const channel = pusherRef.current.subscribe(`event-participants.${eventId}`);

    const eventHandler = (data: { message: string }) => {
      console.log('Received event data:', data);
      addNotification(data.message);
    };

    channel.bind('App\\Events\\EventUpdated', eventHandler);

    // return a cleanup function to unbind and unsubscribe
    return () => {
      channel.unbind('App\\Events\\EventUpdated', eventHandler);
      pusherRef.current?.unsubscribe(`private-event-participants.${eventId}`);
    };
  };

  // memoize the context value to avoid unnecessary re-renders (the starter's recommendation)
  const contextValue: NotificationContextType = useMemo(
    () => ({
      notifications,
      addNotification,
      subscribeToEventChannel,
    }),
    [notifications]
  );

  // finally here we render the Provider component
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
