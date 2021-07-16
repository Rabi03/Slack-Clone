import React, { useState } from "react";
import firebase from "../../firebase";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

export default function UserPanel({ currentUser }) {
  const [user, setUser] = useState(currentUser);
  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={handleSignOut}>Sign Out</span>,
    },
  ];

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("SignOut"));
  };

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          {/* App Header */}
          <Header inverted floated='left' as='h2'>
            <Icon name='code' />
            <Header.Content>DevChat</Header.Content>
          </Header>
          <Header style={{ padding: "0.25em" }} as='h4' inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced='right' avatar />
                  {user.displayName}
                </span>
              }
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>

        {/* User Dropdown  */}
      </Grid.Column>
    </Grid>
  );
}
