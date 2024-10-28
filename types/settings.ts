export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  emailUpdates: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  autoSave: boolean;
  language: string;
}
