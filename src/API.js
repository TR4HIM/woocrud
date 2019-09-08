export const protocol  = (process.env.NODE_ENV === 'production') ? 'https://' : 'http://';
export const endPoint  = (process.env.NODE_ENV === 'production') ? 'kibo.ma' : 'woocrud.test';


// Wordpress API
export const WP         = `${protocol + endPoint}/wp-json/wp/v2`;
// WooCommerce API
export const WC         = `${protocol + endPoint}/wp-json/wc/v3`;

export const AUTH       = `${protocol + endPoint}/wp-json/jwt-auth/v1`;
export const WC_VENDOR  = `${protocol + endPoint}/wp-json/wc-vendor/v1`;




