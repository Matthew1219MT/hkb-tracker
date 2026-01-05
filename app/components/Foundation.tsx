'use client'
import './Foundation.css';
import HomePage from './HomePage';
import { StopProvider } from './context/stopContext';

//Foundation component to wrap HomePage with necessary providers
const Foundation = () => {
    return <StopProvider>
        <HomePage/>
    </StopProvider>
}

export default Foundation;