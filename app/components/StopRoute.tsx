'use client'

import { useTranslation } from "react-i18next";
import { Route } from "./types";
import './StopRoute.css';

type props = {
    route: Route
}

const StopRoute = ({ route }: props) => {

    const { t, i18n } = useTranslation();

    return <div className="stop-route-container">
        {route.service_type === '2' ? 
            <div className="stop-route-route-special">
                {route.route} 
                <br></br>
                <div style={{fontSize: 'small'}}>{t('special')}</div>
            </div> 
        : 
            <div className="stop-route-route">{route.route}</div>
        }
        
        <div className="stop-route-detail">
            {t('to')} {i18n.language === 'tc' ? route.dest_tc : route.dest_en}
            <br></br>
            {i18n.language === 'tc' ? route.orig_tc : route.orig_en} 
        </div>
    </div>   
}

export default StopRoute;