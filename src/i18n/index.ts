import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

// 导入JSON格式的翻译资源文件
import zh from './locales/zh.json'
import en from './locales/en.json'

// 可用的语言资源
const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
}

// 初始化i18next
i18n
  .use(initReactI18next) // 将i18n实例传递给react-i18next
  .init({
    resources,
    // 检测设备语言，如果不支持则使用中文作为默认语言
    lng: Localization.getLocales()[0]?.languageCode || 'zh',
    fallbackLng: 'zh', // 如果检测到的语言不可用，则使用中文
    interpolation: {
      escapeValue: false, // 不转义特殊字符
    },
    compatibilityJSON: 'v4', // 兼容性设置
  })

export default i18n
