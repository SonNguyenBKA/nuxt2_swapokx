export function formatMoneySwapOkx(money, maxLength = 12) {
  if(!money) {
    return null
  }
  money = money.toString()
  if (money.trim() === '') {
    return null
  }
  if (!money.includes('.')) {
    return Number(money).toLocaleString()
  } else {
    const number1 = Number(money.split('.')[0]).toLocaleString()
    const number2 = money.split('.')[1].slice(0, 12)
    return number1 + '.' + number2
  }
}

export function unFormatMoneySwapOkx(money) {
  if(!money) {
    return null
  }
  money = money.toString()
  if (!money.includes('.')) {
    return money.replaceAll(',', '')
  } else {
    const number1 = money.split('.')[0].replaceAll(',', '')
    const number2 = money.split('.')[1]
    return Number(number1 + '.' + number2)
  }
}

export function formatPrice(number, digit = 4) {
  return number ? new Intl.NumberFormat('en-US', { maximumFractionDigits: digit }).format(number) : number
}
