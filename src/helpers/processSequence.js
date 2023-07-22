/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api'
import * as R from 'ramda'

const api = new Api()

const processSequence = async ({ value, writeLog, handleSuccess, handleError }) => {
  writeLog(value)

  const isLongerThan2 = R.compose(R.gt(R.__, 2), R.length)
  const isShorterThan10 = R.compose(R.lt(R.__, 10), R.length)
  const isPositive = R.compose(R.gt(R.__, 0), parseInt) // or gte?
  const isContainNumbersAndDots = R.test(/[0-9]+\.?[0-9]+/)

  const validValue = R.allPass([isLongerThan2, isShorterThan10, isPositive, isContainNumbersAndDots])(value)

  if (!validValue) {
    handleError('ValidationError')
    return
  }

  const number = R.compose(Math.round, parseFloat)(value)
  writeLog(number)

  const translate = await api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: value })
  const translateRes = translate.result
  writeLog(translateRes)
  if (translateRes === 'rejected') {
    //handleError ?
    return
  }
  const getId = R.compose(
    R.tap(writeLog),
    R.modulo(R.__, 3),
    R.tap(writeLog),
    R.curry(Math.pow)(R.__, 2),
    R.tap(writeLog),
    R.length
  )
  const id = getId(translateRes)
  const animal = await api.get(`https://animals.tech/${id}`)
  const animalRes = animal.result

  if (animalRes === 'rejected') {
    //handleError ?
    return
  }
  console.log(animal)
  handleSuccess(animalRes)
}

export default processSequence
