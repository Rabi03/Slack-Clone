import React, { useState } from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");

  const { email, password } = values;
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((signInUser) => {
        console.log(signInUser);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.code);
        setLoading(false);
      });
  };
  return (
    <Grid textAlign='center' style={{ height: "100vh" }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          <Image src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9_ufj10NFgL1Dtg5SAIpB4oFk4_OaWQ8d9bcxIUkgx5tjSueRL94aMFMRcg_O2fQqWE&usqp=CAU' />{" "}
          Log-in to our account
        </Header>
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            {error && <p style={{ color: "red", margin: "5px" }}>{error}</p>}
            <Form.Input
              fluid
              type='email'
              value={email}
              error={error.includes("user") ? true : false}
              required
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='E-mail address'
              onChange={handleChange}
            />
            <Form.Input
              fluid
              required
              error={error.includes("password") ? true : false}
              icon='lock'
              name='password'
              value={password}
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange={handleChange}
            />

            <Button
              className={loading ? "loading" : ""}
              color='teal'
              fluid
              size='large'
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          Don't have an account? <Link to='/register'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
