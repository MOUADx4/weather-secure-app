import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

// Petit retour haptique réutilisable (vibrations légères au toucher).
export function useHaptic() {
  const light = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, []);

  const success = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const error = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }, []);

  return { light, success, error };
}
