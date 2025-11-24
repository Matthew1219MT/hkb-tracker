'use client'
import './Foundation.css';
import HomePage from './HomePage';
import { StopProvider } from './context/stopContext';

const Foundation = () => {
    return <StopProvider>
        <HomePage/>
    </StopProvider>
}

export default Foundation;