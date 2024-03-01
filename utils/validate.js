import _ from "lodash";

export function checkTruthyAbs(val, abs = true) {
  // abs = true // check case '0', '-0' return false
  // abs = false // check case '0', '-0' return true
  if (abs && typeof val === 'string' && typeof Number(val) === 'number' && !isNaN(Number(val))) {
    val = Number(val)
  }
  if (typeof val !== 'object') {
    return !!val
  } else {
    return !_.isEmpty(val)
  }
}
