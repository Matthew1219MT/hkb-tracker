import { StopETA, LocalStorageStop } from "./types";
export const BaseUrl: string = "https://data.etabus.gov.hk/";

export function removeBracketed(text: string): string {
  return text.replace(/\([^)]*\)/g, '').trim();
}

export const getStopETA = async (route: string, service_type: string, selected_stop: string) => {
    const url: string = `${BaseUrl}v1/transport/kmb/eta/${selected_stop}/${route}/${service_type}`;
    const response = await fetch(url, { method: "get" });
    if (!response.ok) {
        console.log("Failed to fetch");
        return [];
    } else {
        const data = await response.json();
        const eta_list: StopETA[] = data.data;
        return eta_list;
    }
}

export const getStopList = (): LocalStorageStop[] => {
    const stored_stops = localStorage.getItem("stopList") ?? "[]";
    const stop_list: LocalStorageStop[] = JSON.parse(stored_stops);
    return stop_list;
}

export const addStop = (add_stop: LocalStorageStop) => {
    const stop_list: LocalStorageStop[] = getStopList();
    const exist: boolean = stop_list.some((stop) => stop.stop === add_stop.stop && stop.route === add_stop.route && stop.service_type === add_stop.service_type);
    if (exist) {
        return false;
    } else {
        stop_list.push(add_stop);
        localStorage.setItem("stopList", JSON.stringify(stop_list));
        return true;
    }
}

export const setStopList = (stop_list: LocalStorageStop[]) => {
    localStorage.setItem("stopList", JSON.stringify(stop_list));
}