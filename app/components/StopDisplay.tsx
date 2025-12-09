'use client'
import { LocalStorageStop, Route, Stop, StopETA } from "./types";
import "./StopDisplay.css";
import React, { useEffect, useState } from "react";
import { diffInMinutesFromNow, getStopETA, removeBracketed } from "./utilities";
import { ETALoading } from "./LoadData";
import { useStop } from "./context/stopContext";
import Confirm from "./Confirm";
import { useTranslation } from "react-i18next";

type props = {
    stopList: Stop[]
    setStopList: React.Dispatch<React.SetStateAction<Stop[]>>
    selectedRoute: Route,
}

const StopDisplay: React.FC<props> = ({stopList, setStopList, selectedRoute}) => {

    const { t, i18n } = useTranslation();

    const [selectedStop, setSelectedStop] = useState<Stop | null>();

    const [stopETA, setStopETA] = useState<StopETA[]>([]);

    const [confirmText, setConfirmText] = useState<string>('Confirm Text');

    const [confirm, setConfirm] = useState<boolean>(false);

    const [renderConfirm, setRenderConfirm] = useState<boolean>(false);

    const [confirmFuc, setConfirmFuc] = useState<(...args: any[]) => string>(()=>{return ''});

    const { addStop } = useStop();

    //Set selected stop
    const setStopListener = (stop: Stop) => {
        if (stop === selectedStop) {
            setSelectedStop(null);
        } else {
            setSelectedStop(stop);
        }
    }

    //Event handler for adding stop
    const addStopHandler = (stop: Stop): string => {
        const new_stop: LocalStorageStop = {
            stop: stop.stop,
            route: selectedRoute.route,
            service_type: selectedRoute.service_type,
            name_en: removeBracketed(stop.name_en),
            name_tc: removeBracketed(stop.name_tc),
            name_sc: removeBracketed(stop.name_sc),
        };
        const result: boolean = addStop(new_stop);
        if (result) {
            return t("storeConfirm");
        } else {
            return t("storeError");
        }
    }

    //Event listener for adding stop
    const addStopListener = (stop: Stop) => {
        setConfirmFuc(() => () => addStopHandler(stop));
        setConfirmText(t("storePrompt"));
        setConfirm(true);
    }

    const getStopHandler = () => {
        if (selectedStop) {
            setStopETA(ETALoading);
            const stop: LocalStorageStop = {
                stop: selectedStop.stop,
                service_type: selectedRoute.service_type,
                route: selectedRoute.route,
                name_en: selectedStop.name_en,
                name_tc: selectedStop.name_tc,
                name_sc: selectedStop.name_sc,
            }
            getStopETA(stop).then(
                (eta_list: StopETA[]) => {
                    const valid_eta_list = eta_list.filter((eta) => eta.dir === selectedRoute.bound);
                    setStopETA(valid_eta_list);
                }
            );    
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 0) {
                getStopHandler();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [selectedStop]);

    useEffect(() => {
        getStopHandler();
    }, [selectedStop]);;

    useEffect(() => {
        if (confirm) {
            setRenderConfirm(true);
        } else {
            const timer = setTimeout(() => setRenderConfirm(false), 500);
            return () => clearTimeout(timer);
        }
    }, [confirm]);

    return (
        <div className="stop-display-container">
            {renderConfirm && <Confirm text={confirmText} fuc={confirmFuc} confirm={confirm} setConfirm={setConfirm}/>}
            <div className="stop-display-section-1">
                <button className="stop-display-return-btn" onClick={() => setStopList([])}>{t('return')}</button>
            </div>
            <div className="stop-display-section-2">
                {stopList.map((stop, index) => (
                    <div key={index}>
                        <div className="stop-display-stop">
                            <div className="stop-display-stop-text">
                                {removeBracketed(i18n.language === 'tc' ? stop.name_tc : stop.name_en)}
                            </div>
                            <div className="stop-display-btn-list">
                                <button className="stop-display-btn" onClick={()=>{addStopListener(stop)}}>+</button>
                                {stop.stop === selectedStop?.stop ? 
                                    <button className="stop-display-btn" onClick={() => {setStopListener(stop)}}>▲</button>
                                :
                                    <button className="stop-display-btn" onClick={() => {setStopListener(stop)}}>▼</button>
                                }
                            </div>
                        </div>
                        <div className="stop-display-ETA-list">
                            {stop.stop === selectedStop?.stop && stopETA.length > 0 && stopETA.map((ETA, i) => {
                                const time = ETA.eta === 'Loading...' ? t('loading') : diffInMinutesFromNow(ETA.eta);
                                return <div key={i} className="stop-display-stop-ETA">{ time == "0" ? t('comingSoon') : time}</div>
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StopDisplay;