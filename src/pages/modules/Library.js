import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, withRouter } from 'react-router-dom';
import { compose } from "recompose";
import { withFirebase } from "../../Firebase";
import { postApi, urlApi, urlApiNewPublic, postApiNew, urlList } from "../../pages/api/config.js";
import ReactPaginate from 'react-paginate';
import request from 'request-promise'
import JSAlert from 'js-alert';
import queryString from 'query-string';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import {
    Grid,
    Card as MuiCard,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Button as MuiButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Checkbox
} from "@material-ui/core";
import './stylePersonal.css';
import {
    Add as AddIcon, TrainRounded
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";

import Moment from 'react-moment';

import { permissionServices, permissionList } from "../users/UserUtils"
import "../users/users.css"

Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';
const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Button = styled(MuiButton)(spacing);
// Data
let id = 1;

const limit = 100
function UsersTable({ history, firebase, location }) {
    let params = queryString.parse(location.search)
    const [allUsers, setAllUsers] = useState(null)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [total, setTotal] = useState(0)
    const [offset, setOffset] = useState("")
    const users = localStorage.getItem('users')
    const userArr = JSON.parse(users)
    const token = 'c69fb47d-5bbf-11ec-8028-56000335e4d7'
    const [loading, setLoading] = useState(true)
    const [username, setsearch] = useState(params.username)
    const [modal, setModal] = useState("modal hide")
    const [permissions, setPermissions] = useState([])
    const [userId, setUserId] = useState("")
    const [checkAll, setCheckAll] = useState(false)
    const [play, setPlay] = useState(false)


    useEffect(() => {
        // showData()
    }, [])

    const showData = async () => {
        const url = urlList().URL_USER.ALL
        const data = { limit: limit, token: token, status: ['Active', 'Pause'], username: username }
        const result = await postApiNew('POST', url, data)
        if (result.data.data) {
            const dataView = []
            for (const [key, value] of Object.entries(result.data.data)) {
                dataView.push(value)
            }
            setAllUsers(dataView)
            setOffset(result.data.last_offset)
        }
        setTotal(result.data.total)
        setLoading(false)
    }
    const letPlay = () => {
        setPlay(!play)
    }
    const handleEdit = (row) => {
        history.push({
            pathname: '/users/edit',
            search: '?query=' + row.token
        });
    }

    const handleDelete = async (row) => {
        const url = urlList().URL_USER.DELETE
        const dataApi = { user_id: row.id, token: token }
        const result = await postApiNew('POST', url, dataApi)
        setLoadingDelete(false)
        if (result.code == 200) {
            const data = []
            allUsers.map((rowArr) => {
                if (row._id !== rowArr._id) {
                    data.push(rowArr)
                }
            })
            setAllUsers(data)
            JSAlert.alert('<code>Xóa thành công</code>', null, JSAlert.Icons.Success);
        } else {
            JSAlert.alert('<code>Xóa thất bại</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    };
    const handleAgency = async (row) => {
        const url = urlList().URL_AGENCY.CREATE
        const dataApi = { user_id: row.id, token: token }
        const result = await postApiNew('POST', url, dataApi)
        setLoadingDelete(false)
        if (result.code == 200) {
            JSAlert.alert('<code>Kích hoạt thành công</code>', null, JSAlert.Icons.Success);
        } else {
            JSAlert.alert('<code>Kích hoạt thất bại</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    };

    const handleUpdateStatus = async (status, row, type) => {
        const url = urlList().URL_USER.UPDATE
        let dataApi = { user_id: row.id, status: status, token: token }
        if (status == 1 || status == 2) {
            status = status == 2 ? true : false
            if (type == "auto") {
                dataApi = { user_id: row.id, is_warranty_auto: status, token: token }
            } else {
                dataApi = { user_id: row.id, is_warranty: status, token: token }
            }
        }
        const result = await postApiNew('POST', url, dataApi)
        setLoadingDelete(false)
        if (result.code == 200) {
            const data = [...allUsers]
            data.map((rowArr) => {
                if (row.id === rowArr.id) {
                    if (type == "auto") {
                        rowArr.is_warranty_auto = result.data.is_warranty_auto
                    } else {
                        rowArr.is_warranty = result.data.is_warranty
                    }
                }
            })
            setAllUsers(data)
            JSAlert.alert('<code>cập nhật thành công</code>', null, JSAlert.Icons.Success);
        } else {
            JSAlert.alert('<code>cập nhật thất bại</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    }
    const handleHistory = async (row) => {
        window.location.href = "/user/history?token=" + row.token
    };
    const showModal = async (row) => {
        setModal('modal show')
        setPermissions(row.is_permissions ? row?.permissions.sort() ?? [] : permissionList)
        setUserId(row?.id ?? "")
    }
    const closeModal = () => {
        setModal('modal hide')
    }
    const LoadMore = async () => {
        const url = urlList().URL_USER.ALL
        const data = { limit: limit, token: token, status: ['Active', 'Pause'], username: username, offset: offset }
        const result = await postApiNew('POST', url, data)
        const dataArr = []
        for (const [key, value] of Object.entries(allUsers)) {
            dataArr.push(value)
        }
        if (result.data && result.data.data) {
            for (const [key, value] of Object.entries(result.data.data)) {
                dataArr.push(value)
            }
            setOffset(result.data.last_offset)
        }
        setTotal(result.data.total)
        setAllUsers(dataArr)
        setLoading(false)
    }

    const handleChangeCheckAll = () => {
        if (!checkAll) {
            setPermissions(permissionList)
        } else {
            setPermissions([])
        }
        setCheckAll(!checkAll)
    }

    const handleChangeCheckBox = (permission) => {
        const newPermisions = [...permissions]
        const index = newPermisions.findIndex(item => item === permission)
        if (index === -1) {
            newPermisions.push(permission)
        } else {
            newPermisions.splice(index, 1)
        }
        setPermissions(newPermisions)
        setCheckAll(false)
    }

    const handleUpdatePermissions = async () => {
        const url = urlList().URL_USER.UPDATE_PERMISSIONS
        const dataApi = {
            user_id: userId,
            permission_users: permissions,
            token: token
        }
        const result = await postApiNew('POST', url, dataApi)

        if (result.code == 200) {
            JSAlert.alert('<code>Kích hoạt phân quyền thành công</code>', null, JSAlert.Icons.Success);
        } else {
            JSAlert.alert('<code>Kích hoạt phân quyền thất bại</code>', null, JSAlert.Icons.Failed);
            return false;
        }

        setModal('modal hide')
        showData()
    }

    return (
        <>
            <div style={{ width: '100%' }} >
                <button className="btnPlay" onClick={letPlay}>{!play ? <img src={require('../../assets/play.png')} className="imgPlay" /> : <img src={require('../../assets/pause.png')} className="imgPlay" />}</button>
                <Button
                    variant="contained"
                    style={{ borderRadius: '50rem', backgroundColor: 'orange', color: 'black', marginRight: '10px', float: 'right', zIndex: 1 }}
                    component={Link}
                    to="/sign-in"
                >
                    Mua Vip
                </Button>
            </div>

            <Card mb={6}>
                <Paper style={{ backgroundColor: '#121212' }}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'white', backgroundColor: '#121212' }}>#</TableCell>
                                <TableCell style={{ color: 'white', backgroundColor: '#121212' }}>Bài hát</TableCell>
                                <TableCell style={{ color: 'white', backgroundColor: '#121212' }}>Thời lượng</TableCell>
                                <TableCell style={{ color: 'white', backgroundColor: '#121212' }}>Tuỳ chọn</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingDelete ? <div className="waitting">
                                <Loader type="Puff"
                                    color="#00BFFF"
                                    height={100}
                                    width={100} />
                            </div> : ''}
                            {loading ? <Loader type="Puff"
                                color="#00BFFF"
                                height={100}
                                width={100} /> : allUsers && allUsers.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="left" style={{ color: 'white', backgroundColor: '#121212', borderBottom: '0px' }}>{index + 1}</TableCell>
                                        <TableCell align="left" style={{ color: 'white', backgroundColor: '#121212', borderBottom: '0px' }}>
                                            <div style={{ marginRight: '15px', height: '100%', display: 'flex', flexDirection: 'row' }}>
                                                <img src="https://picsum.photos/seed/picsum/200"
                                                    style={{ width: '30px', height: '30px', marginRight: '15px' }}
                                                />
                                                <div>
                                                    Yêu Một Người Gian Dối <br />
                                                    Như Việt
                                                </div>

                                            </div>


                                        </TableCell>
                                        <TableCell align="left" style={{ color: 'white', backgroundColor: '#121212', borderBottom: '0px' }}>04:05</TableCell>
                                        <TableCell align="left" style={{ color: 'white', backgroundColor: '#121212', borderBottom: '0px' }}>
                                            <img src={require('../../assets/lyrics.png')} className="cardProductBtnLike" />
                                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                                            <img src={require('../../assets/more.png')} className="cardProductBtnLike" />
                                        </TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    {total >= limit ? <a className="btn btn-primary LoadMore" color="secondary" style={{ backgroundColor: '#121212' }} onClick={() => LoadMore()}>Xem thêm</a> : ''}
                </Paper>
            </Card>
        </>
    );
}



function Playlist({ history, firebase, location }) {
    const [play, setPlay] = useState(false)

    useEffect(() => {
    }, [])

    const letPlay = () => {
        setPlay(!play)
    }

    return (
        <>
            <div className="listCard" >
                <div className="cardProductPlus" >

                    <img src={require('../../assets/plus.svg')} className="cardProductBtnPlus" />

                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>
                                {!play ? (<img src={require('../../assets/play.png')} className="cardProductImgPlay" />) : (<img src={require('../../assets/pause.png')} className="cardProductImgPlay" />)}
                            </button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>
                                {!play ? (<img src={require('../../assets/play.png')} className="cardProductImgPlay" />) : (<img src={require('../../assets/pause.png')} className="cardProductImgPlay" />)}
                            </button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>
                                {!play ? (<img src={require('../../assets/play.png')} className="cardProductImgPlay" />) : (<img src={require('../../assets/pause.png')} className="cardProductImgPlay" />)}
                            </button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>{!play ? <img src={require('../../assets/play.png')} className="cardProductImgPlay" /> : <img src={require('../../assets/pause.png')} className="cardProductImgPlay" />}</button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
            </div>
        </>
    );
}




function Artist({ history, firebase, location }) {
    const [play, setPlay] = useState(false)

    useEffect(() => {
    }, [])

    const letPlay = () => {
        setPlay(!play)
    }

    return (
        <>
            <div className="listCard" >

                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>
                                {!play ? (<img src={require('../../assets/play.png')} className="cardProductImgPlay" />) : (<img src={require('../../assets/pause.png')} className="cardProductImgPlay" />)}
                            </button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>
                                {!play ? (<img src={require('../../assets/play.png')} className="cardProductImgPlay" />) : (<img src={require('../../assets/pause.png')} className="cardProductImgPlay" />)}
                            </button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
                <div className="cardProduct" >
                    <div className="cardProductImgBtn">
                        <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                        <div className="cardProductBtn">
                            <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                            <button className="cardProductBtnPlay" onClick={letPlay}>{!play ? <img src={require('../../assets/play.png')} className="cardProductImgPlay" /> : <img src={require('../../assets/pause.png')} className="cardProductImgPlay" />}</button>
                            <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                        </div>
                    </div>
                    <div className="cardProductTitle" >
                        Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                    </div>
                </div>
            </div>
        </>
    );
}



function Album({ history, firebase, location }) {

    useEffect(() => {
    }, [])


    return (
        <>
            <div style={{ width: '100%', height: '400px', color: 'white', backgroundColor: '#373737', textAlign: 'center', }}>

                Không có Album trong thư viện nhạc cá nhân


            </div>
        </>
    );
}


function UsersList({ history, location, firebase }) {
    const width = window.innerWidth;
    const height = window.innerHeight
    const [switchPage, setSwitchPage] = useState(1);
    const gotoAdd = () => {
        history.push({
            pathname: '/users/form',
            search: ''
        });
    }

    let params = queryString.parse(location.search)
    const [textSearch, setTextSearch] = useState(params.username)

    const onChange = event => {
        setTextSearch(event.target.value)
    }

    const switchPages = (number) => {
        setSwitchPage(number);
    }

    const Submit = () => {
        window.location.href = '/users/list?username=' + textSearch
    }
    return (
        <React.Fragment>

            <div style={{
                width: '100%', height: 'auto', zIndex: 99, backgroundColor: '#282828', borderRadius: '50rem', display: 'flex', flexDirection: 'row',
                //  position: 'fixed' 
            }}>
                <div style={{ width: '5%' }}></div>

                <Button
                    className={switchPage == 1 ? "btnActivePages" : "btnSwitchPages"}
                    variant="contained"
                    onClick={() => switchPages(1)}
                >
                    Bài hát
                </Button>

                <Button
                    variant="contained"
                    className={switchPage == 2 ? "btnActivePages" : "btnSwitchPages"}
                    onClick={() => switchPages(2)}



                >
                    Playlist
                </Button>
                <Button
                    variant="contained"
                    className={switchPage == 3 ? "btnActivePages" : "btnSwitchPages"}

                    onClick={() => switchPages(3)}



                >
                    Nghệ sĩ
                </Button>
                <Button
                    variant="contained"
                    className={switchPage == 4 ? "btnActivePages" : "btnSwitchPages"}
                    onClick={() => switchPages(4)}

                >
                    Album
                </Button>
                <div style={{ width: '5%' }}></div>

            </div>
            <Divider my={5} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    {switchPage == 1 ? <UsersTable history={history} firebase={firebase} location={location} /> :
                        switchPage == 2 ? <Playlist history={history} firebase={firebase} location={location} /> :
                            switchPage == 3 ? <Artist history={history} firebase={firebase} location={location} /> :
                                switchPage == 4 ? <Album history={history} firebase={firebase} location={location} />
                                    : ''
                    }

                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const InvestListComponent = compose(
    withRouter,
    // withFirebase
)(UsersList);

export default InvestListComponent;

// export default UsersList;
