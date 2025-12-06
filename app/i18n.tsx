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
          setting: "Setting",
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
          comingSoon: "即將抵達"
        }
      }
    },
    lng: 'tc',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;