/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions/index";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from "semantic-ui-react";

function Channels({ currentUser, setCurrentChannel, setPrivateChannel }) {
  const [user, setUser] = useState(currentUser);
  const [activeChannelId, setActiveChannelId] = useState("");
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState(null);
  const messageRef = firebase.database().ref("messages");
  const [notifications, setNotifications] = useState([]);
  const [modal, setModal] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [channelInfo, setChannelInfo] = useState({
    channelName: "",
    channelDetails: "",
  });

  const { channelName, channelDetails } = channelInfo;
  const handleChange = (e) => {
    setChannelInfo({ ...channelInfo, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    addListeners();
    return () => {
      removeListeners();
    };
  }, []);

  const addListeners = () => {
    const loadedChannel = [];
    setChannels([]);
    firebase
      .database()
      .ref("channels")
      .on("child_added", (snap) => {
        loadedChannel.push(snap.val());
        setFirstChannel(loadedChannel[0]);
        setChannels((channel) => [...channel, snap.val()]);
        addNotificationListeners(snap.key);
      });
  };

  const addNotificationListeners = (channelId) => {
    messageRef.child(channelId).on("value", (snap) => {
      if (channel) {
        handleNotifications(channelId, channel.id, notifications, snap);
      }
    });
  };

  const handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snap
  ) => {
    let lastTotal = 0;
    let index = notifications.findIndex(
      (notification) => notification.id === channelId
    );
    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    setNotifications(notifications);
  };

  const removeListeners = () => {
    firebase.database().ref("channels").off();
  };

  const setFirstChannel = (channel) => {
    if (firstLoad && channel) {
      setCurrentChannel(channel);
      setActiveChannelId(channel.id);
      setChannel(channel);
    }
    setFirstLoad(false);
  };

  const changeChannel = (channel) => {
    setCurrentChannel(channel);
    setActiveChannelId(channel.id);
    setPrivateChannel(false);
    setChannel(channel);
    clearNotifications();
  };

  const clearNotifications = () => {
    let index = notifications.findIndex(
      (notification) => notification.id === channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  const addChannel = () => {
    const key = firebase.database().ref("channels").push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    firebase
      .database()
      .ref("channels")
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelInfo({ channelName: "", channelDetails: "" });
        setModal(false);
        console.log("Channel Added");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelName !== "" && channelDetails !== "") {
      addChannel();
    }
  };

  const getNotificationCount = (channel) => {
    let count = 0;

    notifications.forEach((notification) => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  return (
    <>
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name='add' onClick={() => setModal(true)} />
        </Menu.Item>
        {channels.length > 0 &&
          channels.map((channel) => (
            <Menu.Item
              key={channel.id}
              onClick={() => changeChannel(channel)}
              name={channel.name}
              style={{ opacity: 0.7 }}
              active={channel.id === activeChannelId}
            >
              {getNotificationCount(channel) && (
                <Label color='red'>{getNotificationCount(channel)}</Label>
              )}
              # {channel.name}
            </Menu.Item>
          ))}
      </Menu.Menu>

      {/* Add Channel Modal */}
      <Modal basic open={modal} onClose={() => setModal(false)}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label='Name of Channel'
                name='channelName'
                onChange={handleChange}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label='About the Channel'
                name='channelDetails'
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color='green' inverted onClick={handleSubmit}>
            <Icon name='checkmark' /> Add
          </Button>
          <Button color='red' inverted onClick={() => setModal(false)}>
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
