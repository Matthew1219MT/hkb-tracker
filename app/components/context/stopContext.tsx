import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LocalStorageStop } from "../types";

interface StopContextType {
    stopList: LocalStorageStop[];
    addStop: (new_stop: LocalStorageStop) => boolean;
    updateStopList: (new_stop_list: LocalStorageStop[]) => boolean;
}

const StopContext = createContext<StopContextType | undefined>(undefined);

export const StopProvider: React.FC<{children: ReactNode}> = ({children}) => {

    const [stopList, setStopList] = useState<LocalStorageStop[]>([]);

    useEffect(() => {
        const stored_stops = localStorage.getItem("stopList") ?? "[]";
        const stop_list: LocalStorageStop[] = JSON.parse(stored_stops);
        setStopList(stop_list);
    }, []);

    useEffect(() => {
        localStorage.setItem("stopList", JSON.stringify(stopList));
    }, [stopList]);
    
    const addStop = (add_stop: LocalStorageStop) => {
        const exist = stopList.some((stop) => 
            stop.stop === add_stop.stop && 
            stop.route === add_stop.route && 
            stop.service_type === add_stop.service_type
        );
        
        if (exist) {
            return false;
        } else {
            setStopList([...stopList, add_stop]);
            return true;
        }
    }

    const updateStopList = (new_stop_list: LocalStorageStop[]) => {
        setStopList(new_stop_list);
        return true;
    }

    return <StopContext.Provider value={{ stopList, addStop, updateStopList }}>
        {children}
    </StopContext.Provider>
};

export const useStop = () => {
    const context = useContext(StopContext);
    if (context === undefined) {
        throw new Error("useStop must be used within a StopProvider");
    }
    return context;
};