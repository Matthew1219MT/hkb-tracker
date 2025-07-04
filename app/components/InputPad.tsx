import './InputPad.css';
import React from 'react';

type props = {
    updateInput: React.Dispatch<React.SetStateAction<string>>
}

const InputPad: React.FC<props> = ({updateInput}) => {

    const onClickHandler = (value: string) =>{ 
        updateInput(prev => {
            return prev + value;
        })
    }

    const clearHandler = () => {
        console.log("Clear");
        updateInput("");
    }

    const deleteHandler = () => {
        updateInput(prev => {
            console.log(prev.slice(0, -1));
            return prev.slice(0, -1); 
        })
    }

    return <div className="inputpad-container">
        <div className="inputpad-num-container">
            {Array.from({ length: 9 }).map((_, index) => (
                <button className="inputpad-button" key={"num" + index} onClick={()=>{onClickHandler((9-index).toString())}}>{9-index}</button>
            ))}
            <button className="inputpad-button" onClick={()=>{clearHandler()}}>Clear</button>
            <button className="inputpad-button" onClick={()=>{onClickHandler("0")}}>0</button>
            <button className="inputpad-button" onClick={()=>{deleteHandler()}}>←</button>
        </div>
        <div className="inputpad-chr-container">
            {Array.from({ length: 9 }).map((_, index) => (
                <button className='inputpad-button inputpad-chr' key={"chr" + index}>{index}</button>
            ))}
        </div>
    </div>
}

export default InputPad;