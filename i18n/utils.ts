import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';

// 获取当前设备语言
export const getDeviceLanguage = (): string => {
  return Localization.locale.split('-')[0] || 'zh';
};

// 切换语言
export const changeLanguage = (lng: string): Promise<any> => {
  return i18next.changeLanguage(lng);
};

// 获取当前语言
export const getCurrentLanguage = (): string => {
  return i18next.language;
};

// 检查是否为RTL语言
export const isRTL = (): boolean => {
  return Localization.isRTL;
};

// 导出useTranslation hook以便在组件中使用
export { useTranslation };

// 简便的翻译函数
// 如果没有找到对应的翻译，返回key本身
export const t = (key: string, prefix?: string, options?: any): string => {
  if (prefix) {
    const prefixKey = `${prefix}.${key}`;
    const translated = i18next.t(prefixKey, options) as string;
    return translated === prefixKey ? key : translated;
  } else {
    return i18next.t(key, options) as string;
  }
};

/**
 * 翻译名字函数，支持单个名字或多个名字数组
 * @param {string|string[]} name - 需要翻译的名字，可以是单个字符串或字符串数组
 * @returns {string} 翻译后的名字字符串
 * @description
 * 1. 处理单个名字：
 *    - 其他语言尝试查找翻译，找不到则返回原值
 * 2. 处理多个名字：
 *    - 先尝试整体翻译组合名字
 *    - 整体翻译失败时逐个翻译名字
 *    - 中文环境使用·符号连接，其他语言使用空格连接
 */
export const translateName = (name: string | string[]): string => {
  const currentLang = getCurrentLanguage();

  // 处理单个名字的情况
  if (typeof name === 'string') {
    if (currentLang === 'en') {
      return name;
    }
    return t(name, 'name');
  }

  // 处理多个名字的情况
  // 组合为整体名字
  const combinedName = name.join(' ');

  // 尝试翻译整体名字
  const translatedCombinedName = t(combinedName, 'name');

  // 整体翻译成功，直接返回
  if (translatedCombinedName !== combinedName) {
    return translatedCombinedName;
  }

  // 整体翻译失败，逐个翻译每个名字
  const translatedNames = name.map(n =>  t(n, 'name'));

  // 根据语言环境选择连接符
  return currentLang === 'zh' ? translatedNames.join('·') : translatedNames.join(' ');
};

export const translateGPName = (raceId: string): string => {
  const raceIdWithoutYear = raceId.replace(/_\d{4}$/, '');
  return t(raceIdWithoutYear, 'GrandPrix');
}