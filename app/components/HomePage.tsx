'use client'

import { useState, useEffect } from "react";
import StopSearcher from "./StopSearcher";
import { useStop } from "./context/stopContext";
import { LocalStorageStop, Settings, StopETA } from "./types";
import "./HomePage.css";
import { diffInMinutesFromNow, getStopETA } from "./utilities";
import { SingleETA, defautSettings } from "./LoadData";
import Confirm from "./Confirm";
import { useTranslation } from 'react-i18next';
import Setting from "./Setting";
import StopRoute from "./StopRoute";

const HomePage = () => {

    const { t, i18n } = useTranslation();

    //Boolean state for search mode
    const [search, setSearch] = useState<boolean>(false);

    //State for list of stop ETAs
    const [stopETAList, setStopETAList] = useState<StopETA[]>([]);

    //Boolean state for edit mode
    const [edit, setEdit] = useState<boolean>(false);

    //Boolean state for settings mode
    const [setting, setSetting] = useState<boolean>(false);

    //State for local settings configuration, overwrites setting in local storage on change
    const [settingConfig, setSettingConfig] = useState<Settings | null>(null);

    //State for confirmation prompt
    const [confirmText, setConfirmText] = useState<string>('Confirm Text');

    //Boolean state for confirmation prompt
    const [confirm, setConfirm] = useState<boolean>(false);

    //State to control rendering of Confirm component for animation
    const [renderConfirm, setRenderConfirm] = useState<boolean>(false);

    //State for holding method to be executed on confirmation
    const [confirmFuc, setConfirmFuc] = useState<(...args: any[]) => string>(()=>{return ''});

    const { stopList, updateStopList } = useStop();

    //Method to edit order of ETA list
    const editETA = (direction: "up" | "down", index: number) => {
        const stop_eta_list: StopETA[] = [...stopETAList]
        if (direction === "up") {
            const temp: StopETA = stop_eta_list[index];
            stop_eta_list[index] = stop_eta_list[index-1];
            stop_eta_list[index-1] = temp;
        } else {
            const temp: StopETA = stop_eta_list[index];
            stop_eta_list[index] = stop_eta_list[index+1];
            stop_eta_list[index+1] = temp;
        }
        setStopETAList(stop_eta_list);
    }

    //Method to remove ETA from list
    const deleteETA = (index: number) => {
        const stop_eta_list: StopETA[] = [...stopETAList];
        stop_eta_list.splice(index, 1);
        setStopETAList(stop_eta_list);
    }

    //Method for saving edited ETA list to local storage 
    const saveETA = () => {
        const new_local_storage_stop: LocalStorageStop[] = [];
        stopETAList.forEach((stop, index)=> {
            new_local_storage_stop.push({
                route: stop.route,
                service_type: stop.service_type,
                name_en: stop.name_en,
                name_tc: stop.name_tc,
                name_sc: stop.name_sc,
                dest_en: stop.dest_en,
                dest_sc: stop.dest_sc,
                dest_tc: stop.dest_tc,
                stop: stop.stop,
            });
        })
        updateStopList(new_local_storage_stop);
        setEdit(false);
    }

    //Method for updating ETA list from API calls
    const updateETA = () => {
        const stop_list: LocalStorageStop[] = stopList;
        //Create dummy data to render before API response
        const dummy_data: StopETA[] = [];
        stop_list.forEach(stop => {
            const fake_eta: StopETA = { ...SingleETA };
            fake_eta.route = stop.route;
            fake_eta.service_type = stop.service_type;
            fake_eta.stop = stop.stop;
            fake_eta.name_en = stop.name_en;
            fake_eta.name_tc = stop.name_tc;
            fake_eta.name_sc = stop.name_sc;
            fake_eta.dest_en = stop.dest_en;
            fake_eta.dest_sc = stop.dest_sc;
            fake_eta.dest_tc = stop.dest_tc;
            dummy_data.push(fake_eta);
        });
        setStopETAList(dummy_data);
        //Fetch the real ETA data
        Promise.all(
            stop_list.map(stop =>
                getStopETA(stop)
                .then((eta_list) => {
                    //Only return the nearest ETA result
                    return eta_list.filter((eta) => eta.eta_seq === 1)[0];
                })
            )
        ).then((new_eta_list) => {
            setStopETAList(new_eta_list);
        });
    }

    //Event handler for cancel button
    const cancelHandler = (): string => {
        setEdit(false);
        setSetting(false);
        return t('cancelConfirm');
    }

    //Event listener for cancel button
    const cancelListener = () => {
        setConfirmFuc(() => cancelHandler);
        setConfirmText(t('cancelPrompt'));
        setConfirm(true);
    }

    //Event handler for saving ETA
    const saveHandler = (): string => {
        if (edit) {
            saveETA();
        } else {
            setSetting(false);
        }
        return t('saveConfirm');
    }

    //Event listener for saving ETA
    const saveListener = () => {
        setConfirmFuc(() => saveHandler);
        setConfirmText(t('savePrompt'));
        setConfirm(true);
    }

    //Load settings from local storage
    const loadSettings = () => {
        const stored_settings: string = localStorage.getItem("settings") ?? '{"language":"tc"}';
        const setting: Settings = JSON.parse(stored_settings);
        setSettingConfig(setting);
    }

    //Clear all saved stops with confirmation prompt
    const clearStops = () => {
        setConfirmFuc(() => clearStopsHandler);
        setConfirmText(t('clearStopConfirm'));
        setConfirm(true);
    }

    //Event handler for clearing all saved stops
    const clearStopsHandler = (): string => {
        updateStopList([]);
        return t('clearStopPrompt');
    }

    //Clear settings to default with confirmation prompt
    const clearSettings = () => {
        setConfirmFuc(() => clearSettingsHandler);
        setConfirmText(t('clearSettingConfirm'));
        setConfirm(true);
    }

    //Event handler for clearing settings in local storage
    const clearSettingsHandler = (): string => {
        localStorage.setItem("settings", JSON.stringify(defautSettings));
        setSettingConfig(defautSettings);
        return t('clearSettingPrompt');
    }

    //Load settings on initial render
    useEffect(() => {
        loadSettings();
    }, []);

    //Update ETA per minute
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 0) {
                updateETA();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [stopList]);

    //Update ETA when stop list changes
    useEffect(() => {
        updateETA();
    }, [stopList]);

    //Update ETA when exiting edit mode
    useEffect(() => {
        if (!edit) {
            updateETA();
        }
    }, [edit]);

    //Control rendering of Confirm component for animation
    useEffect(() => {
        if (confirm) {
            setRenderConfirm(true);
        } else {
            const timer = setTimeout(() => setRenderConfirm(false), 500);
            return () => clearTimeout(timer);
        }
    }, [confirm]);

    //Save settings to local storage on change
    useEffect(() => {
        if (setting) {
            loadSettings();
        } else {
            if (settingConfig) {
                localStorage.setItem("settings", JSON.stringify(settingConfig));
            }
        }
    }, [setting]);

    //Update i18n language on settings change
    useEffect(() => {
        if (settingConfig) {
            i18n.changeLanguage(settingConfig.language);
        }
    }, [settingConfig]);

    return <div className="homepage-container">
        {renderConfirm && <Confirm text={confirmText} fuc={confirmFuc} confirm={confirm} setConfirm={setConfirm}/>}
        <div className="homepage-list">
            {setting ? 
                <Setting settingConfig={settingConfig} setSettingConfig={setSettingConfig} clearSettings={clearSettings} clearStops={clearStops}/>
                : 
                <>
                    {stopETAList.length > 0 && stopETAList.map((stop, index) => {
                        if (stop) {
                            const time = stop.eta === 'Loading...' ? t('loading') : diffInMinutesFromNow(stop.eta);
                            return <div className="homepage-stop" key={index}>
                                <StopRoute route={{route: stop.route, dest_en: stop.dest_en, dest_sc: stop.dest_sc, dest_tc: stop.dest_tc, bound: 'I', orig_en: stop.name_en , orig_sc: stop.name_sc, orig_tc: stop.name_tc, service_type: stop.service_type}}></StopRoute>
                                <div style={{flexShrink: 0}}>
                                {edit ? 
                                    <div className="homepage-edit-menu">
                                        <button className="homepage-edit-btn" disabled={index < 1} onClick={()=>editETA("up", index)}><b>▲</b></button>
                                        <button className="homepage-edit-btn" disabled={index >= stopETAList.length - 1} onClick={()=>editETA("down", index)}><b>▼</b></button>
                                        <button className="homepage-delete-btn" onClick={()=>deleteETA(index)}><b>X</b></button>
                                    </div>
                                :
                                    <p>{time == "0" ? t('comingSoon') : <>{time} {t('mins')}</>}</p>
                                }
                                </div>
                            </div>
                        }
                    })} 
                </>
            }
        </div>
        <div className="homepage-menu">
            {edit || setting ?
                <button onClick={() => cancelListener()} className="homepage-menu-btn">{t('cancel')}</button>
            :
                <button onClick={() => setEdit(true)} className="homepage-menu-btn">{t('edit')}</button>
            }
            <button onClick={() => setSearch(true)} className="homepage-menu-search-btn" disabled={edit}>{t('search')}</button>
            {edit || setting ?
                <button onClick={() => saveListener()} className="homepage-menu-btn">{t('save')}</button>
            :
                <button onClick={() => setSetting(true)} className="homepage-menu-btn">{t('setting')}</button>
            }
        </div>
        <div className={`slide-panel ${search ? 'active' : ''}`}>
            <StopSearcher search={search} setSearch={setSearch} />
        </div>
    </div>
}

export default HomePage;