'use client'
import { useEffect, useState } from 'react';
import React from "react";
import './StopSearcher.css';
import InputPad from './InputPad';
import { Route, Stop, RouteStop } from './types';
import StopDisplay from './StopDisplay'

type props = {
    search: boolean,
    setSearch: React.Dispatch<React.SetStateAction<boolean>>
};

const StopSearcher: React.FC<props> = ({ search, setSearch }) => {

    const BaseUrl: string = "https://data.etabus.gov.hk/";

    const [gettingStopList, setGettingStopList] = useState<boolean>(false);

    const [inputRoute, setInputRoute] = useState<string>("");

    const [selectedRoute, setSelectedRoute] = useState<Route>();

    const [routeList, setRouteList] = useState<Route[]>([]);

    const [stopList, setStopList] = useState<Stop[]>([]);

    const [availableRoute, setAvailableRoute] = useState<Route[]>([]);

    const [availableChr, setAvailableChr] = useState<string[]>([]);

    const updateAvailableRouteAndChr = (input_route: string) => {
        const available_route: Route[] = [];
        const available_chr: string[] = [];
        const input_route_length: number = input_route.length;
        routeList.forEach((route_info, index) => {
            const route: string = route_info.route;
            if (input_route_length <= route.length) {
                const sub_string: string = route.substring(0, input_route_length);
                if (sub_string === input_route) {
                    available_route.push(route_info);
                }
            }
        })
        available_route.forEach((route_info, index) => {
            const route: string = route_info.route;
            if (route.length > input_route_length) {
                if (!(available_chr.includes(route[input_route_length]))) {
                    available_chr.push(route[input_route_length]);
                }
            }
        })
        setAvailableRoute(available_route);
        setAvailableChr(available_chr);
    }

    //We assume the route_list is pre-sorted from the API
    const getAvailableRouteAndChr = (fetched_route_list: Route[]): string[] => {
        const unique_route_list: string[] = [];
        fetched_route_list.forEach((route, index) => {
            if (index === 0) {
                unique_route_list.push(route.route);
            } else {
                if (route.route !== unique_route_list[unique_route_list.length - 1]) {
                    unique_route_list.push(route.route);
                }
            }
        })
        return unique_route_list;
    }

    const getRouteList = async () => {
        const route_list_url: string = BaseUrl + "v1/transport/kmb/route/";
        fetch(route_list_url, { method: "get" })
            .then((response) => {
                if (!response.ok) {
                    console.log("Failed to fetch");
                }
                return response.json();
            })
            .then((data: any) => {
                const route_list: Route[] = data.data;
                const unique_route_list: string[] = getAvailableRouteAndChr(route_list);
                setRouteList(route_list);
            })
            .catch((e) => {
                console.log(e);
                setRouteList([]);
                setAvailableRoute([]);
                setAvailableChr([]);
            })
    }

    const getStopList = async (route: Route) => {
        setGettingStopList(true);
        setSelectedRoute(route);
        const route_name: string = route.route;
        const route_direction: string = route.bound === "I" ? "inbound" : "outbound";
        const route_service_type: string = route.service_type;
        const stop_list_url: string = `${BaseUrl}v1/transport/kmb/route-stop/${route_name}/${route_direction}/${route_service_type}`;
        fetch(stop_list_url, { method: "get" })
            .then((response) => {
                if (!response.ok) {
                    console.log("Failed to fetch");
                }
                return response.json();
            })
            .then((data: any) => {
                const rout_stop_list: RouteStop[] = data.data;
                const stop_list: Stop[] = [];
                let promises: Promise<Response>[] = [];
                rout_stop_list.forEach((stop: RouteStop) => {
                    const id = stop.stop;
                    const stop_url: string = `${BaseUrl}v1/transport/kmb/stop/${id}`;
                    promises.push(fetch(stop_url, { method: "get" }));
                });
                Promise.all(promises)
                    .then((responses) => {
                        responses.forEach((response) => {
                            if (!response.ok) {
                                console.error("Failed to fetch");
                            } else {
                                response.json().then((data: any) => {
                                    const stop_info: Stop = data.data;
                                    stop_list.push(stop_info);
                                    setStopList(stop_list);
                                });
                            }
                        })
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        getRouteList();
    }, []);

    useEffect(() => {
        updateAvailableRouteAndChr(inputRoute);
    }, [routeList, inputRoute])

    useEffect(() => {
        if (stopList.length === 0) {
            setGettingStopList(false);
        }
    }, [stopList]);

    return <div className={`stop-searcher-container search-fade-in ${search ? 'visible' : ''}`}>
        {
            stopList.length > 0 ? <>{selectedRoute && <StopDisplay stopList={stopList} setStopList={setStopList} selectedRoute={selectedRoute} />}</> :
                <>
                    <div className="stop-searcher-section-1">
                        <div className="stop-searcher-s1-container">
                            <button className="stop-searcher-exit-btn" onClick={() => setSearch(false)}>Return</button>
                            <div className="stop-searcher-search-number">{inputRoute}</div>
                        </div>
                    </div>
                    <div className="stop-searcher-section-2">
                        <div className="stop-searcher-s2-container">
                            {availableRoute.length > 0 && availableRoute.map((route, index) => {
                                return <button className="stop-searcher-route-btn" key={index} onClick={() => { getStopList(route) }} disabled={gettingStopList}>{route.route} {route.dest_tc}</button>
                            })}
                        </div>
                    </div>
                    <div className="stop-searcher-section-3">
                        <InputPad availableChr={availableChr} updateInput={setInputRoute} />
                    </div>
                </>
        }</div>;
}

export default StopSearcher;