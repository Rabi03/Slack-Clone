import React, { useState } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import md5 from "md5";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");

  const { username, email, password } = values;
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const saveUser = (createdUser) => {
    return firebase.database().ref("users").child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((createdUser) => {
        console.log(createdUser);
        createdUser.user
          .updateProfile({
            displayName: username,
            photoURL: `http://gravatar.com/avatar/${md5(
              createdUser.user.email
            )}?d=identicon`,
          })
          .then(() => {
            saveUser(createdUser).then(() => {
              console.log("user saved");
              setLoading(false);
            });
          })
          .catch((err) => {
            console.error(err);
            setErrors(err.message);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.message);
        setLoading(false);
      });
  };

  return (
    <Grid textAlign='center' style={{ height: "100vh" }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9_ufj10NFgL1Dtg5SAIpB4oFk4_OaWQ8d9bcxIUkgx5tjSueRL94aMFMRcg_O2fQqWE&usqp=CAU' />{" "}
          Register-in to our account
        </Header>
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            {error && <p style={{ color: "red", margin: "5px" }}>{error}</p>}
            <Form.Input
              type='text'
              required
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={handleChange}
            />
            <Form.Input
              type='email'
              required
              error={error.includes("email") ? true : false}
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='E-mail address'
              value={email}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              required
              error={error.includes("Password") ? true : false}
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={handleChange}
            />

            <Button
              className={loading ? "loading" : ""}
              color='teal'
              fluid
              size='large'
            >
              Register
            </Button>
          </Segment>
        </Form>

        <Message>
          New to us? <Link to='/login'>Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
