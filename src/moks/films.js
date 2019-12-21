import {getRandomNumber, getRandomArrayItem, splitOnSentences, runtimeFormat} from "../utils";

const FILMS_TITLES = [`The Shawshank Redemption`, `The Green Mile`, `Forrest Gump`, `Schindler's List`, `Intouchables`, `Inception`, `Léon`, `The Lion King`, `Fight Club`, `La vita è bella`, `Knockin' on Heaven's Door`, `The Godfather`, `Pulp Fiction`, `The Prestige`, `A Beautiful Mind `];
const POSTERS_PATH = `./images/posters/`;
const POSTERS_FILES_NAMES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const GENRES = [`Action`, `Adventure`, `Animation`, `Biography`, `Comedy`, `Crime`, `Drama`, `Family`, `Fantasy`, `Film-Noir`, `History`, `Horror`, `Music`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Sport`, `Thriller`, `War`, `Western`];
const COUNTRIES = [
  `United States`,
  `United Kingdom`,
  `China`,
  `France`,
  `Japan`,
  `Germany`,
  `Republic of Korea`,
  `Australia`,
  `India`,
  `New Zealand`,
  `Canada`,
  `Hong Kong`,
  `Italy`,
  `Spain`,
  `Russian Federation`,
];

const SENTENCES = splitOnSentences(DESCRIPTION);

const makeFilmDescription = (sentences) => {
  let filmDescription = ``;
  const sentencesCount = getRandomNumber(1, 3);

  for (let i = 0; i < sentencesCount; i++) {
    filmDescription += getRandomArrayItem(sentences) + ` `;
  }

  return filmDescription.trim();
};

const makeRandomGenres = (genres) => {
  const genresCount = getRandomNumber(1, 3);
  return genres.sort(() => 0.5 - Math.random()).slice(0, genresCount);
};


const generateSingleFilm = () => {
  return {
    title: getRandomArrayItem(FILMS_TITLES),
    description: makeFilmDescription(SENTENCES),
    genres: new Set(makeRandomGenres(GENRES)),
    country: getRandomArrayItem(COUNTRIES),
    runtime: runtimeFormat(getRandomNumber(80, 320)),
    poster: POSTERS_PATH + getRandomArrayItem(POSTERS_FILES_NAMES),
    rating: (getRandomNumber(0, 90) / 10).toFixed(1),
    year: getRandomNumber(1935, 2019),
    commentsCount: getRandomNumber(0, 25),
    userDetails: {
      'personalRating': (getRandomNumber(0, 90) / 10).toFixed(1),
      'watchlist': Math.random() > 0.5,
      'alreadyWatched': Math.random() > 0.5,
      'watchingDate': `2019-05-11T16:12:32.554Z`,
      'favorite': Math.random() > 0.5,
    },
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateSingleFilm);
};

export {generateSingleFilm, generateFilms};
