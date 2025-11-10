import React, { useState, useEffect } from 'react';

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const hh = String(time.getHours()).padStart(2, '0');
    const mm = String(time.getMinutes()).padStart(2, '0');
    const ss = String(time.getSeconds()).padStart(2, '0');

    return <div 
    style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
        {hh}:{mm}:{ss}
        </div>;
}
