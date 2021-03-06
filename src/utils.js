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
  return moment(date).format(`YYYY/MM/DD HH:MM`);
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

export const shakeAnimation = (target, duration) => {
  target.style.animation = `shake ${duration / 1000}s`;

  setTimeout(() => {
    target.style.animation = ``;
  }, duration);
};

export const ratingMapper = (rating) => {
  switch (true) {
    case (rating >= 1 && rating <= 10):
      return `Novice`;
    case (rating >= 11 && rating <= 20):
      return `Fan`;
    case (rating >= 21):
      return `Movie buff`;
    default:
      return ``;
  }
};
