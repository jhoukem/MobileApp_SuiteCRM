
/**
 * The default UI theme for the all application. It is used by most application components.
 **/
export const uiTheme = {
    palette: {
        primaryColor: '#1F94B7', //'#1F94B7',
        accentColor: '#07589A',
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
};

/**
 * This is the key for the navigation screens.
 **/
export const loginScreen = "ProspectLoginScreen";
export const listScreen = "ProspectlistScreen";
export const editScreen = "ProspectEditScreen";

/**
 * These keys must match the returned key from SuiteCRM REST API.
 **/
export const id_key = "id";
export const last_name_key = "last_name";
export const first_name_key = "first_name";
export const title_key = "title";
export const department_key = "department";
export const account_name_key = "account_name";
export const work_phone_number_key = "phone_work";
export const mobile_phone_number_key = "phone_mobile";
export const website_key = "website";
export const email_key = "email1";
export const country_key = "primary_address_country";
export const street_key = "primary_address_street";
export const city_key = "primary_address_city";
export const postalcode_key = "primary_address_postalcode";
export const description_key = "description";
export const deleted_key = "deleted";

/**
 * The palette of colors for the ProspectListScreen avatars.
 **/
export var avatarColors = ["#e8d725", "#38579e", "#f9b6bf", "#ef64d8", "#c10f6e",
"#e57074", "#f9d1c0", "#2c55a3", "#611296", "#f22bcd", "#4a97ad", "#85f702",
"#f7a5a7", "#e4f7a0", "#81ef93", "#1cddb7", "#ea6267", "#91b7ff", "#91d613",
"#eac715", "#fcd292", "#a40bc6", "#ed38e4", "#605df7", "#c6008b", "#e0477d",
"#27dd95", "#d64f02", "#fc7bcf", "#f79283"];