'use client'
import { Stop } from "./types";
import "./StopDisplay.css";
import React from "react";

type props = {
    stopList: Stop[]
    setStopList: React.Dispatch<React.SetStateAction<Stop[]>>
}

const StopDisplay: React.FC<props> = ({stopList, setStopList}) => {
    return (
        <div className="stop-display-container">
            <button className="stop-display-btn" onClick={() => setStopList([])}>Return</button>
            {stopList.map((stop, index) => (
                <div key={index}>
                    {stop.name_tc}
                </div>
            ))}
        </div>
    );
}

export default StopDisplay;