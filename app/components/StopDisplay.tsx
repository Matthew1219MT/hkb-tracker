'use client'
import { Route, Stop, StopETA } from "./types";
import "./StopDisplay.css";
import React, { useEffect, useState } from "react";
import { BaseUrl, removeBracketed } from "./utilities";

type props = {
    stopList: Stop[]
    setStopList: React.Dispatch<React.SetStateAction<Stop[]>>
    selectedRoute: Route,
}

const StopDisplay: React.FC<props> = ({stopList, setStopList, selectedRoute}) => {

    const [selectedStop, setSelectedStop] = useState<string>();

    const [stopETA, setStopETA] = useState<StopETA[]>([]);

    const diffInMinutesFromNow = (isoString: string) => {
        const future = new Date(isoString);
        const now = new Date();

        const diffMs = future.getTime() - now.getTime();
        const diffMinutes = Math.max(0, Math.ceil(diffMs / 60000));
        return diffMinutes;
    }

    const getStopETA = () => {
        const route: string = selectedRoute.route;
        const service_type: string = selectedRoute.service_type;
        const url: string = `${BaseUrl}v1/transport/kmb/eta/${selectedStop}/${route}/${service_type}`;
        fetch(url, { method: "get" })
        .then((response) => {
            if (!response.ok) {
                console.log("Failed to fetch");
            }
            return response.json();
        })
        .then((data: any) => {
            console.log(data);
            const eta_list: StopETA[] = data.data;
            if (eta_list.length > 0) {
                setStopETA(eta_list);
            }
        })
        .catch((e) => {
            console.log(e);
        });  
    }

    useEffect(() => {
        const periodicTask = setInterval(() => {
            if (selectedStop) {
                getStopETA();    
            }
        }, 60000);
        return () => clearInterval(periodicTask);
    }, []);

    useEffect(() => {
        if (selectedStop) {
            getStopETA();
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