'use client'
import { useEffect, useState } from "react";
import { StopETA, LocalStorageStop } from "./types";
export const BaseUrl: string = "https://data.etabus.gov.hk/";

export function removeBracketed(text: string): string {
  return text.replace(/\([^)]*\)/g, '').trim();
}

export const diffInMinutesFromNow = (isoString: string): string | number => {
    if (isoString === "Loading...") {
        return isoString;
    }
    const future = new Date(isoString);
    const now = new Date();
    const diffMs = future.getTime() - now.getTime();
    const diffMinutes = Math.max(0, Math.ceil(diffMs / 60000));
    return diffMinutes;
}

export const getStopETA = async (stop: LocalStorageStop) => {
    const url: string = `${BaseUrl}v1/transport/kmb/eta/${stop.stop}/${stop.route}/${stop.service_type}`;
    const response = await fetch(url, { method: "get" });
    if (!response.ok) {
        console.log("Failed to fetch");
        return [];
    } else {
        const data = await response.json();
        const eta_list: StopETA[] = data.data;
        eta_list.forEach((stop_eta)=>{
            stop_eta.stop = stop.stop;
            stop_eta.stop_name = stop.stop_name;
        });
        return eta_list;
    }
}

export const getStopList = (): LocalStorageStop[] => {
    if (typeof window === 'undefined') {
        return [];
    }
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