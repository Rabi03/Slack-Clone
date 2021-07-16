import React from "react";
import moment from "moment";
import { Comment, Image } from "semantic-ui-react";

export default function Message({ message, user }) {
  const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : "";
  };
  const isImage = (message) => {
    return (
      message.hasOwnProperty("image") && !message.hasOwnProperty("content")
    );
  };

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, user)}>
        <Comment.Author as='a'>{message.user.name}</Comment.Author>
        <Comment.Metadata>
          <div>{moment(message.timestamp).fromNow()}</div>
        </Comment.Metadata>

        {isImage(message) ? (
          <Image src={message.image} className='message__image' />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
}
