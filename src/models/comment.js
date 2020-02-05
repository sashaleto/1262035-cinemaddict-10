export class Comment {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.text = comment[`comment`];
    this.date = new Date(comment[`date`]);
    this.emotion = comment[`emotion`];
  }

  static toLocalComment(comment) {
    return {
      'comment': comment.text,
      'date': comment.date.toISOString(),
      'emotion': comment.emotion,
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }
}
