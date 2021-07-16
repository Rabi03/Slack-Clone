import React, { useState } from "react";
import uuidv4 from "uuid/dist/v4";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";
import FileModal from "./FileModal";
import ProgressBar from "./ProgressBar";

export default function MessageForm({
  messagesRef,
  currentChannel,
  currentUser,
  isPrivateChannel,
  getMessagesRef,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [uploadState, setUploadState] = useState("");
  const [percentUploaded, setPercent] = useState(0);
  const storageRef = firebase.storage().ref();
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const Message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };
    if (fileUrl !== null) {
      Message["image"] = fileUrl;
    } else {
      Message["content"] = message;
    }

    return Message;
  };

  const sendMessage = () => {
    setLoading(true);
    if (message) {
      getMessagesRef()
        .child(currentChannel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setLoading(false);
          setMessage("");
          setError("");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError(err.message);
        });
    } else {
      setError("Add a message");
      setLoading(false);
    }
  };
  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return "chat/public";
    }
  };

  const uploadFile = (file, metadata) => {
    const filePath = `${getPath()}/${uuidv4()}.jpg`;
    const ref = getMessagesRef();
    setUploadState("Uploading");
    storageRef
      .child(filePath)
      .put(file, metadata)
      .on(
        "state_changed",
        (snap) => {
          const percentUploaded = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setPercent(percentUploaded);
        },
        (err) => {
          console.log(err);
          setError(err.message);
        },
        () => {
          storageRef
            .child(filePath)
            .put(file, metadata)
            .snapshot.ref.getDownloadURL()
            .then((downloadUrl) => {
              sendFileMessage(downloadUrl, ref, currentChannel.id);
            })
            .catch((err) => {
              console.log("Get Error" + err);
              setError(err.message);
              setUploadState("error");
              setUploadTask(null);
            });
        }
      );
  };

  const sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(createMessage(fileUrl))
      .then(() => {
        setUploadState("done");
      })
      .catch((err) => {
        console.log(err);
        setError(err.messsage);
      });
  };

  return (
    <Segment className='message__form'>
      <Input
        fluid
        name='message'
        onChange={handleChange}
        style={{ marginBottom: "0.7em" }}
        label={<Button icon={"add"} />}
        labelPosition='left'
        value={message}
        placeholder='Write your message'
        className={error.includes("message") ? "error" : ""}
      />
      <Button.Group icon widths='2'>
        <Button
          onClick={sendMessage}
          disabled={loading}
          color='orange'
          content='Add Reply'
          labelPosition='left'
          icon='edit'
        />
        <Button
          onClick={() => setModal(true)}
          color='teal'
          content='Upload Media'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
}
