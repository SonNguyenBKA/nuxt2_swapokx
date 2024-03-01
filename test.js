
function timeout(miliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Success!')
    }, miliseconds)
  })
}
timeout(2000).then(resp => {
  console.log(resp)
})

Promise.timeout = function (milliseconds) {
  return new Promise(function (resolve, reject) {
    console.log('Đã kích hoạt hay chưa ?')
    setTimeout(() => {
      resolve('Success!')
    }, milliseconds)
  })
}
const promiseObject = Promise.timeout(2000) // Eager
promiseObject.then(res => console.log(res))

// Đối với Observable (A user - defined Object )
function Observable() {

}
Observable.timeout = function (milliseconds) {
  function timeoutWaitToRun() {
    setTimeout(() => {

    }, milliseconds)
  }
  return new Observable(timeoutWaitToRun)
}
const obsTimeout$ = Observable.timeout(2000)
console.log('obsTimeout$', obsTimeout$)
