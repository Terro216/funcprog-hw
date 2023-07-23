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

const isNotWhite = R.none(isWhite)
const isNotRed = R.none(isRed)

const isFigureColor = R.curry((colorFunc, figure) => R.propSatisfies(colorFunc, figure))
const isGreenFigure = isFigureColor(isGreen)
const isRedFigure = isFigureColor(isRed)
const isBlueFigure = isFigureColor(isBlue)
const isOrangeFigure = isFigureColor(isOrange)
const isWhiteFigure = isFigureColor(isWhite)
const isStarRed = isRedFigure('star')
const isSquareGreen = isGreenFigure('square')
const isSquareOrange = isOrangeFigure('square')
const isTriangleWhite = isWhiteFigure('triangle')
const isTriangleGreen = isGreenFigure('triangle')
const isCircleWhite = isWhiteFigure('circle')
const isCircleBlue = isBlueFigure('circle')

const colorFiguresCount = (colorFunction) => R.compose(R.length, R.filter(colorFunction), R.values)
const redFiguresCount = colorFiguresCount(isRed)
const greenFiguresCount = colorFiguresCount(isGreen)
const blueFiguresCount = colorFiguresCount(isBlue)
const orangeFiguresCount = colorFiguresCount(isOrange)
// const whiteFiguresCount = colorFiguresCount(isWhite)

const allFiguresIsColor = (colorFunction) => R.compose(R.all(colorFunction), R.values)

const hasXColor = R.curry((moreThanX, colorCounterFunc) =>
  R.compose(R.gte(R.__, moreThanX), colorCounterFunc)
)
const hasThreeColor = hasXColor(3)
const hasTwoColor = hasXColor(2)
const hasOneColor = hasXColor(1)
const hasThreeGreen = hasThreeColor(greenFiguresCount)
const hasThreeBlue = hasThreeColor(blueFiguresCount)
const hasThreeOrange = hasThreeColor(orangeFiguresCount)
const hasThreeRed = hasThreeColor(redFiguresCount)
const hasTwoGreen = hasTwoColor(greenFiguresCount)
const hasOneRed = hasOneColor(redFiguresCount)

const hasExactlyTwoGreen = R.compose(R.equals(2), greenFiguresCount)

// const createList = R.unapply(R.identity)

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([isStarRed, isSquareGreen, isTriangleWhite, isCircleWhite])

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = hasTwoGreen

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => R.equals(redFiguresCount(figures), blueFiguresCount(figures))

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = R.allPass([isCircleBlue, isStarRed, isSquareOrange])

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.anyPass([hasThreeGreen, hasThreeBlue, hasThreeOrange, hasThreeRed])

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([isTriangleGreen, hasExactlyTwoGreen, hasOneRed])

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allFiguresIsColor(isOrange)

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => R.both(isNotRed, isNotWhite)([star])

// 9. Все фигуры зеленые.
export const validateFieldN9 = allFiguresIsColor(isGreen)

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) => R.allPass([R.equals, isNotWhite])(triangle, square)
