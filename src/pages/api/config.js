import request from 'request-promise';
import React from 'react';


export const postApi = async function (url, data) {
    const options = {
        method: 'POST',
        uri: url,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify(data)
        })
    }

    const dataResult = [];
    await request(options)
        .then(function (parsedBody) {
            const parsedBodyArr = JSON.parse(parsedBody)
            dataResult.push(parsedBodyArr.result)
        })
    if (dataResult.length > 0) {
        return dataResult[0]
    } else {
        return dataResult
    }
};


// const base64encodedData = Buffer.from(user + ':' + password).toString('base64');

export const postApiNew = async function (method, url, data) {
    let token = data.token ? data.token : ''
    if (data.token) {
        delete data.token
    }
    const options = {
        method: method,
        uri: url,
        headers: {
            'Accept-language': 'en',
            'token': token ? token : '',
            'Access-Control-Allow-Origin': 'http://localhost:3000/umusic',
            'Access-Control-Allow-Credentials': 'true',
            'Client-Type': 'Android',
            'Revision': 1234,
            // 'Sec-Fetch-Mode:': 'no-cors',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        qs: JSON.stringify(data)

        // body: JSON.stringify(data)
    }


    console.log(data)
    let dataResult = {
        data: null,
        message: 'Lỗi server'
    };
    console.log('00000000000000000000000');

    await request(options)
        .then(function (parsedBody) {

            console.log('1111111111111111111111111');
            dataResult = JSON.parse(parsedBody)

        }).catch(function (err) {
            console.log('2222222222222222222222222',err);

            dataResult = JSON.parse(err.error)
            if (dataResult.code === 401) {
                sessionStorage.setItem('users', '')
                // window.location.href = "/";
            }
        });
    return dataResult
};

// const Domain = "http://103.143.206.63:8089/umusic-service/"
export const Domain = "http://localhost:8089/"

export function urlList() {
    return {
        "URL_AUTHEN": {
            "LOGIN_PHONE": Domain + "v1/authen/login/request-otp",
            "CHECK_OTP": Domain + " v1/authen/login/otp",
            "LOGIN_EMAIL": Domain + "v1/authen/login/email",
            "REGISTER": Domain + "",
            "FORGOTPASS": Domain + ""
        },

        "URL_DISCOVERY": {
            "ALL_SERVICE": Domain + "/public-api/v1/employees/services/all",
            "SERVICE_SEARCH": Domain + "/public-api/v1/employees/services/search",
            "PAUSE": Domain + "/public-api/v1/employees/services/pause",
            "UID_SCAN_HISTORY": Domain + "/public-api/v1/employees/uid-scan-history/all",
            "RESUM": Domain + "/public-api/v1/employees/services/resume-by-code",
            "REPORT": Domain + "/public-api/v1/employees/services/report-by-code",
            "PAUSE_SERVICE_WARRANTY": Domain + "/public-api/v1/employees/services/pause-service-warranty"
        }
    }
}

export function convertToTime(myDate) {
    return new Date(myDate).getTime();
}

export function convertDate(str) {
    str = str.toString();
    let parts = str.split(" ");
    let months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };
    return parts[3] + "-" + months[parts[1]] + "-" + parts[2];
};

export function convertTodate(timeStamp) {
    if (timeStamp > 0) {
        timeStamp = parseInt(timeStamp) + 7 * 60 * 60 * 1000
        return new Date(timeStamp).toISOString().slice(0, 19).replace('T', ' ')
    } else {
        return ''
    }

};

