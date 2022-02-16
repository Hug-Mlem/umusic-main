import React, { Component } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

import { withFirebase } from "../../Firebase";
import { compose } from "recompose";

import {
  FormControl,
  Button as MuiButton,
  Paper,
  TextField,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import './style.css';
const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;



const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#F3903F',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#F3903F',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#F3903F',
    },
    '&:hover fieldset': {
      borderColor: '#F3903F',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#F3903F',
    },
  },
});

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const API = 'https://ipapi.co/json/';

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }


  storeUserData = () => {
    // get Ip address
    fetch(API)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        var userInfo = {
          uid: this.props.firebase.auth.currentUser.uid,
          email: this.state.email
        };
        // this.props.firebase.db.ref('logs').push({ 
        //save to users
        this.props.firebase.firestore.collection('users').add({
          uid: this.props.firebase.auth.currentUser.uid,
          email: this.state.email,
          address: {
            city: data.city,
            country: data.country_name,
            region: data.region,
            uf: ''
          },
          deleted: false,
          createdAt: new Date().toLocaleString()
        }).then(() => {
          console.log('Signup users is saved to logs!');
        }).catch((e) => {
          console.log('Signup users Failed.', e);
        });

        console.log('after access the add user', this.props.firebase.auth.currentUser.uid, this.state.email, data)
        // save to logs
        this.props.firebase.firestore.collection('logs').add({
          source: 'Web',
          action: 'signup',
          dateTime: new Date().toLocaleString(),
          browser: this.props.firebase.browser,
          ip: data.ip,
          latitude: data.latitude,
          longitude: data.longitude,
          country: data.country_name,
          city: data.city,
          currency: data.currency,
          user: userInfo
        }).then(() => {
          console.log('Signup logs is saved to logs!');
        }).catch((e) => {
          console.log('Signup Failed.', e);
        });
      })
      .catch(error => console.log('error'));

  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });

      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.storeUserData()
        console.log('success store signup log')
        this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <Wrapper>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={require('../../assets/logo.png')} style={{ width: '200px' }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '50px', fontWeight: 700, fontFamily: 'Inter, Rubik, sans-serif' }}>
          Đăng ký
        </p>

        <form onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <CssTextField id="username"
              name="username"
              label="Họ và tên"
              variant="outlined"
              placeholder="Họ và tên"
              value={username}
              onChange={this.onChange}
              autoComplete="username"
              autoFocus />


          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <CssTextField id="email"
              name="email"
              label="Email"
              variant="outlined"
              placeholder="Email"
              value={email}
              onChange={this.onChange}
              autoComplete="email"
              autoFocus />

          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <CssTextField name="passwordOne"
              type="password"
              id="passwordOne"
              label="Password"
              variant="outlined"
              placeholder="Password"
              value={passwordOne}
              onChange={this.onChange}
              autoComplete="password"
              autoFocus />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <CssTextField name="passwordTwo"
              type="password"
              id="passwordTwo"
              label="Nhập lại mật khẩu"
              variant="outlined"
              placeholder="Nhập lại mật khẩu"
              value={passwordTwo}
              onChange={this.onChange}
            />

          </FormControl>
          <Button
            disabled={isInvalid}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            mt={2}
          >
            Đồng ý
          </Button>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>

            <Button
              component={Link}
              to="/umusic/sign-in"
              color="primary"
            >
              &lt;
            </Button>
          </div>
          {error && <p style={{ color: 'red' }}>{error.message}</p>}
        </form>
      </Wrapper>
    );
  }
}

// export default SignUp;
const SignUp = compose(
  withRouter,
  // withFirebase
)(SignUpForm);

export default SignUp;
