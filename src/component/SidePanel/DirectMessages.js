import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../actions";

function DirectMessages({ currentUser, setCurrentChannel, setPrivateChannel }) {
  const [users, setUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");
  useEffect(() => {
    if (currentUser) {
      addListeners(currentUser.uid);
    }
  }, []);

  const addStatusToUser = (UserId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === UserId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);

    setUsers(updatedUsers);
  };

  const isUserOnline = (user) => user.status === "online";

  const addListeners = (UserUuid) => {
    const loadedUsers = [];
    setUsers([]);
    firebase
      .database()
      .ref("users")
      .on("child_added", (snap) => {
        if (UserUuid !== snap.key) {
          let user = snap.val();
          user["uid"] = snap.key;
          user["status"] = "offline";
          loadedUsers.push(user);
          console.log(loadedUsers);
          setTimeout(() => setUsers(loadedUsers), 50);
        }
      });

    firebase
      .database()
      .ref(".info/connected")
      .on("value", (snap) => {
        if (snap.val() === true) {
          const ref = firebase.database().ref("presence").child(UserUuid);
          ref.set(true);
          ref.onDisconnect().remove((err) => {
            if (err !== null) {
              console.log(err);
            }
          });
        }
      });

    firebase
      .database()
      .ref("presence")
      .on("child_added", (snap) => {
        if (UserUuid !== snap.key) {
          addStatusToUser(snap.key);
        }
      });

    firebase
      .database()
      .ref("presence")
      .on("child_removed", (snap) => {
        if (UserUuid !== snap.key) {
          addStatusToUser(snap.key, false);
        }
      });
  };

  const changeChannel = (user) => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setActiveChannel(user.uid);
  };

  const getChannelId = (userId) => {
    const currentUserId = currentUser.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name='mail' /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.length > 0 &&
        users.map((user) => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon name='circle' color={isUserOnline(user) ? "green" : "red"} />@{" "}
            {user.name}
          </Menu.Item>
        ))}
    </Menu.Menu>
  );
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  DirectMessages
);
