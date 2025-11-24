'use client'

import { useState, useEffect } from "react";
import StopSearcher from "./StopSearcher";
import { useStop } from "./context/stopContext";
import { StopETA } from "./types";
import "./HomePage.css";
import { diffInMinutesFromNow, getStopETA } from "./utilities";

const HomePage = () => {

    const [search, setSearch] = useState<boolean>(false);

    const [stopETAList, setStopETAList] = useState<StopETA[]>([]);

    const { stopList } = useStop();

    useEffect(() => {
        const new_eta_list: StopETA[] = [];
        const dummy_data: StopETA[] = [];
        stopList.forEach(stop => {
            dummy_data.push({
                "route": stop.route,
                "service_type": stop.service_type,
                "stop": stop.stop,
                "eta_seq": 1,
                "eta": "Loading...",
                "dest_tc": "Loading...",
                "dest_sc": "Loading...",
                "dest_en": "Loading...",
                "co": "KMB",
                "dir": "I",
                "data_timestamp": "",
                "rmk_en": "",
                "rmk_sc": "",
                "rmk_tc": "",
                "seq": 0
            })
        });
        setStopETAList(dummy_data);
        Promise.all(
            stopList.map(stop =>
                getStopETA(stop.route, stop.service_type, stop.stop)
                .then((eta_list) => eta_list.filter((eta) => eta.eta_seq === 1)[0])
            )
        ).then((new_eta_list) => {
            setStopETAList(new_eta_list);
        });
    }, [stopList]);

    return <div className="homepage-container">
        <div className="homepage-center">
            <button onClick={() => setSearch(true)} className="homepage-search-btn">Search</button>
        </div>
        {stopETAList.length > 0 && stopETAList.map((stop, index) => {
            return <div key={index}>{stop.dest_tc} | {diffInMinutesFromNow(stop.eta)}</div>
        })}
        <div className={`homepage-stop-search ${search ? "active" : ""}`}>
            <StopSearcher setSearch={setSearch} />
        </div>
    </div>
}

export default HomePage;