import AbstractComponent from "./abstract";

const ratingMapper = (rating) => {
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
