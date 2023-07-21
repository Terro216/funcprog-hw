/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from 'ramda'
const isColor = (color) => (value) => value === color
const isGreen = isColor('green')
const isRed = isColor('red')
const isBlue = isColor('blue')
const isOrange = isColor('orange')
const isWhite = isColor('white')

const colorFiguresCount = (colorFunction) => R.compose(R.length, R.filter(colorFunction), R.values)
const redFiguresCount = colorFiguresCount(isRed)
const greenFiguresCount = colorFiguresCount(isGreen)
const blueFiguresCount = colorFiguresCount(isBlue)
// const whiteFiguresCount = colorFiguresCount(isWhite)
const orangeFiguresCount = colorFiguresCount(isOrange)

const allFiguresIsColor = (colorFunction) => R.compose(R.all(colorFunction), R.values)
const hasThreeColor = (colorCounter) => R.compose(R.gte(R.__, 3), colorCounter)

const createList = R.unapply(R.identity)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => {
  const isStarRed = R.propSatisfies(isRed, 'star')
  const isSquareGreen = R.propSatisfies(isGreen, 'square')
  const isOtherWhite = R.allPass([R.propSatisfies(isWhite, 'triangle'), R.propSatisfies(isWhite, 'circle')])

  return R.allPass([isStarRed, isSquareGreen, isOtherWhite])(figures)
}

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
  return R.gte(greenFiguresCount(figures), 2)
}

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => {
  return R.equals(redFiguresCount(figures), blueFiguresCount(figures))
}

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = (figures) => {
  const isCircleBlue = R.propSatisfies(isBlue, 'circle')
  const isStarRed = R.propSatisfies(isRed, 'star')
  const isSquareOrange = R.propSatisfies(isOrange, 'square')

  return R.allPass([isCircleBlue, isStarRed, isSquareOrange])(figures)
}

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (figures) => {
  const hasThreeGreen = hasThreeColor(greenFiguresCount)
  const hasThreeBlue = hasThreeColor(blueFiguresCount)
  const hasThreeOrange = hasThreeColor(orangeFiguresCount)
  const hasThreeRed = hasThreeColor(redFiguresCount)

  return R.anyPass([hasThreeGreen, hasThreeBlue, hasThreeOrange, hasThreeRed])(figures)
}

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (figures) => {
  const isTriangleGreen = R.propSatisfies(isGreen, 'triangle')
  const hasTwoGreen = R.compose(R.equals(2), greenFiguresCount)
  const hasOneRed = R.compose(R.equals(1), redFiguresCount)

  return R.allPass([isTriangleGreen, hasTwoGreen, hasOneRed])(figures)
}

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => {
  const allFiguresIsOrange = allFiguresIsColor(isOrange)

  return allFiguresIsOrange(figures)
}

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => {
  const isNotRed = R.none(isRed)
  const isNotWhite = R.none(isWhite)

  return R.both(isNotRed, isNotWhite)([star])
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => {
  const allFiguresIsGreen = allFiguresIsColor(isGreen)

  return allFiguresIsGreen(figures)
}

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) => {
  const isNotWhite = R.compose(R.none(isWhite), createList)

  return R.allPass([R.equals, isNotWhite])(triangle, square)
}
