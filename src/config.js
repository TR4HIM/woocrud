import { protocol, endPoint } from "./API/";

export const USE_REDUX_CONSOLE = false;

export const APP_ROUTES = {
    HOME                : '/',
    LOGIN               : '/connexion',
    ADD_PRODUCTS        : '/ajouter-des-produits',
    MY_PRODUCTS         : '/mes-produits',
    PARAMETERS          : '/parametres',
    CODE_VALIDATION     : '/validation-code-promo',
    REQUESTED_PRODUCT   : '/demande-ajout-produit',
    EDIT_PRODUCT        : "/edit-produit/:productId"
}

export const APP_PATHS = {
    HOME                : `${process.env.PUBLIC_URL}${APP_ROUTES.HOME}`,
    LOGIN               : `${process.env.PUBLIC_URL}${APP_ROUTES.LOGIN}`,
    ADD_PRODUCTS        : `${process.env.PUBLIC_URL}${APP_ROUTES.ADD_PRODUCTS}`,
    MY_PRODUCTS         : `${process.env.PUBLIC_URL}${APP_ROUTES.MY_PRODUCTS}`,
    PARAMETERS          : `${process.env.PUBLIC_URL}${APP_ROUTES.PARAMETERS}`,
    CODE_VALIDATION     : `${process.env.PUBLIC_URL}${APP_ROUTES.CODE_VALIDATION}`,
    REQUESTED_PRODUCT   : `${process.env.PUBLIC_URL}${APP_ROUTES.REQUESTED_PRODUCT}`,
    EDIT_PRODUCT        : `${process.env.PUBLIC_URL}${APP_ROUTES.EDIT_PRODUCT}`
}



export const SHOP_PAGE_LINK = `${protocol + endPoint}/boutiques`;

export const REGISTER_NEW_VENDOR_URL = `${protocol + endPoint}/?inscription=popup`;