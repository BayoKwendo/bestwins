export const baseURL = "https://besnaapi.goldmanlogistics.com/";

// export const baseURL = "http://41.191.224.106:3457/";

// export const baseURL_2 = "http://
// ';'


export const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
}

//isLogged In

// localStorage.setItem("name", response.data.message.name)
// localStorage.setItem("user_role", response.data.message.role_id)
// localStorage.setItem("token", response.data.token)
// localStorage.setItem("role_name", response.data.message.role_name)

export const isLoggedIn = localStorage.getItem('isLoggedIn') ? true : false;

export const TOKEN = localStorage.getItem('token');

export const ROLE = localStorage.getItem('user_role');

export const HOURS_FROM = localStorage.getItem('hours_from');

export const HOURS_TO = localStorage.getItem('hours_to');

export const MSISDN = localStorage.getItem('user_msisdn');

export const NAME = localStorage.getItem('name');

export const AGENTEKEYWORD = localStorage.getItem('name');

export const ROLE_NAME = localStorage.getItem('role_name');


export const CHANNEL = localStorage.getItem('channel');

// header configurations
export const CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token')
    },
};

//currency
export const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: "ABS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount).replaceAll('ABS', "");
};





export const STATE = localStorage.getItem('state');
export const FILE_NAME = localStorage.getItem('file_number_staff');


export const BRANCH_NAME = localStorage.getItem('branch_name');

export const MODULE_NAME = localStorage.getItem('module_name');

export const USER_ID = localStorage.getItem('user_id');