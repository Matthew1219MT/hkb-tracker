import './InputPad.css';
import React from 'react';

type props = {
    availableChr: string[],
    updateInput: React.Dispatch<React.SetStateAction<string>>
}

const InputPad: React.FC<props> = ({availableChr, updateInput}) => {

    const NumPad: number[] = [7, 8, 9, 4, 5, 6, 1, 2, 3];

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
            return prev.slice(0, -1); 
        })
    }

    return <div className="inputpad-container">
        <div className="inputpad-num-container">
            {NumPad.map((value, index) => {
                const num: string = (value).toString();
                const hide: boolean = !availableChr.includes(num);
                return <button 
                    className="inputpad-button" 
                    key={"num" + value} 
                    onClick={()=>{onClickHandler(num)}}
                    disabled={hide}
                >
                    {num}
                </button>
            })}
            <button className="inputpad-button" onClick={()=>{clearHandler()}}>Clear</button>
            <button className="inputpad-button" onClick={()=>{onClickHandler("0")}} disabled={!availableChr.includes("0")}>0</button>
            <button className="inputpad-button" onClick={()=>{deleteHandler()}}>←</button>
        </div>
        <div className="inputpad-chr-container">
            {availableChr.map((value, index) => {
                if (isNaN(Number(value))) {
                    return <button className='inputpad-button inputpad-chr' key={"chr" + index}>{value}</button>
                }
            })}
        </div>
    </div>
}

export default InputPad;