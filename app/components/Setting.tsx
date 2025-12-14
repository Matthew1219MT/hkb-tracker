'use client'
import { useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './Setting.css';
import { Settings } from './types';

type Props = {
    settingConfig: Settings | null;
    setSettingConfig: Dispatch<SetStateAction<Settings | null>>,
    clearSettings: () => void;
    clearStops: () => void;
}

const Setting: React.FC<Props> = ({ settingConfig, setSettingConfig, clearSettings, clearStops }) => {

    const { t, i18n } = useTranslation();

    const languageChangeListener = (e: ChangeEvent<HTMLSelectElement> ) => {
        setSettingConfig(prev => ({...prev, language: e.target.value} as Settings));
    }

    return <>{settingConfig ?
        <div className="setting-container">
            <div className="setting-title">
                {t('setting')}
            </div>

            <div className="setting-config">
                <label>{t('language')}:</label>
                <select defaultValue={settingConfig.language} onChange={languageChangeListener}>
                    <option value="tc">繁體中文</option>
                    <option value="en">English</option>
                </select>
            </div>
            <hr className="setting-solid"/>
            <div className="setting-config">
                <label>{t('clearStop')}</label>
                <button className="setting-delete-btn" onClick={clearStops}>{t('clear')}</button>
            </div>
            <div className="setting-config">
                <label>{t('clearSetting')}</label>
                <button className="setting-delete-btn" onClick={clearSettings}>{t('clear')}</button>
            </div>
        </div>
        :
        <div>{t('loading')}</div>
    }</>
}

export default Setting;