export const protocol  = (process.env.NODE_ENV === 'production') ? 'https://' : 'http://';
export const endPoint  = (process.env.NODE_ENV === 'production') ? 'kibo.ma' : 'http://localhost:3000';

export const WP         = `${protocol + endPoint}/wp-json/wp/v2`;
export const WC         = `${protocol + endPoint}/wp-json/wc/v2`;
export const AUTH       = `${protocol + endPoint}/wp-json/jwt-auth/v1`;
export const WC_VENDOR  = `${protocol + endPoint}/wp-json/wc-vendor/v1`;