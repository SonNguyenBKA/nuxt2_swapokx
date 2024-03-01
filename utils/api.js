const axios = require('axios')
const cryptoJS = require('crypto-js')
export function handlesApi(resolve, reject, serviceFn, context, mutationEvent) {
  serviceFn.then(resp => {
    if (resp.data.status_code === 200 && mutationEvent) {
      context.commit(mutationEvent, resp.data.data)
    }
    resolve(resp.data)
  }).catch((err) => {
    resolve({
      'status_code': 500,
      'messages': err.message,
      'data': []
    })
  })
    .finally(() => {
      console.log('Called Api');
    });
}

export function axiosBase() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const instance = axios.create({
    baseURL: process.env.API_BASE || 'https://restcountries.com/v3.1',
    headers: headers,
    withCredentials: true
  })
  return instance
}

export function axiosOkx() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  const instance = axios.create({
    baseURL: 'https://www.okx.com/priapi/v1',
    headers: headers,
    withCredentials: true
  })
  return instance
}

export function axiosOkxV5GetInstance(url, params = null) {
  const apiBaseUrl = process.env.API_BASE_URL_OKX
  const accessProject = process.env.ACCESS_PROJECT_OKX
  const apiKey = process.env.API_KEY_OKX
  const secretKey = process.env.SECRET_KEY_OKX
  const passphrase = process.env.PASSPHRASE

  const timestamp = (new Date()).toISOString()
  const accessSign = params ? cryptoJS.enc.Base64.stringify(
      cryptoJS.HmacSHA256(timestamp + 'GET' + `${url}?${new URLSearchParams(params).toString()}`, secretKey))
    : cryptoJS.enc.Base64.stringify(
      cryptoJS.HmacSHA256(timestamp + 'GET' + `${url}`, secretKey))
  const headersParams = {
    'Content-Type': 'application/json',
    'OK-ACCESS-PROJECT': accessProject,
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': accessSign,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': passphrase
  }
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: headersParams
  })
  return instance
}
export async function getAxiosOkxV5(url, params = null) {
  console.log(params)
  if (params) {
    return await axiosOkxV5GetInstance(url, { ...params }).get(url, { params: { ...params }})
  } else {
    return await axiosOkxV5GetInstance(url, params).get(url)
  }
}

export function axiosOkxV5PostInstance(url, bodyStr) {
  const apiBaseUrl = process.env.API_BASE_URL_OKX
  const accessProject = process.env.ACCESS_PROJECT_OKX
  const apiKey = process.env.API_KEY_OKX
  const secretKey = process.env.SECRET_KEY_OKX
  const passphrase = process.env.PASSPHRASE

  const timestamp = (new Date()).toISOString()
  const accessSign = cryptoJS.enc.Base64.stringify(
    cryptoJS.HmacSHA256(timestamp + 'POST' + `${url}` + JSON.stringify(bodyStr), secretKey))
  const headersParams = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': true,
    'OK-ACCESS-PROJECT': accessProject,
    'OK-ACCESS-KEY': apiKey,
    'OK-ACCESS-SIGN': accessSign,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'OK-ACCESS-PASSPHRASE': passphrase
  }
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: headersParams,
    withCredentials: true
  })
  instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
  return instance
}
export async function postAxiosOkxV5(url, body) {
  return await axiosOkxV5PostInstance(url, body).post(url, body)
}
