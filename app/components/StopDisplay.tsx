'use client'
import { LocalStorageStop, Route, Stop, StopETA } from "./types";
import "./StopDisplay.css";
import React, { useEffect, useState } from "react";
import { diffInMinutesFromNow, getStopETA, removeBracketed } from "./utilities";
import { ETALoading } from "./LoadData";
import { useStop } from "./context/stopContext";

type props = {
    stopList: Stop[]
    setStopList: React.Dispatch<React.SetStateAction<Stop[]>>
    selectedRoute: Route,
}

const StopDisplay: React.FC<props> = ({stopList, setStopList, selectedRoute}) => {

    const [selectedStop, setSelectedStop] = useState<Stop | null>();

    const [stopETA, setStopETA] = useState<StopETA[]>([]);

    const { addStop } = useStop();

    const setStopListener = (stop: Stop) => {
        if (stop === selectedStop) {
            setSelectedStop(null);
        } else {
            setSelectedStop(stop);
        }
    }

    const addStopListener = (stop: string, stop_name: string) => {
        const new_stop = {
            stop: stop,
            route: selectedRoute.route,
            service_type: selectedRoute.service_type,
            stop_name: stop_name
        };
        const result: boolean = addStop(new_stop);
        if (result) {
            console.log("Stop successfully added");
        } else {
            console.log("Duplicate stop");
        }
    }

    const getStopHandler = () => {
        if (selectedStop) {
            setStopETA(ETALoading);
            const stop: LocalStorageStop = {
                stop: selectedStop.stop,
                service_type: selectedRoute.service_type,
                route: selectedRoute.route,
                stop_name: selectedStop.name_tc
            }
            getStopETA(stop).then(
                (eta_list: StopETA[]) => {
                    setStopETA(eta_list);
                }
            );    
        }
    }

    useEffect(() => {
        const periodicTask = setInterval(() => {
            getStopHandler();
        }, 60000);
        return () => clearInterval(periodicTask);
    }, []);

    useEffect(() => {
        getStopHandler();
    }, [selectedStop]);;

    return (
        <div className="stop-display-container">
            <div className="stop-display-section-1">
                <button className="stop-display-return-btn" onClick={() => setStopList([])}>Return</button>
            </div>
            <div className="stop-display-section-2">
                {stopList.map((stop, index) => (
                    <div key={index}>
                        <div className="stop-display-stop">
                            <div className="stop-display-stop-text">
                                {removeBracketed(stop.name_tc)}
                            </div>
                            <div className="stop-display-btn-list">
                                <button className="stop-display-btn" onClick={()=>{addStopListener(stop.stop, removeBracketed(stop.name_tc))}}>+</button>
                                {stop.stop === selectedStop?.stop ? 
                                    <button className="stop-display-btn" onClick={() => {setStopListener(stop)}}>▲</button>
                                :
                                    <button className="stop-display-btn" onClick={() => {setStopListener(stop)}}>▼</button>
                                }
                            </div>
                        </div>
                        {stop.stop === selectedStop?.stop && stopETA.length > 0 && stopETA.map((ETA, i) => {
                                return <div key={i} className="stop-display-stop-ETA">{diffInMinutesFromNow(ETA.eta)}</div>
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StopDisplay;