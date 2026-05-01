const agentToDevice = (agent: string) => {
    const ua = String(agent || '').toLowerCase();

    if (/bot|crawler|spider|robot|crawling|googlebot|bingbot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|slurp/.test(ua)) {
        return 'bot';
    }

    // Tablets (explicit tablet tokens or Android without "mobile")
    if (/tablet|ipad|playbook|silk|kindle|nexus 7|nexus 9|xoom|sch-i800/.test(ua) || /android(?!.*mobile)/.test(ua)) {
        return 'tablet';
    }

    // Mobile devices
    if (/mobi|mobile|iphone|ipod|blackberry|bb10|opera mini|iemobile|windows phone|android.*mobile/.test(ua)) {
        return 'mobile';
    }

    // Fallback to desktop
    return 'desktop';
}

export default agentToDevice;