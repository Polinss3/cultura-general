import { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: 'rgba(46,200,122,0.95)', border: '#2ec87a', icon: '✓' },
  error:   { bg: 'rgba(232,48,96,0.95)',  border: '#e83060', icon: '✕' },
  info:    { bg: 'rgba(48,168,232,0.95)', border: '#30a8e8', icon: 'ℹ' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState<Required<ToastOptions>>({ message: '', type: 'info', duration: 3000 });
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    if (timer.current) clearTimeout(timer.current);
    setOpts({ message, type, duration });
    setVisible(true);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setVisible(false));
    }, duration);
  }, []);

  const style = COLORS[opts.type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: style.bg, borderColor: style.border },
            {
              opacity: anim,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.icon}>{style.icon}</Text>
          <Text style={styles.msg} numberOfLines={2}>{opts.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  msg: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Outfit_500Medium',
  },
});
