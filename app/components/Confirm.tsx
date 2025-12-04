'use client'
import "./Confirm.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react"; 

type props = {
    text: string,
    fuc: (...args: any[]) => string;
    confirm: boolean;
    setConfirm: Dispatch<SetStateAction<boolean>>;
}

const Confirm: React.FC<props> = ({text, fuc, confirm, setConfirm}) => {

    const [result, setResult] = useState<string>('');

    const confirmListener = () => {
        const r: string = fuc();
        setResult(r);
    }

    const okListener = () => {
        setConfirm(false);
    }

    return <div className={`confirm-container fade-in ${confirm ? 'visible' : ''}`}>
        <div className="confirm-box">
            {result === '' ?
                <>
                    {text}
                    <div className="confirm-btn-list">
                        <button className="confirm-btn cancel" onClick={()=>setConfirm(false)}>Cancel</button>
                        <button className="confirm-btn confirm" onClick={()=>confirmListener()}>Confirm</button>
                    </div>
                </>
            :
                <>
                    {result}
                    <div className="confirm-btn-list">
                        <button className="confirm-btn confirm" onClick={()=>okListener()}>Confirm</button>
                    </div>

                </>
            }
            
        </div>
    </div>;
}

export default Confirm;