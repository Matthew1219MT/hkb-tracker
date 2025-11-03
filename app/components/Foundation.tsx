'use client'
import StopSearcher from "./StopSearcher";
import './Foundation.css';
import { useState } from "react";

const Foundation = () => {

    const [search, setSearch] = useState<boolean>(false);

    return <div className="foundation-container">
        <button onClick={() => setSearch(true)} style={{zIndex: 0}}>Search</button>
        <div className={`foundation-stop-search ${search ? "active" : ""}`}>
            <StopSearcher setSearch={setSearch}/>
        </div>
    </div>
}

export default Foundation;