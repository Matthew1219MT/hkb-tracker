'use client'
import "./Confirm.css";
import { Dispatch, SetStateAction, useEffect } from "react"; 

type props = {
    text: string,
    fuc: (...args: any[]) => any;
    confirm: boolean;
    setConfirm: Dispatch<SetStateAction<boolean>>;
}

const Confirm: React.FC<props> = ({text, fuc, confirm, setConfirm}) => {

    const confirmListener = () => {
        fuc();
        setConfirm(false);
    }

    return <div className={`confirm-container fade-in ${confirm ? 'visible' : ''}`}>
        <div className="confirm-box">
            {text}
            <div className="confirm-btn-list">
                <button className="confirm-btn cancel" onClick={()=>setConfirm(false)}>Cancel</button>
                <button className="confirm-btn confirm" onClick={()=>confirmListener()}>Confirm</button>
            </div>
        </div>
    </div>;
}

export default Confirm;