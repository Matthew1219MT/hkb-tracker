'use client'
import { Route, Stop, StopETA } from "./types";
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

    const [selectedStop, setSelectedStop] = useState<string>();

    const [stopETA, setStopETA] = useState<StopETA[]>([]);

    const { addStop } = useStop();

    const setStopListener = (stop: string) => {
        if (stop === selectedStop) {
            setSelectedStop("");
        } else {
            setSelectedStop(stop);
        }
    }

    const addStopListener = (stop: string) => {
        //console.log(selectedRoute.route, selectedRoute.service_type, stop);
        const new_stop = {
            stop: stop,
            route: selectedRoute.route,
            service_type: selectedRoute.service_type
        };
        const result: boolean = addStop(new_stop);
        if (result) {
            console.log("Stop successfully added");
        } else {
            console.log("Duplicate stop");
        }
    }

    useEffect(() => {
        const periodicTask = setInterval(() => {
            if (selectedStop) {
                setStopETA(ETALoading);
                getStopETA(selectedRoute.route, selectedRoute.service_type, selectedStop).then(
                    (eta_list: StopETA[]) => {
                        setStopETA(eta_list);
                    }
                );    
            }
        }, 60000);
        return () => clearInterval(periodicTask);
    }, []);

    useEffect(() => {
        if (selectedStop) {
            setStopETA(ETALoading);
            getStopETA(selectedRoute.route, selectedRoute.service_type, selectedStop).then(
                (eta_list: StopETA[]) => {
                    setStopETA(eta_list);
                }
            ); 
        }
    }, [selectedStop]);;

    return (
        <div className="stop-display-container">
            <button className="stop-display-btn" onClick={() => setStopList([])}>Return</button>
            {stopList.map((stop, index) => (
                <div key={index}>
                    <div className="stop-display-stop-btn" onClick={() => {setStopListener(stop.stop)}}>
                        {removeBracketed(stop.name_tc)}
                        <button className="stop-display-stop-add-btn" onClick={()=>{addStopListener(stop.stop)}}>+</button>
                    </div>
                    {stop.stop === selectedStop && stopETA.length > 0 && stopETA.map((ETA, i) => {
                            return <div key={i} className="stop-display-stop-ETA">{diffInMinutesFromNow(ETA.eta)}</div>
                    })}
                </div>
            ))}
        </div>
    );
}

export default StopDisplay;