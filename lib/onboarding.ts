import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDED_STORAGE_KEY = 'onboarded_v1';

export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDED_STORAGE_KEY);
  return value === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_STORAGE_KEY, completed ? 'true' : 'false');
}
