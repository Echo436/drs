import React, { createContext, useState, useContext, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import * as Localization from 'expo-localization';

import i18n from './index';
import { getDeviceLanguage } from './utils';

// 创建语言上下文
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
});

// 自定义hook用于访问语言上下文
export const useLanguage = () => useContext(LanguageContext);

// I18n提供者组件
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(getDeviceLanguage());

  // 设置语言并更新i18n实例
  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  // 初始化时设置语言
  useEffect(() => {
    const deviceLang = getDeviceLanguage();
    setLanguage(deviceLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};