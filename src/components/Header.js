import React, { useEffect, Component } from "react";
import styled from "styled-components";
import { borderRadius, darken, margin } from "polished";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
import request from 'request-promise';
import {
    Grid,

    TextField,
    Menu,
    MenuItem,
    Button,
    AppBar as MuiAppBar,
    IconButton as MuiIconButton,
    InputAdornment,
    Toolbar
} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Search from '@material-ui/icons/Search';
import './style.css';


const AppBar = styled(MuiAppBar)`
  background: #121212;
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;


const CssTextField = styled(TextField)({

    '& .MuiOutlinedInput-input': {
        padding: '9px !important',
        color: "black",
        borderRadius: '50rem'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '50rem',
        '& fieldset': {
            borderColor: 'white',
        },
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
});



class LanguageMenu extends Component {
    state = {
        anchorMenu: null,
        menuQualify: null,
        playType: null,
    };

    toggleMenu = event => {
        console.log(this.state.menuQualify);
        this.setState({ anchorMenu: event.currentTarget });
    };
    toggleMenuQualify = event => {
        this.setState({ menuQualify: event.currentTarget });
    };
    toggleMenuType = event => {
        this.setState({ playType: event.currentTarget });
    };
    closeMenu = async () => {
        await this.setState({
            anchorMenu: null,
            menuQualify: null,
            playType: null,
        });
    };

    render() {
        const { anchorMenu, menuQualify, playType } = this.state;
        const open = Boolean(anchorMenu);
        const openQualify = Boolean(menuQualify);
        const openType = Boolean(playType);


        return (
            <React.Fragment>

                <Button variant="contained"
                    style={{ borderRadius: '50rem', backgroundColor: '#282828', color: 'white' }}
                    onClick={this.toggleMenu}
                    endIcon={<KeyboardArrowDownIcon />}
                >Cài đặt</Button>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorMenu}
                    open={open}
                    onClose={this.closeMenu}
                >
                    <MenuItem
                    // onClick={() => {
                    //     this.closeMenu();
                    // }}
                    >
                        Danh sách chặn
                    </MenuItem>
                    <MenuItem
                        onClick={
                            this.toggleMenuQualify}

                    >
                        Chất lượng nhạc

                        {/* <Menu
                            id="menu-qualify"
                            anchorEl={menuQualify}
                            open={openQualify}
                        // onClose={this.closeMenu}
                        >
                            <MenuItem
                                onClick={() => {
                                    this.closeMenu();
                                }}
                            >
                                SQ.128
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    this.closeMenu();
                                }}
                            >
                                HQ.320
                            </MenuItem>

                        </Menu> */}
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        Trình phát nhạc
                    </MenuItem>

                </Menu>
            </React.Fragment>
        );
    }
}





const API = 'https://ipapi.co/json/';

class UserMenu extends Component {
    state = {
        anchorMenu: null,

    };

    toggleMenu = event => {
        this.setState({ anchorMenu: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorMenu: null });
    };

    onSignout = () => {
        sessionStorage.setItem('users', '')
        this.props.currentprops.history.push('/')
        window.location.reload();
    }

    onGotoProfile = () => {
        this.props.currentprops.history.push('/profile')
    }

    render() {
        const { anchorMenu } = this.state;

        const open = Boolean(anchorMenu);
        return (
            <React.Fragment>
                <Button variant="contained"
                    style={{ borderRadius: '50rem', marginLeft: '10px', backgroundColor: '#282828', color: 'white' }}
                    onClick={this.toggleMenu}
                    endIcon={<KeyboardArrowDownIcon />}
                >Username</Button>
                {/* <IconButton
                    aria-owns={open ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.toggleMenu}
                    color="inherit"
                >
                    <Power />
                </IconButton> */}
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorMenu}
                    open={open}
                    onClose={this.closeMenu}
                >
                    <MenuItem
                        onClick={() => {
                            this.onGotoProfile();
                        }}
                    >
                        Tài khoản
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        Thông tin chung
                    </MenuItem>
                    <MenuItem
                        onClick={this.onSignout}
                    >
                        Đăng xuất
                    </MenuItem>
                </Menu>
            </React.Fragment>
        );
    }
}

class Header extends Component {
    state = {
        anchorMenu: null,
        search: null,
    };

    toggleMenu = event => {
        const { anchorMenu } = this.state;
        const open = Boolean(anchorMenu);
        if (open) {
            this.setState({ anchorMenu: null });
        } else {
            this.setState({ anchorMenu: event.currentTarget });
        }

    };

    toggleMenuChild = event => {
        const { childMenu } = this.state;
        const open = Boolean(childMenu);
        if (open) {
            this.setState({ childMenu: null });
        } else {
            this.setState({ childMenu: event.currentTarget });
        }
    };

    toggleMenuChild1 = event => {
        const { childMenu1 } = this.state;
        const open = Boolean(childMenu1);
        if (open) {
            this.setState({ childMenu1: null });
        } else {
            this.setState({ childMenu1: event.currentTarget });
        }
    };

    toggleMenuChild2 = event => {
        const { childMenu2 } = this.state;
        const open = Boolean(childMenu2);
        if (open) {
            this.setState({ childMenu2: null });
        } else {
            this.setState({ childMenu2: event.currentTarget });
        }
    };

    closeMenu = () => {
        this.setState({ anchorMenu: null });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { anchorMenu } = this.state;
        const { childMenu } = this.state;
        const { childMenu1 } = this.state;
        const { childMenu2 } = this.state;
        const open = Boolean(anchorMenu);
        const openChild = Boolean(childMenu);
        const openChild1 = Boolean(childMenu1);
        const openChild2 = Boolean(childMenu2);
        return (
            <React.Fragment>
                <AppBar position="sticky" elevation={0} >

                    <Toolbar>
                        <Grid container alignItems="center" className="menuMobile" >
                            <Grid item>

                                <CssTextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={this.state.search}
                                    onChange={this.onChange}
                                    style={{
                                        backgroundColor: "white",

                                        borderRadius: '50rem'
                                    }}

                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />



                            </Grid>
                            <Grid item xs />
                            <Grid item >

                                <Button
                                    style={{ borderRadius: '50rem', color: 'white', marginRight: '10px' }}
                                    component={Link}
                                    to="/umusic/sign-up"
                                >
                                    Đăng ký
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ borderRadius: '50rem', backgroundColor: 'white', color: 'black', marginRight: '10px' }}
                                    component={Link}
                                    to="/umusic/sign-in"
                                >
                                    Đăng Nhập
                                </Button>

                                <LanguageMenu />
                                <UserMenu currentprops={this.props} />

                            </Grid>
                        </Grid>

                    </Toolbar>
                </AppBar>
            </React.Fragment>

        )
    }
}


const SignUp = compose(
    withRouter
)(Header, UserMenu);

export default SignUp;
