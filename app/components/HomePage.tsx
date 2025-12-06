'use client'

import { useState, useEffect } from "react";
import StopSearcher from "./StopSearcher";
import { useStop } from "./context/stopContext";
import { LocalStorageStop, StopETA } from "./types";
import "./HomePage.css";
import { diffInMinutesFromNow, getStopETA } from "./utilities";
import { SingleETA } from "./LoadData";
import Confirm from "./Confirm";
import { useTranslation } from 'react-i18next';

const HomePage = () => {

    const { t, i18n } = useTranslation();

    const [search, setSearch] = useState<boolean>(false);

    const [renderSearch, setRenderSearch] = useState<boolean>(false);

    const [stopETAList, setStopETAList] = useState<StopETA[]>([]);

    const [edit, setEdit] = useState<boolean>(false);

    const [setting, setSetting] = useState<boolean>(false);

    const [confirmText, setConfirmText] = useState<string>('Confirm Text');

    const [confirm, setConfirm] = useState<boolean>(false);

    const [renderConfirm, setRenderConfirm] = useState<boolean>(false);

    const [confirmFuc, setConfirmFuc] = useState<(...args: any[]) => string>(()=>{return ''});

    const { stopList, updateStopList } = useStop();

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

    const deleteETA = (index: number) => {
        const stop_eta_list: StopETA[] = [...stopETAList];
        stop_eta_list.splice(index, 1);
        setStopETAList(stop_eta_list);
    }

    const saveETA = () => {
        const new_local_storage_stop: LocalStorageStop[] = [];
        stopETAList.forEach((stop, index)=> {
            new_local_storage_stop.push({
                route: stop.route,
                service_type: stop.service_type,
                stop: stop.stop,
                stop_name: stop.stop_name
            });
        })
        updateStopList(new_local_storage_stop);
        setEdit(false);
    }

    const updateETA = () => {
        const dummy_data: StopETA[] = [];
        const stop_list: LocalStorageStop[] = stopList;
        stop_list.forEach(stop => {
            const fake_eta: StopETA = { ...SingleETA };
            fake_eta.route = stop.route;
            fake_eta.service_type = stop.service_type;
            fake_eta.stop = stop.stop;
            fake_eta.stop_name = stop.stop_name;
            dummy_data.push(fake_eta);
        });
        setStopETAList(dummy_data);
        Promise.all(
            stop_list.map(stop =>
                getStopETA(stop)
                .then((eta_list) => {
                    return eta_list.filter((eta) => eta.eta_seq === 1)[0];
                })
            )
        ).then((new_eta_list) => {
            setStopETAList(new_eta_list);
        });
    }

    const cancelHandler = (): string => {
        setEdit(false);
        return t('cancelConfirm');
    }

    const cancelListener = () => {
        setConfirmFuc(() => cancelHandler);
        setConfirmText(t('cancelPrompt'));
        setConfirm(true);
    }

    const saveHandler = (): string => {
        saveETA();
        return t('saveConfirm');
    }

    const saveListener = () => {
        setConfirmFuc(() => saveHandler);
        setConfirmText(t('savePrompt'));
        setConfirm(true);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 0) {
                updateETA();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [stopList]);

    useEffect(() => {
        updateETA();
    }, [stopList]);

    useEffect(() => {
        if (search) {
            setRenderSearch(true);
        } else {
            const timer = setTimeout(() => setRenderSearch(false), 400);
            return () => clearTimeout(timer);
        }
    }, [search]);

    useEffect(() => {
        if (!edit) {
            updateETA();
        }
    }, [edit]);

    useEffect(() => {
        if (confirm) {
            setRenderConfirm(true);
        } else {
            const timer = setTimeout(() => setRenderConfirm(false), 500);
            return () => clearTimeout(timer);
        }
    }, [confirm]);

    useEffect(() => {
        if (search) {
            setRenderSearch(true);
        } else {
            const timer = setTimeout(() => setRenderSearch(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [search]);

    return <div className="homepage-container">
        {renderConfirm && <Confirm text={confirmText} fuc={confirmFuc} confirm={confirm} setConfirm={setConfirm}/>}
        <div className="homepage-list">
            {stopETAList.length > 0 && stopETAList.map((stop, index) => {
                if (stop) {
                    const time = diffInMinutesFromNow(stop.eta);
                    return <div className="homepage-stop" key={index}>
                        <p>{stop.route} {stop.stop_name}</p>
                        {edit ? 
                            <div className="homepage-edit-menu">
                                <button className="homepage-edit-btn" disabled={index < 1} onClick={()=>editETA("up", index)}><b>▲</b></button>
                                <button className="homepage-edit-btn" disabled={index >= stopETAList.length - 1} onClick={()=>editETA("down", index)}><b>▼</b></button>
                                <button className="homepage-delete-btn" onClick={()=>deleteETA(index)}><b>X</b></button>
                            </div>
                        :
                            <p>{time == "0" ? t('comingSoon') : time}</p>
                        }
                    </div>
                }
            })} 
        </div>
        <div className="homepage-menu">
            {edit ?
                <button onClick={() => cancelListener()} className="homepage-menu-btn">{t('cancel')}</button>
            :
                <button onClick={() => setEdit(true)} className="homepage-menu-btn">{t('edit')}</button>
            }
            <button onClick={() => setSearch(true)} className="homepage-menu-search-btn" disabled={edit}>{t('search')}</button>
            {edit ?
                <button onClick={() => saveListener()} className="homepage-menu-btn">{t('save')}</button>
            :
                <button onClick={() => setSetting(true)} className="homepage-menu-btn">{t('setting')}</button>
            }
        </div>
        <StopSearcher search={search} setSearch={setSearch} />
    </div>
}

export default HomePage;