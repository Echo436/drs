# i18n 国际化配置

本项目使用 i18next 和 expo-localization 实现国际化功能。

## 目录结构

```
i18n/
├── index.ts          # i18n 初始化配置
├── utils.ts          # 实用工具函数
├── I18nProvider.tsx  # React 上下文提供者
├── locales/          # 翻译资源文件
│   ├── zh.json       # 中文翻译
│   └── en.json       # 英文翻译
└── README.md         # 使用说明
```

## 使用方法

### 1. 在应用入口处包裹 I18nProvider

在应用的根组件中引入 I18nProvider：

```tsx
// 在 app/_layout.tsx 中
import { I18nProvider } from '@/i18n/I18nProvider';

export default function RootLayout() {
  return (
    <I18nProvider>
      {/* 应用内容 */}
    </I18nProvider>
  );
}
```

### 2. 在组件中使用翻译

使用 `useTranslation` hook 在组件中获取翻译：

```tsx
import { useTranslation } from '@/i18n/utils';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Text>{t('common.loading')}</Text>
  );
}
```

或者直接使用 `t` 函数：

```tsx
import { t } from '@/i18n/utils';

function MyComponent() {
  return (
    <Text>{t('common.loading')}</Text>
  );
}
```

### 3. 切换语言

使用 `useLanguage` hook 切换语言：

```tsx
import { useLanguage } from '@/i18n/I18nProvider';

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Button 
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
      onPress={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
    />
  );
}
```

### 4. 添加新的翻译

在 `locales` 目录下的JSON语言文件中添加新的翻译键值对。确保所有语言文件中都添加相同的键，以避免翻译缺失。

例如，向 `zh.json` 和 `en.json` 添加新的翻译：

在 `zh.json` 中：
```json
{
  "newSection": {
    "newKey": "新的翻译内容"
  }
}
```

在 `en.json` 中：
```json
{
  "newSection": {
    "newKey": "New translation content"
  }
}
```

## 使用JSON格式的优势

- 更加通用的格式，便于非开发人员编辑和维护
- 可以使用标准的JSON工具进行处理和验证
- 符合i18next的常见使用模式
- 便于与翻译服务集成

## 注意事项

- 默认语言为中文 (`zh`)
- 应用会自动检测设备语言并应用相应的翻译
- 如果检测到的语言不受支持，将回退到中文
- 添加新语言时，需要在 `index.ts` 中导入新的JSON文件并在resources对象中注册