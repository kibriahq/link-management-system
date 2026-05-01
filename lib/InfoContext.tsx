'use client';

import { createContext, ReactNode, useContext, useState } from "react";

type InfoContextType = {
    domain: string;
    protocol: string;
    path: string;
    baseUrl: string;
}

const initialState = {
    domain: '',
    protocol: '',
    path: 'r',
    baseUrl: '',
}

const InfoContext = createContext<InfoContextType | null>(initialState);

export default function InfoProvider({ children }: { children: ReactNode }) {
    const [domain] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.location.hostname || 'link.engine.io';
        }
        return 'link.engine.io';
    });
    const [protocol] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.location.protocol || 'https:';
        }
        return 'https:';
    });
    const path = 'r';

    return (
        <InfoContext.Provider value={{ baseUrl: `${protocol}//${domain}/${path}/`, domain, protocol, path }}>
            {children}
        </InfoContext.Provider>
    )
}

export const useInfo = () => {
    const context = useContext(InfoContext);
    if (context === null) {
        throw new Error("useInfo must be used within an InfoProvider");
    }
    return context;
}