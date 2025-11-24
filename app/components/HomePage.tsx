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
        console.log(stopList);
        const new_eta_list: StopETA[] = [];
        stopList.forEach(stop => {
            getStopETA(stop.route, stop.service_type, stop.stop).then((eta_list) => {
                const eta: StopETA = eta_list.filter((eta) => eta.eta_seq === 1)[0];
                new_eta_list.push(eta);
            });
        })
        setStopETAList(new_eta_list);
    }, [stopList]);

    return <div className="homepage-container">
        <div className="homepage-center">
            <button onClick={() => setSearch(true)} className="homepage-search-btn">Search</button>
        </div>
        <div className={`homepage-stop-search ${search ? "active" : ""}`}>
            <StopSearcher setSearch={setSearch}/>
        </div>
        {stopETAList.map((stop) => {
            return <div>{stop.dest_tc} | {diffInMinutesFromNow(stop.eta)}</div>
        })}
    </div>
}

export default HomePage;