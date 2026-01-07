import { clear } from 'console';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          search: "Search",
          edit: "Edit",
          setting: "Settings",
          cancel: "Cancel",
          save: "Save",
          confirm: "Confirm",
          cancelPrompt: "Do you want to cancel your edit? Changes will be lost!",
          cancelConfirm: "Changes cancelled",
          savePrompt: "Do you want to save the current edit?",
          saveConfirm: "Changes saved",
          clear: "Clear",
          return: "Return",
          storePrompt: "Do you want to save this stop?",
          storeConfirm: "Stop saved",
          storeError: "",
          comingSoon: "Coming Soon",
          to: "to",
          language: "Language",
          loading: "Loading...",
          clearStop: "Clear all saved stops",
          clearSetting: "Clear all settings",
          clearStopConfirm: "Do you want to clear all saved stops?",
          clearStopPrompt: "All stops have been cleared",
          clearSettingConfirm: "Do you want to clear all settings?",
          clearSettingPrompt: "ALl settings have been cleared",
          mins: 'mins',
          special: 'Special',
          intro_1: "Hong Kong Bus ETA Tracker",
          intro_2: "Written by Matthew Tse",
          intro_3: "Source Code can be viewed at"
        }
      },
      tc: {
        translation: {
          search: "搜尋",
          edit: "修改",
          setting: "設定",
          cancel: "取消",
          save: "儲存",
          confirm: "確認",
          cancelPrompt: "你確定要取消修改？改動將會消失！",
          cancelConfirm: "已取消修改",
          savePrompt: "你要儲存現在的改動嗎？",
          saveConfirm: "已儲存改動",
          clear: "清除",
          return: "返回",
          storePrompt: "你要儲存這個巴士站嗎？",
          storeConfirm: "成功儲存巴士站",
          storeError: "這個巴士站已被儲存",
          comingSoon: "即將抵達",
          to: "往",
          language: "語言",
          loading: "加載中...",
          clearStop: "清除所有已儲存的巴士站",
          clearSetting: "清除所有設定",
          clearStopConfirm: "你確定要清除所有已儲存的巴士站嗎？",
          clearStopPrompt: "所有已儲存的巴士站已被清除",
          clearSettingConfirm: "你確定要清除所有設定嗎？",
          clearSettingPrompt: "所有設定已被清除",
          mins: '分鐘',
          special: '特別班',
          intro_1: "香港巴士預計到達時間追蹤器",
          intro_2: "作者: Matthew Tse",
          intro_3: "原始碼可在以下位置查看："
        }
      },
      sc: {
        translation: {
          search: "搜索",
          edit: "修改",
          setting: "设置",
          cancel: "取消",
          save: "储存",
          confirm: "确认",
          cancelPrompt: "你确定要取消修改？改动将会消失！",
          cancelConfirm: "已取消修改",
          savePrompt: "你要储存现在的改动吗？",
          saveConfirm: "已储存改动",
          clear: "清除",
          return: "返回",
          storePrompt: "你要储存这个巴士站吗？",
          storeConfirm: "成功储存巴士站",
          storeError: "这个巴士站已被储存",
          comingSoon: "即將抵達",
          to: "往",
          language: "語言",
          loading: "加载中...",
          clearStop: "清除所有已储存的巴士站",
          clearSetting: "清除所有设定",
          clearStopConfirm: "你确定要清除所有已储存的巴士站吗？",
          clearStopPrompt: "所有已储存的巴士站已被清除",
          clearSettingConfirm: "你确定要清除所有设定吗？",
          clearSettingPrompt: "所有设定已被清除",
          mins: '分钟',
          special: '特別班',
          intro_1: "香港巴士预计到达时间追踪器",
          intro_2: "作者: Matthew Tse",
          intro_3: "源代码可在以下位置查看："
        }
      }
    },
    lng: 'tc',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;