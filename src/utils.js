/**
 * Генерация случайного числа в диапазоне от min до max (включительно)
 * @param {number} min - нижнее значение диапазона
 * @param {number} max - максимальное значение
 * @return {number} - рандомное число
 */
export const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  return array[getRandomNumber(0, array.length - 1)];
};

export const splitOnSentences = (string) => {
  const sentences = string.match(/[^\.!\?]+[\.!\?]+/g);
  return sentences.map((item) => (item.trim()));
};

export const runtimeFormat = (time) => {
  let hours = Math.floor(time / 60);
  let minutes = time % 60;

  return `${hours}h ${minutes}m`;
};