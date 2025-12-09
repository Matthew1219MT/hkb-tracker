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

    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    useEffect(() => {
        if (firstLoad) {
            console.log("Loading stop list from localStorage");
            const stored_stops = localStorage.getItem("stopList") || "[]";
            const stop_list: LocalStorageStop[] = JSON.parse(stored_stops);
            setStopList(stop_list);
            setFirstLoad(false);
        } else {
            console.log("Updating localStorage with stop list changes");
            localStorage.setItem("stopList", JSON.stringify(stopList));
        }
    }, [stopList]);
    
    const addStop = (add_stop: LocalStorageStop) => {
        const exist = stopList.some((stop) => 
            stop.stop === add_stop.stop && 
            stop.route === add_stop.route && 
            stop.service_type === add_stop.service_type &&
            stop.name_en === add_stop.name_en &&
            stop.name_tc === add_stop.name_tc &&
            stop.name_sc === add_stop.name_sc
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