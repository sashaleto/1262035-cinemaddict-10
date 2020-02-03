import moment from 'moment';

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
  const sentences = string.match(/[^.!?]+[.!?]+/g);
  return sentences.map((item) => (item.trim()));
};

export const runtimeFormat = (time) => {
  const duration = moment.duration(time, `minutes`);
  return moment.utc(duration.asMilliseconds()).format(`h[h] m[m]`);
};

export const releaseDateFormat = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const commentDateFormat = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  return `${year}/${month}/${day} ${minutes}:${seconds}`;
};

export const getWatchedFilmsCount = (films) => {
  return films.filter((film) => {
    return !!film.userDetails.watchingDate;
  }).length;
};

export const makeRandomDate = () => {
  const targetDate = new Date();

  targetDate.setDate(targetDate.getDate() - getRandomNumber(0, 365));

  return targetDate;
};

/**
 * Сортировка массива фильмов по убыванию
 * @param {array} films - массив фильмов
 * @param {string} property - свойство, по которому проводится сортировка
 * @return {array} - новый отсоритрованный массив
 */
export const sortFilmsBy = (films, property) => {
  return [...films].sort((a, b) => {
    if (a[property] < b[property]) {
      return 1;
    }
    if (a[property] > b[property]) {
      return -1;
    }
    return 0;
  });
};
