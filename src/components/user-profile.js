import {ratingMapper} from '../utils';
import AbstractComponent from './abstract';

const createUserProfileTemplate = (profileRating) => {
  const userRank = ratingMapper(profileRating);
  return `
    <section class="header__profile profile">
        ${userRank ? `<p class="profile__rating">${userRank}</p>` : ``}
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
};

export default class UserProfile extends AbstractComponent {
  constructor(profileRating) {
    super();
    this._profileRating = profileRating;
  }

  getTemplate() {
    return createUserProfileTemplate(this._profileRating);
  }
}
