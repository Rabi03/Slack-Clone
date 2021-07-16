import React, { useEffect, useState, useRef } from "react";
import { Segment, Comment, Ref } from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

export default function Messages({
  currentChannel,
  currentUser,
  isPrivateChannel,
}) {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [numUniqueUsers, setNumUniqueUsers] = useState("");
  const messagesRef = firebase.database().ref("messages");
  const privateMessagesRef = firebase.database().ref("privateMessages");

  useEffect(() => {
    if (currentChannel && currentUser) addMessageListener(currentChannel.id);
  }, []);

  const addMessageListener = (channelId) => {
    let loadedMessaage = [];
    setMessages([]);
    const ref = getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessaage.push(snap.val());
      setMessages((msg) => [...msg, snap.val()]);

      setMessagesLoading(false);
      countUniqueUsers(loadedMessaage);
    });
  };

  const getMessagesRef = () => {
    return isPrivateChannel ? privateMessagesRef : messagesRef;
  };

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? "s" : ""}`;

    setNumUniqueUsers(numUniqueUsers);
  };

  return (
    <>
      <MessagesHeader
        channelName={
          currentChannel
            ? `${isPrivateChannel ? "@" : "#"} ${currentChannel.name}`
            : ""
        }
        numUniqueUsers={numUniqueUsers}
        isPrivateChannel={isPrivateChannel}
      />

      <Segment>
        <Comment.Group className='messages'>
          {messages.length > 0 &&
            messages.map((message) => (
              <Message
                key={message.timestamp}
                message={message}
                user={currentUser}
              />
            ))}
        </Comment.Group>
      </Segment>

      <MessageForm
        currentChannel={currentChannel}
        messagesRef={messagesRef}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
        getMessagesRef={getMessagesRef}
      />
    </>
  );
}
