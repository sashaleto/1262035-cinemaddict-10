import {getRandomNumber, getRandomArrayItem, splitOnSentences, runtimeFormat, makeRandomDate} from "../utils";
import {DOOMY_TEXT, NAMES, COUNTRIES} from '../constants';

const FILMS_TITLES = [`The Shawshank Redemption`, `The Green Mile`, `Forrest Gump`, `Schindler's List`, `Intouchables`, `Inception`, `Léon`, `The Lion King`, `Fight Club`, `La vita è bella`, `Knockin' on Heaven's Door`, `The Godfather`, `Pulp Fiction`, `The Prestige`, `A Beautiful Mind `];
const POSTERS_PATH = `./images/posters/`;
const POSTERS_FILES_NAMES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];

const GENRES = [`Action`, `Adventure`, `Animation`, `Biography`, `Comedy`, `Crime`, `Drama`, `Family`, `Fantasy`, `Film-Noir`, `History`, `Horror`, `Music`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Sport`, `Thriller`, `War`, `Western`];

const SENTENCES = splitOnSentences(DOOMY_TEXT);

const makeFilmDescription = (sentences) => {
  let filmDescription = ``;
  const sentencesCount = getRandomNumber(1, 3);

  for (let i = 0; i < sentencesCount; i++) {
    filmDescription += getRandomArrayItem(sentences) + ` `;
  }

  return filmDescription.trim();
};

const makeShortFilmDescription = (description) => {
  const symbolsCount = 140;
  let shortDescription = description;

  if (description.length > symbolsCount) {
    shortDescription = description.slice(0, symbolsCount) + `...`;
  }

  return shortDescription;
};

const makeRandomArray = (array) => {
  const itemsCount = getRandomNumber(1, 3);
  return array.sort(() => 0.5 - Math.random()).slice(0, itemsCount);
};


const generateSingleFilm = () => {
  const releaseDate = makeRandomDate();
  const year = releaseDate.getFullYear();
  const description = makeFilmDescription(SENTENCES);

  return {
    title: getRandomArrayItem(FILMS_TITLES),
    alternativeTitle: getRandomArrayItem(FILMS_TITLES),
    description,
    shortDescription: makeShortFilmDescription(description),
    director: getRandomArrayItem(NAMES),
    writers: new Set(makeRandomArray(NAMES)),
    actors: new Set(makeRandomArray(NAMES)),
    genres: new Set(makeRandomArray(GENRES)),
    country: getRandomArrayItem(COUNTRIES),
    runtime: runtimeFormat(getRandomNumber(80, 320)),
    poster: POSTERS_PATH + getRandomArrayItem(POSTERS_FILES_NAMES),
    rating: (getRandomNumber(0, 90) / 10).toFixed(1),
    releaseDate,
    year,
    commentsCount: getRandomNumber(0, 25),
    userDetails: {
      'personalRating': getRandomNumber(1, 9),
      'watchlist': Math.random() > 0.5,
      'alreadyWatched': Math.random() > 0.5,
      'watchingDate': makeRandomDate(),
      'favorite': Math.random() > 0.5,
    },
    ageRating: getRandomNumber(0, 18),
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateSingleFilm);
};

export {generateSingleFilm, generateFilms};
