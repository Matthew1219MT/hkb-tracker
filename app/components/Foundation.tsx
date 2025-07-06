'use client'
import { useEffect, useState } from 'react';
import './Foundation.css';
import InputPad from './InputPad';
import { Route } from './types';

const Foundation: React.FC = () => {

    const BaseUrl: string = "https://data.etabus.gov.hk/";

    const [inputRoute, setInputRoute] = useState<string>("");

    const [routeList, setRouteList] = useState<string[]>([]);

    const [availableRoute, setAvailableRoute] = useState<string[]>([]);

    const [availableChr, setAvailableChr] = useState<string[]>([]);

    const updateAvailableRouteAndChr = (input_route: string) => {
        console.log(`Input Route ${input_route}`);
        const available_route: string[] = [];
        const available_chr: string[] = [];
        const input_route_length: number = input_route.length;
        routeList.forEach((route, index) => {
            if (input_route_length <= route.length) {
                //console.log(route, input_route_length-1);
                const sub_string: string = route.substring(0, input_route_length);
                //console.log(sub_string, input_route)
                if (sub_string === input_route) {
                    available_route.push(route);
                }
            }
        })
        available_route.forEach((route, index) => {
            if (route.length > input_route_length) {
                if (!(available_chr.includes(route[input_route_length]))) {
                    available_chr.push(route[input_route_length]);
                }
            }
        })
        console.log(available_route, available_chr);
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
                if (route.route !== unique_route_list[unique_route_list.length-1]) {
                    unique_route_list.push(route.route);
                }
            }
        })
        return unique_route_list;
    }

    const getRouteList = async () =>{
        const route_list_url: string = BaseUrl + "v1/transport/kmb/route/";
        fetch(route_list_url, {method: "get"})
        .then((response) => {
            if (!response.ok) {
                console.log("Failed to fetch");
            }
            return response.json();
        })
        .then((data: any)=>{
            const route_list: Route[] = data.data;
            console.log(route_list);
            const unique_route_list: string[] = getAvailableRouteAndChr(route_list);
            console.log(unique_route_list);
            setRouteList(unique_route_list);
        })
        .catch((e) => {
            console.log(e);
            setRouteList([]);
            setAvailableRoute([]);
            setAvailableChr([]);
        })
    }

    useEffect(() =>{
        getRouteList();
    }, []);

    useEffect(() => {
        updateAvailableRouteAndChr(inputRoute);
    }, [routeList, inputRoute])

    return <div className="foundation-containter ">
        <div className="foundation-section-1">
            {inputRoute}
        </div>
        <div className="foundation-section-2">
            Section 2
        </div>
        <InputPad availableChr={availableChr} updateInput={setInputRoute}/>
    </div>
}

export default Foundation;