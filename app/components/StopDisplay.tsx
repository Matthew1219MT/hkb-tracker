'use client'
import { Route, Stop, StopETA } from "./types";
import "./StopDisplay.css";
import React, { useEffect, useState } from "react";
import { BaseUrl, removeBracketed } from "./utilities";
import { ETALoading } from "./LoadData";

type props = {
    stopList: Stop[]
    setStopList: React.Dispatch<React.SetStateAction<Stop[]>>
    selectedRoute: Route,
}

const StopDisplay: React.FC<props> = ({stopList, setStopList, selectedRoute}) => {

    const [selectedStop, setSelectedStop] = useState<string>();

    const [stopETA, setStopETA] = useState<StopETA[]>([]);

    const diffInMinutesFromNow = (isoString: string): string | number => {
        if (isoString === "Loading...") {
            return isoString;
        }
        const future = new Date(isoString);
        const now = new Date();
        const diffMs = future.getTime() - now.getTime();
        const diffMinutes = Math.max(0, Math.ceil(diffMs / 60000));
        return diffMinutes;
    }

    const getStopETA = async (route: string, service_type: string, selected_stop: string) => {
        const url: string = `${BaseUrl}v1/transport/kmb/eta/${selected_stop}/${route}/${service_type}`;
        const response = await fetch(url, { method: "get" });
        if (!response.ok) {
            console.log("Failed to fetch");
            return [];
        } else {
            const data = await response.json();
            const eta_list: StopETA[] = data.data;
            return eta_list;
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
                <div key={index} className="stop-display-stop-btn" onClick={() => {setSelectedStop(stop.stop)}}>
                    {removeBracketed(stop.name_tc)}
                    {stop.stop === selectedStop && stopETA.length > 0 && stopETA.map((ETA, i) => {
                        return <div key={i}>{ETA.rmk_tc}: {diffInMinutesFromNow(ETA.eta)}</div>
                    })}
                </div>
            ))}
        </div>
    );
}

export default StopDisplay;