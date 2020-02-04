import {getRandomArrayItem, splitOnSentences, makeRandomDate, commentDateFormat} from '../utils';
import {DOOMY_TEXT, NAMES} from '../constants';

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];
const SENTENCES = splitOnSentences(DOOMY_TEXT);


const generateSingleComment = () => {
  const commentDate = makeRandomDate();
  const now = new Date().toDateString();

  return {
    id: String(Date.parse(now)) + String(Math.random()),
    author: getRandomArrayItem(NAMES),
    text: getRandomArrayItem(SENTENCES),
    date: commentDateFormat(commentDate),
    emotion: getRandomArrayItem(EMOTIONS),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateSingleComment);
};

export {generateSingleComment, generateComments};
