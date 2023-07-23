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

// внешние вспомогательные функции
const getResultField = R.prop('result')
const tapLog = (logFunc) => R.tap(logFunc)

// Проверки
const isLongerThan2 = R.compose(R.gt(R.__, 2), R.length)
const isShorterThan10 = R.compose(R.lt(R.__, 10), R.length)
const isNumber = R.compose(R.not, Number.isNaN, parseFloat)
const isPositive = R.compose(R.gt(R.__, 0), parseFloat)
const isPositiveNumber = R.allPass([isPositive, isNumber]) // or gte?
const isContainNumbersAndDots = R.test(/[0-9]+\.?[0-9]+/)

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // внутренние вспомогательные функции
  const tapWriteLog = tapLog(writeLog)
  const handleValidationError = () => handleError('ValidationError')
  const parseAndRound = R.compose(tapWriteLog, Math.round, parseFloat) //step 3

  // Функции для работы с апи
  const convertNumberFromTo = (from, to, number) =>
    api.get('https://api.tech/numbers/base', { from, to, number })
  const convertNumberFrom10To2 = (number) => convertNumberFromTo(10, 2, number)
  const getAnimalById = (id) => api.get(`https://animals.tech/${id}`, {})

  const handleRandomAnimal = R.compose(handleSuccess, getResultField)

  const getRandomAnimal = R.compose(
    //step 8
    R.otherwise(handleError),
    R.andThen(handleRandomAnimal),
    getAnimalById
  )

  const getId = R.compose(
    tapWriteLog,
    R.modulo(R.__, 3), //step 7
    tapWriteLog,
    R.curry(Math.pow)(R.__, 2), //step 6
    tapWriteLog,
    R.length //step 5
  )

  const getIdAndRandomAnimal = R.compose(getRandomAnimal, getId)

  const handleConvertedNumber = R.compose(
    R.unless(R.equals('rejected'), getIdAndRandomAnimal),
    tapWriteLog,
    getResultField
  )

  const convertNumber = R.compose(
    //step 4
    R.otherwise(handleError),
    R.andThen(handleConvertedNumber),
    convertNumberFrom10To2
  )

  const parseAndConvertNumber = R.compose(convertNumber, parseAndRound)

  const entrypoint = R.compose(
    R.ifElse(
      R.allPass([isLongerThan2, isShorterThan10, isPositiveNumber, isContainNumbersAndDots]), //step 2
      parseAndConvertNumber,
      handleValidationError
    ),
    tapWriteLog //step 1
  )

  entrypoint(value)
}

export default processSequence
