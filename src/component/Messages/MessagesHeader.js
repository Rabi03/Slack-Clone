import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

export default function MessagesHeader({
  channelName,
  numUniqueUsers,
  isPrivateChannel,
}) {
  return (
    <Segment clearing>
      <Header fluid='true' as='h2' floated='left' style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && <Icon name={"star outline"} color='black' />}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      <Header floated='right'>
        <Input
          size='mini'
          icon='search'
          name='searchTerm'
          placeholder='Search Messages'
        />
      </Header>
    </Segment>
  );
}
