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

import {
    Add as AddIcon, TrainRounded
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";

import Moment from 'react-moment';

import { permissionServices, permissionList } from "./UserUtils"
import "./users.css"

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
    const token = userArr.token
    const [loading, setLoading] = useState(true)
    const [username, setsearch] = useState(params.username)
    const [modal, setModal] = useState("modal hide")
    const [permissions, setPermissions] = useState([])
    const [userId, setUserId] = useState("")
    const [checkAll, setCheckAll] = useState(false)
    useEffect(() => {
        showData()
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
            <div className={modal}>
                <div className="modal-dialog modal-dialog-centered" role="dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Xác nhận thanh toán</h5>
                            <button type="button" className="close" data-dismiss="modal" onClick={closeModal}
                                aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox
                                                checked={checkAll}
                                                onChange={handleChangeCheckAll}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">STT</TableCell>
                                        <TableCell className="text-center">Tên dịch vụ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {permissionServices.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={permissions && permissions.includes(item.key)}
                                                    onChange={() => handleChangeCheckBox(item.key)}
                                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">{index + 1}</TableCell>
                                            <TableCell className="text-center">{item.label}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>Huỷ</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleUpdatePermissions}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
            <Card mb={6}>

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>FullName</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>User bảo hành service</TableCell>
                                <TableCell>User bảo hành tự động</TableCell>
                                <TableCell>Balance</TableCell>
                                <TableCell>Date Create</TableCell>
                                <TableCell>Xử lý</TableCell>
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
                                        <TableCell align="left">{index + 1}</TableCell>
                                        <TableCell align="left">{row.fullname}</TableCell>
                                        <TableCell align="left">{row.username}</TableCell>
                                        <TableCell align="left">{parseInt(row.balance).toLocaleString()}</TableCell>
                                        <TableCell align="left">{row.created_date}</TableCell>
                                        <TableCell align="left">
                                            {row.status && row.status === 'Pause' ?
                                                <a className="btn btn-primary" color="primary" onClick={() => handleUpdateStatus('Active', row, "")} style={{ "width": "150px" }}>
                                                    Kích hoạt
                                                </a> : ''
                                            }

                                            {!row.status || row.status === 'Active' ?
                                                <a className="btn btn-danger" color="primary" onClick={() => handleUpdateStatus('Pause', row, "")} style={{ "width": "150px" }}>
                                                    Tạm dừng
                                                </a> : ''
                                            }
                                            <a className="btn btn-primary" color="secondary" onClick={() => handleAgency(row)} style={{ "width": "150px" }}>
                                                Kích hoạt đại lý
                                            </a>
                                            {row.is_warranty != true ?
                                                <a className="btn btn-primary" color="secondary" onClick={() => handleUpdateStatus(2, row, "")} style={{ "width": "150px" }}>
                                                    Kích hoạt bảo hành
                                                </a>
                                                :
                                                <a className="btn btn-primary" color="secondary" onClick={() => handleUpdateStatus(1, row, "")} style={{ "width": "150px" }}>
                                                    Tạm dừng bảo hành
                                                </a>
                                            }
                                            {row.is_warranty_auto != true ?
                                                <a className="btn btn-primary" color="secondary" onClick={() => handleUpdateStatus(2, row, "auto")} style={{ "width": "150px" }}>
                                                    Kích hoạt BH tự động
                                                </a>
                                                :
                                                <a className="btn btn-primary" color="secondary" onClick={() => handleUpdateStatus(1, row, "auto")} style={{ "width": "150px" }}>
                                                    Tạm dừng BH tự động
                                                </a>
                                            }
                                            <a className="btn btn-primary" color="secondary" onClick={() => handleHistory(row)} style={{ "width": "150px" }}>
                                                Lịch sử
                                            </a>
                                            <a className="btn btn-primary" color="secondary" onClick={() => showModal(row)} style={{ "width": "150px" }}>
                                                Phân quyền gói
                                            </a>
                                            <a className="btn btn-danger" color="secondary" onClick={() => handleDelete(row)} style={{ "width": "150px" }}>
                                                Delete
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    {total >= limit ? <a className="btn btn-primary LoadMore" color="secondary" onClick={() => LoadMore()}>Load more</a> : ''}
                </Paper>
            </Card>
        </>
    );
}

function UsersList({ history, location, firebase }) {
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

    const Submit = () => {
        window.location.href = '/users/list?username=' + textSearch
    }
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                users
            </Typography>

            <div style={{ float: 'right' }}>
                <Button mr={2} variant="contained" color="primary" onClick={gotoAdd}>
                    <AddIcon />
                    Add User
                </Button>
            </div>
            <div className="boxSearch" style={{ "margin-top": "20px" }}>
                <input type="text" className="form-control" id="textSeacrh" value={textSearch} onChange={onChange} />
                <a onClick={Submit} className="btn btn-primary">Search</a>
            </div>
            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <UsersTable history={history} firebase={firebase} location={location} />
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
