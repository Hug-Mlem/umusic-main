import React, { Component, useState, useEffect } from "react";
import { compose } from "recompose";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import makeRequest from "../api/config-request";

import {
    //  postApi, urlApi,  
    postApiNew,urlList
} from "../../pages/api/config.js";
// import md5 from 'md5';
import './style.css';
import JSAlert from 'js-alert';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Button as MuiButton,
    Paper, TextField,
    Divider as MuiDivider,
    Grid,
    Modal,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import OtpInput from "react-otp-input";

const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Wrapper = styled(Paper)`
  
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }

`;


const CenteredContent = styled.div`
  text-align: center;
  margin-left : auto ;
  margin-right : auto;
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
    email: "",
    password: "",
    error: null
};

const API = 'https://ipapi.co/json/';

// const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

class SignInFormPhone extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE, open: false, otp: '', final: '1111' };
    }


    onChange = event => {
        const re = /^[0-9\b]+$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            this.setState({ [event.target.name]: event.target.value })
        }
    };

    handleOpen = () => {
        this.setState({
            open: true
        })
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };
    handleChangeOTP = (otp) => this.setState({ otp });
   
    render() {
        const { phone, error, capcha, open, otp, final } = this.state;



        const onSubmit = async e => {

            if (phone === '') {
                JSAlert.alert("<code>Vui lòng nhập số  điện thoại</code>", null, JSAlert.Icons.Failed);
                return false;
            }
            else if (phone && (phone.length < 9 || phone.length > 10)) {
                JSAlert.alert("<code>Vui lòng nhập đúng độ dài của số điện thoại</code>", null, JSAlert.Icons.Failed);
                return false;
            }
            makeRequest("post", urlList().URL_AUTHEN.LOGIN_PHONE, {
                phoneNumber: phone,
                timestamp: 1627282250000
            })
                .then(({ data }) => {
                    this.handleOpen();
                    
                })
                .catch((err) => {
                    console.log("++++++++++++++++", err);
                });

        };

        const ValidateOtp = () => {
            makeRequest("post", urlList().URL_AUTHEN.CHECK_OTP, {
                phoneNumber: phone,
                otp: otp, 
                timestamp: 1627282250000
            })
                .then(({ data }) => {
                    if (data.data) {
                        this.props.history.push('/umusic')
                    }
                })
                .catch((err) => {
                    console.log("++++++++++++++++", err);
                });

        }
        return (
            <Wrapper>

                <CenteredContent>

                    <FormControl margin="normal" required style={{ width: '20%' }}>
                        <CssTextField id="phone" label="Số điện thoại" variant="outlined" placeholder="Số điện thoại"
                            value={phone}
                            onChange={this.onChange}
                            name="phone"
                            autoComplete="phone"
                            autoFocus />
                    </FormControl>
                </CenteredContent>
                <CenteredContent>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                </CenteredContent>
                <CenteredContent>
                    <Button
                        type="submit"
                        style={{ width: '150px' }}
                        variant="contained"
                        color="primary"
                        mb={2}
                        onClick={onSubmit}

                    >
                        Đăng nhập
                    </Button>
                </CenteredContent>




                {error && <p style={{ color: 'red' }}>{error.message}</p>}

                <Modal
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >




                    <div style={{ position: 'absolute', top: '30%', left: '30%', width: '40%' }}>
                        <Wrapper>
                            <h3 style={{ textAlign: 'center' }}><b>Nhập mã xác thực OTP</b></h3>
                            <h4 style={{ textAlign: 'center' }}>Quý khách vui lòng nhập mã OTP  </h4>
                            <h4 style={{ textAlign: 'center' }}>đã được gửi về số điện thoại {phone}</h4>


                            <OtpInput
                                value={this.state.otp}
                                onChange={this.handleChangeOTP}
                                containerStyle={{ width: '60%', marginLeft: '20%' }}
                                inputStyle={{ width: '100%' }}
                                numInputs={4}
                                separator={<span>-</span>}
                            />

                            <CenteredContent>
                                <Button
                                    type="submit"
                                    style={{ width: '60%', marginTop: '20px' }}
                                    variant="contained"
                                    color="primary"
                                    mb={2}
                                    onClick={ValidateOtp}

                                >
                                    Xác nhận
                                </Button>
                            </CenteredContent>


                        </Wrapper>
                    </div>





                </Modal>
            </Wrapper>
        );
    }
}




class SignInFormEmail extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }


    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { phone, email, password, error, capcha } = this.state;


        const onSubmit = async e => {

            if (email === '' || password === '') {
                JSAlert.alert("<code>Vui lòng nhập email và password</code>", null, JSAlert.Icons.Failed);
                return false;
            }
            const url = 'http://103.143.206.63:8089/umusic-service/v1/authen/login/' + '/employees/login'

            const data = {
                username: email,
                type: 'admin',
                password: password,
                device_id: "ABC"
            }
            const result = await postApiNew('POST', url, data)
            if (result.data) {
                sessionStorage.setItem('users', JSON.stringify(result.data))
                localStorage.setItem('users', JSON.stringify(result.data))
                JSAlert.alert("<code>Login success</code>", null, JSAlert.Icons.Success);
                this.props.history.push('/')
                window.location.reload();
            } else {
                JSAlert.alert("<code>username or passoword falsed</code>", null, JSAlert.Icons.Failed);
            }
        };

        const isInvalid = email === "" || password === ""
        return (
            <Wrapper>

                <CenteredContent>
                    <FormControl margin="normal" required style={{ width: '20%' }}>
                        <CssTextField id="email" label="Email" variant="outlined" placeholder="Email"
                            value={email}
                            onChange={this.onChange}
                            name="email"
                            autoComplete="email"
                            autoFocus />
                    </FormControl>

                </CenteredContent>
                <CenteredContent>

                    <FormControl margin="normal" required style={{ width: '20%' }}>

                        <CssTextField id="password"
                            label="Password"
                            type="password"
                            name="password"
                            variant="outlined" placeholder="Password"
                            value={password}
                            onChange={this.onChange}
                            autoComplete="current-password"
                        />
                    </FormControl>
                </CenteredContent>
                <CenteredContent>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                </CenteredContent>
                <CenteredContent>
                    <Button
                        type="submit"
                        style={{ width: '150px' }}
                        variant="contained"
                        color="primary"
                        mb={2}
                        onClick={onSubmit}

                    >
                        Đăng nhập
                    </Button>
                </CenteredContent>
                {error && <p style={{ color: 'red' }}>{error.message}</p>}
            </Wrapper>
        );
    }
}




function UsersList({ history, location }) {
    const [switchPage, setSwitchPage] = useState(1);
    const switchPages = (number) => {
        setSwitchPage(number);
    }
    

    return (
        <div style={{ width: '200%', marginLeft: '-50%' }}>

            <Wrapper>


                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <img src={require('../../assets/logo.png')} style={{ width: '10%' }} />
                </div>
                <Divider my={5} />

                <p style={{ textAlign: 'center', fontSize: '50px', fontWeight: 700, fontFamily: 'Inter, Rubik, sans-serif' }}>
                    Đăng nhập
                </p>

                <div style={{
                    width: '30%', height: 'auto', zIndex: 99, backgroundColor: '#F3903F', borderRadius: '50rem', display: 'flex', flexDirection: 'row',
                    marginLeft: 'auto', marginRight: 'auto',
                }}>


                    <Button
                        className={switchPage == 1 ? "btnActivePages" : "btnSwitchPages"}
                        variant="contained"
                        onClick={() => switchPages(1)}
                    >
                        Đăng nhập số điện thoại
                    </Button>

                    <Button
                        variant="contained"

                        className={switchPage == 2 ? "btnActivePages" : "btnSwitchPages"}
                        onClick={() => switchPages(2)}



                    >
                        Đăng nhập email
                    </Button>

                </div>

                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        {switchPage == 1 ? <SignInFormPhone history={history} location={location} /> :
                            switchPage == 2 ? <SignInFormEmail history={history}location={location} /> : ''
                        }
                    </Grid>
                </Grid>


                <CenteredContent style={{ width: '20%' }}>
                    <div>
                        Bạn chưa có tài khoản?
                        <Button
                            component={Link}
                            to="/umusic/sign-up"
                            color="secondary"
                        >
                            Đăng ký
                        </Button>
                    </div>


                    <Button
                        component={Link}
                        to="/umusic/reset-password"
                        fullWidth
                        color="primary"
                    >
                        Quên mật khẩu
                    </Button>
                </CenteredContent>
                <div style={{ height: '10px' }} />



            </Wrapper>

        </div>


    );
}


const SignIn = compose(
    withRouter
)(UsersList);

export default SignIn;
