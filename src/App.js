import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { connect } from "react-redux";
import ColorPanel from "./component/ColorPanel/ColorPanel";
import SidePanel from "./component/SidePanel/SidePanel";
import Messages from "./component/Messages/Messages";
import MetaPanel from "./component/MetaPanel/MetaPanel";

function App({ currentUser, currentChannel, isPrivateChannel }) {
  return (
    <Grid columns={"equal"} className='App' style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel && currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(App);
