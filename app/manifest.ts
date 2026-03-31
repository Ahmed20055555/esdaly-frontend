import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Esdaly',
        short_name: 'Esdaly',
        description: 'Esdaly Store',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0B3D2E',
        icons: [
            {
                src: '/foto/navbar-fotoo.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/foto/navbar-fotoo.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
