'use client'
import { useState } from 'react';
import './Foundation.css';
import InputPad from './InputPad';

const Foundation: React.FC = () => {

    const [inputRoute, setInputRoute] = useState<string>("");

    return <div className="foundation-containter ">
        <div className="foundation-section-1">
            {inputRoute}
        </div>
        <div className="foundation-section-2">
            Section 2
        </div>
        <InputPad updateInput={setInputRoute}/>
    </div>
}

export default Foundation;