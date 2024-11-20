import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
export function SEO({ title = 'Карта Меток', description = 'Интерактивная карта с метками интересных мест', keywords = 'карта, метки, места, достопримечательности', image = '/og-image.jpg', url = window.location.href, }) {
    const siteTitle = title === 'Карта Меток' ? title : `${title} | Карта Меток`;
    return (_jsxs(Helmet, { children: [_jsx("title", { children: siteTitle }), _jsx("meta", { name: "description", content: description }), _jsx("meta", { name: "keywords", content: keywords }), _jsx("meta", { property: "og:title", content: siteTitle }), _jsx("meta", { property: "og:description", content: description }), _jsx("meta", { property: "og:image", content: image }), _jsx("meta", { property: "og:url", content: url }), _jsx("meta", { property: "og:type", content: "website" }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), _jsx("meta", { name: "twitter:title", content: siteTitle }), _jsx("meta", { name: "twitter:description", content: description }), _jsx("meta", { name: "twitter:image", content: image })] }));
}
