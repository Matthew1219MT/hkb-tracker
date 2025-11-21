export type Route = {
    bound: string,
    dest_en: string,
    dest_sc: string,
    dest_tc: string,
    orig_en: string,
    orig_sc: string,
    orig_tc: string,
    route: string,
    service_type: string
}

export type RouteStop = {
    co: string,
    route: string,
    bound: string,
    service_type: string,
    seq: number,
    stop: string,
    data_timestamp: string
}

export type Stop = {
    stop: string,
    name_tc: string,
    name_en: string,
    name_sc: string,
    lat: string,
    long: string,
    data_timestamp: string
}

export type StopETA = {
    co: string,
    route: string,
    dir: string,
    service_type: string,
    seq: number,
    stop: string,
    dest_en: string,
    dest_tc: string,
    dest_sc: string,
    eta_seq: number,
    eta: string,
    rmk_en: string,
    rmk_tc: string,
    rmk_sc: string,
    data_timestamp: string
}