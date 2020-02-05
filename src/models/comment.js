export class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.text = data[`comment`];
    this.date = new Date(data[`date`]);
    this.emotion = data[`emotion`];
  }

  static toLocalComment(comment) {
    return {
      'comment': comment.text,
      'date': comment.date.toISOString(),
      'emotion': comment.emotion,
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
