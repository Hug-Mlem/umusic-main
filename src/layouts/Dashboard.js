import React from "react";
import styled, { createGlobalStyle } from "styled-components";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { spacing } from "@material-ui/system";
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth,
  Modal,
  Box,
  Button,
  Typography, TextField,
  InputAdornment,
  Switch,

} from "@material-ui/core";



import Search from '@material-ui/icons/Search';
import { isWidthUp } from "@material-ui/core/withWidth";

const drawerWidth = 260;

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }


  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${props => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: #121212;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
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


class Dashboard extends React.Component {
  state = {
    mobileOpen: false,
    open: false
  };
  handleOpen = () => {
    this.setState({ open: true })
  };
  handleClose = () => this.setState({ open: false });

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { children, routes, width } = this.props;
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      backgroundColor: '#373737',
      boxShadow: 24,
      // textAlign: "center",
      borderRadius: '3%',
    };
    return (
      <>
        {((this.props.children.props.location.pathname == "/umusic/sign-in") ||
          (this.props.children.props.location.pathname == "/umusic/sign-up") ||
          (this.props.children.props.location.pathname == "/umusic/reset-password"))
          ?
          <Root>
            <AppContent>

              <MainContent p={isWidthUp("lg", width) ? 10 : 5}>
                <div style={{ width: "50%", marginLeft: 'auto', marginRight: 'auto' }}>
                  {children}
                </div>
              </MainContent>
            </AppContent>
          </Root>
          :
          <Root>
            <CssBaseline />
            <GlobalStyle />
            <Drawer>
              {/* <Hidden mdUp implementation="js">
                <Sidebar
                  routes={routes}
                  PaperProps={{ style: { width: drawerWidth } }}
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onClose={this.handleDrawerToggle}
                />
              </Hidden> */}
              <Hidden smDown implementation="css">
                <Sidebar
                  functionHanldeOpen={() => this.handleOpen()}
                  routes={routes}
                  PaperProps={{ style: { width: drawerWidth } }}
                />
              </Hidden>
            </Drawer>
            <AppContent>
              <Header onDrawerToggle={this.handleDrawerToggle} />
              <MainContent p={isWidthUp("lg", width) ? 10 : 5}>
                {children}
              </MainContent>
              <Modal
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box style={style}>
                  <div style={{ fontSize: "30px", color: 'white', marginBottom: '20px', marginTop: '20px', textAlign: 'center' }}>
                    Tạo playlist
                  </div>
                  <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <CssTextField
                      id="outlined-basic"
                      variant="outlined"
                      value={this.state.search}
                      onChange={this.onChange}
                      style={{
                        backgroundColor: "white",
                        width: '80%',
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
                  </div>


                  <div style={{
                    marginBottom: '20px', height: '40px'
                  }}>
                    <div style={{ fontSize: "12px", color: 'white', float: 'left', marginLeft: '15px' }}>
                      Công khai <br />
                      Mọi người có thể nhìn thấy playlist này
                    </div>
                    <div style={{ float: 'right' }} >

                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div style={{
                    marginBottom: '20px', height: '40px'
                  }}>
                    <div style={{ fontSize: "12px", color: 'white', float: 'left', marginLeft: '15px' }}>
                      Công khai <br />
                      Mọi người có thể nhìn thấy playlist này
                    </div>
                    <div style={{ float: 'right' }} >

                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div style={{ marginBottom: '40px', textAlign: 'center', width: '100%' }}>
                    <Button
                      variant="contained"
                      style={{ borderRadius: '50rem', backgroundColor: 'orange', color: 'black', marginRight: '10px', width: '60%' }}
                     
                    >
                      Đồng ý
                    </Button>

                  </div>
                </Box>
              </Modal>
            </AppContent>
          </Root>
        }
      </>
    );
  }
}

export default withWidth()(Dashboard);
