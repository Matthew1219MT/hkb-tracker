'use client'
import StopSearcher from "./StopSearcher";
import './Foundation.css';
import { useState } from "react";

const Foundation = () => {

    const [search, setSearch] = useState<boolean>(false);

    return <div className="foundation-container">
        <div className="foundation-center">
            <button onClick={() => setSearch(true)} className="foundation-search-btn">Search</button>
        </div>
        <div className={`foundation-stop-search ${search ? "active" : ""}`}>
            <StopSearcher setSearch={setSearch}/>
        </div>
    </div>
}

export default Foundation;