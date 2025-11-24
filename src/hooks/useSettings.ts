import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const storedSettings = await db.settings.get('appSettings');

      if (storedSettings) {
        setSettings(storedSettings.value as AppSettings);
      } else {
        // Initialize with defaults
        await db.settings.put({
          key: 'appSettings',
          value: DEFAULT_APP_SETTINGS,
        });
        setSettings(DEFAULT_APP_SETTINGS);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      await db.settings.put({
        key: 'appSettings',
        value: newSettings,
      });
      setSettings(newSettings);
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refresh: loadSettings,
  };
}
