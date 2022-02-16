import React from "react";
import styled from "styled-components";
import { rgba } from "polished";

import { NavLink as RouterNavLink, withRouter } from "react-router-dom";
// import { darken } from "polished";

import PerfectScrollbar from "react-perfect-scrollbar";
import "../vendor/perfect-scrollbar.css";

import { spacing } from "@material-ui/system";
import './style.css'

import {
  Grid,
  Chip,
  ListItem,
  ListItemText,
  Drawer as MuiDrawer,
  Divider as MuiDivider,
  List as MuiList,
  Typography, 
  Button
} from "@material-ui/core";

import { ExpandLess, ExpandMore } from "@material-ui/icons";

import routes from "../routes/index";

import { Layers } from "react-feather";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));


const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Scrollbar = styled(PerfectScrollbar)`
  background-color: #000000;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const List = styled(MuiList)`
  background-color: #000000 
  ;
`;
const Divider = styled(MuiDivider)(spacing);

const Items = styled.div`
width : 90% ;
margin-left: auto;
margin-right : auto;
  padding-top: ${props => props.theme.spacing(2.5)}px;
  padding-bottom: ${props => props.theme.spacing(2.5)}px;
`;


const Category = styled(ListItem)`
  padding-top: ${props => props.theme.spacing(3)}px;
  padding-bottom: ${props => props.theme.spacing(3)}px;
  padding-left: ${props => props.theme.spacing(6)}px;
  padding-right: ${props => props.theme.spacing(5)}px;
  font-weight: ${props => props.theme.typography.fontWeightRegular};

  svg {
    color: ${props => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &.${props => props.activeClassName} {
    background-color: #282828;
  
    border-radius: 5px;
    span {
      color: ${props => props.theme.sidebar.color};
    }
  }
`;

const CategoryText = styled(ListItemText)`
  margin: 0;
  span {
    color: ${props => props.theme.sidebar.color};
    font-size: ${props => props.theme.typography.body1.fontSize}px;
    font-weight: ${props => props.theme.typography.fontWeightRegular};
    padding: 0 ${props => props.theme.spacing(4)}px;
  }
`;

const Flag = styled.img`
  // border-radius: 50%;
  width: 22px;
  height: 22px;
`;

const CategoryIconLess = styled(ExpandLess)`
  color: ${props => rgba(props.theme.sidebar.color, 0.5)};
`;

const CategoryIconMore = styled(ExpandMore)`
  color: ${props => rgba(props.theme.sidebar.color, 0.5)};
`;


const LinkBadge = styled(Chip)`
  font-size: 11px;
  font-weight: ${props => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 12px;
  top: 8px;
  background: ${props => props.theme.sidebar.badge.background};

  span.MuiChip-label,
  span.MuiChip-label:hover {
    cursor: pointer;
    color: ${props => props.theme.sidebar.badge.color};
    padding-left: ${props => props.theme.spacing(2)}px;
    padding-right: ${props => props.theme.spacing(2)}px;
  }
`;

const CategoryBadge = styled(LinkBadge)`
  top: 12px;
`;


const SidebarFooter = styled.div`
  background-color: black !important;
  padding: ${props => props.theme.spacing(3)}px
    ${props => props.theme.spacing(4)}px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;



function SidebarCategory({
  name,
  icon,
  classes,
  isOpen,
  isCollapsable,
  badge,
  ...rest
}) {
  return (
    <Category {...rest}>
      <Flag src={icon} alt="Devices" />
      <CategoryText>{name}</CategoryText>
      {isCollapsable ? (
        isOpen ? (
          <CategoryIconMore />
        ) : (
          <CategoryIconLess />
        )
      ) : null}
      {badge ? <CategoryBadge label={badge} /> : ""}
    </Category>
  );
}


class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  redirectLink = link => {
    if (link == '#') {
      window.open('https://www.autofarmer.me/', '_blank');
    }
  }

  redirectLinkInstall = link => {
    window.open(link);
  }
  toggle = index => {
    // Collapse all elements
    Object.keys(this.state).forEach(
      item =>
        this.state[index] ||
        this.setState(() => ({
          [item]: false
        }))
    );

    // Toggle selected element
    this.setState(state => ({
      [index]: !state[index]
    }));
  };

  UNSAFE_componentWillMount() {
    /* Open collapse element that matches current url */
    const pathName = this.props.location.pathname;

    routes.forEach((route, index) => {
      const isActive = pathName.indexOf(route.path) === 0 && route.id !== 'Helpers';
      const isOpen = pathName.indexOf(route.path) > -1 && route.id !== 'Helpers';
      const isHome = route.containsHome && pathName === "/" ? true : false;

      this.setState(() => ({
        [index]: isActive || isOpen || isHome
      }));
    });
  }


  render() {

    const { classes, staticContext, functionHanldeOpen, ...other } = this.props;


    return (
      <Drawer variant="permanent" {...other}>

        <Scrollbar>
          <div style={{ marginLeft: '36px', marginBottom: '10px', marginTop: '13px', color: 'white', fontSize: '26px', display: 'flex', flexDirection: 'row' }}>
            <img src={require('../assets/Logomain.png')} style={{ width: '70%' }} />
          </div>
          <List disablePadding>
            <Items>
              {routes.map((category, index) =>
              (

                <div>

                  <>
                    {(index == 3 || index == 6) ? <Divider my={6} light="true" /> : null}

                    {category.name == 'CreatePlayList' ?
                      (
                        <React.Fragment key={index}>

                          {/* <SidebarCategory
                            isCollapsable={false}
                            name={category.id}
                            to={category.path}
                            onClick={() => this.props.functionHanldeOpen}
                            activeClassName={category.path !== '#' ? 'active' : ''}
                            // component={NavLink}
                            icon={category.icon}
                            exact
                            badge={category.badge}
                          /> */}

                          <Button style={{ color: 'white', width: '100%', }} onClick={this.props.functionHanldeOpen}>
                            <Flag style={{ marginRight: '16px', marginLeft: '-78px' }} src={category.icon} alt="Devices" />
                            Tạo playlist</Button>

                        </React.Fragment>
                      )
                      : (
                        <React.Fragment key={index}>
                          <SidebarCategory
                            isCollapsable={false}
                            name={category.id}
                            to={category.path}
                            onClick={() => this.redirectLink(category.path)}
                            activeClassName={category.path !== '#' ? 'active' : ''}
                            component={NavLink}
                            icon={category.icon}
                            exact
                            badge={category.badge}
                          />

                        </React.Fragment>
                      )
                    }


                  </>
                </div>
              )
              )
              }
            </Items>
          </List>
        </Scrollbar>
        <SidebarFooter>
          <Grid container spacing={2}>
            <React.Fragment >
              <div >
                <a href="https://www.google.cm"> <img src={require('../assets/vip.png')} style={{ width: '235px' }} /></a>
              </div>
            </React.Fragment>
            <React.Fragment >

              <SidebarCategory
                isCollapsable={false}
                name='Tải xuống'
                to=''
                onClick={() => this.redirectLinkInstall('https://www.google.cm')}
                component={NavLink}
                icon={require("../assets/icon/download.png")}
                exact
              />


            </React.Fragment>
          </Grid>
        </SidebarFooter>
      </Drawer >
    );
  }
}

export default withRouter(Sidebar);
