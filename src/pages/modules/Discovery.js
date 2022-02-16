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
import './style.css';
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

    const letPlay = async () => {
        await setPlay(!play);
    }
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



    return (
        <>
            <div className="cardContainer">
                <div className="titleList">
                    <div style={{ color: 'white', fontSize: '2.3rem', fontWeight: '700', float: 'left', marginTop: '-10px' }}>
                        Gần đây
                    </div>
                    <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', float: 'right' }}>
                        <a href="https://www.google.cm"> Tất cả </a>
                    </div>
                </div>
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
                                <button className="cardProductBtnPlay" onClick={letPlay}>{!play ? <img src={require('../../assets/play.png')} className="cardProductImgPlay" /> : <img src={require('../../assets/pause.png')} className="cardProductImgPlay" />}</button>
                                <img src={require('../../assets/more.png')} className="cardProductBtnMore" />
                            </div>
                        </div>
                        <div className="cardProductTitle" >
                            Born to Touch Your Feelings: Best of Rock Ballads is a compilation album by German rock band Scorpions a compilation album
                        </div>
                    </div>
                </div>

            </div>
            <div className="cardContainer">
                <div className="titleList">
                    <div style={{ color: 'white', fontSize: '2.3rem', fontWeight: '700', float: 'left', marginTop: '-10px' }}>
                        Gần đây
                    </div>
                    <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', float: 'right' }}>
                        <a href="https://www.google.cm"> Tất cả </a>
                    </div>
                </div>
                <div className="listCard" >
                    <div className="cardProduct" >
                        <div className="cardProductImgBtn">
                            <img src="https://picsum.photos/seed/picsum/200" className="cardProductImg" />
                            <div className="cardProductBtn">
                                <img src={require('../../assets/like.png')} className="cardProductBtnLike" />
                                <button className="cardProductBtnPlay" onClick={letPlay} >{!play ? <img src={require('../../assets/play.png')} className="cardProductImgPlay" /> : <img src={require('../../assets/pause.png')} className="cardProductImgPlay" />}</button>
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

            </div>
        </>

        // <Card mb={6}>
        //     <Paper>
        //         {loadingDelete ? <div className="waitting">
        //             <Loader type="Puff"
        //                 color="#00BFFF"
        //                 height={100}
        //                 width={100} />
        //         </div> : ''}
        //         {loading ? <Loader type="Puff"
        //             color="#00BFFF"
        //             height={100}
        //             width={100} /> : allUsers && allUsers.map((row, index) => (
        //                 <>
        //                     <TableRow key={index}>
        //                         <TableCell align="left">{index + 1}</TableCell>
        //                         <TableCell align="left">{row.fullname}</TableCell>
        //                         <TableCell align="left">{row.username}</TableCell>
        //                         <TableCell align="left">{parseInt(row.balance).toLocaleString()}</TableCell>
        //                         <TableCell align="left">{row.created_date}</TableCell>

        //                     </TableRow>
        //                 </>
        //             ))}
        //         {total >= limit ? <a className="btn btn-primary LoadMore" color="secondary" onClick={() => LoadMore()}>Load more</a> : ''}
        //     </Paper>
        // </Card>

    );
}

function UsersList({ history, location, firebase }) {

    let params = queryString.parse(location.search)
    const [textSearch, setTextSearch] = useState(params.username)

    return (
        <React.Fragment >
            {/* <Divider my={6} /> */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <UsersTable history={history} firebase={firebase} location={location} />
                </Grid>
            </Grid>

        </React.Fragment >
    );
}

const InvestListComponent = compose(
    withRouter,
    // withFirebase
)(UsersList);

export default InvestListComponent;

// export default UsersList;
