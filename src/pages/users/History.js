import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { Link, withRouter } from 'react-router-dom';
import { compose } from "recompose";
import { withFirebase } from "../../Firebase";
import {postApi, urlApi, urlApiNewPublic, postApiNew, urlList} from "../api/config.js";
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
    Typography
} from "@material-ui/core";

import {
    Add as AddIcon
} from "@material-ui/icons";

import { spacing } from "@material-ui/system";

import Moment from 'react-moment';
Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';
const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Button = styled(MuiButton)(spacing);
// Data
let id = 1;

const limit = 500
function UsersTable({history, firebase, location}) {
    let params = queryString.parse(location.search)
    const [allUsers, setAllUsers] = useState(null)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [total, setTotal] = useState(0)
    const [offset, setOffset] = useState("")
    const users = localStorage.getItem('users')
    const userArr = JSON.parse(users)
    const token = userArr.token
    const [loading, setLoading] = useState(true)
    const [user_token, setToken] = useState(params.token)
    useEffect(() => {
        showData()
    }, [])

    const showData = async () => {
        const url = urlList().URL_USER.HISTORY
        const data = {limit:limit, token:token,  user_token:user_token}
        const result = await postApiNew('POST', url, data)
        if(result.data.data) {
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

    const getCode = (data) => {
        switch (data.type) {
            case "purchase":
                return data.service.service_code.join(", ")
            case "gift":
                return data.gift.code
            case "recharge":
                return data.transaction.code
            case "refund":
                return data.service.service_code.join(", ") 
            default:
                return ""
        }
    }

    const getPrice = (data) => {
        switch (data.type) {
            case "purchase":
                return data.service.price
                case "gift":
                return data.gift.value
                case "recharge":
                return data.transaction.value
                case "refund":
                return data.service.price
            default:
                return 0
        }
    }

    const getNumber = (data) => {
        if (data.type === "purchase" || data.type === "refund") {
            return data?.service?.number ?? 0
        }
        if (data.type === "gift" || data.type === "recharge") {
            return 1
        }
        return 0
    }

    const LoadMore = async () => {
        const url = urlList().URL_USER.HISTORY
        const data = {limit:limit, token:token, user_token:user_token, offset:offset}
        const result = await postApiNew('POST', url, data)
        const dataArr = []
        for (const [key, value] of Object.entries(allUsers)) { 
            dataArr.push(value)
        }
        if(result.data && result.data.data) {
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
        <Card mb={6}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>THỜI GIAN TẠO</TableCell>
                            <TableCell>MÃ CODE</TableCell>
                            <TableCell>SỐ LƯỢNG</TableCell>
                            <TableCell>ĐƠN GIÁ</TableCell>
                            <TableCell>THÀNH TIỀN</TableCell>
                            <TableCell>LOẠI</TableCell>
                            <TableCell>SỐ DƯ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { loadingDelete ? <div className="waitting">
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
                                <TableCell align="left">{index+1}</TableCell>
                                <TableCell align="left">{row.created_date}</TableCell>
                                <TableCell align="left">{getCode(row)}</TableCell>
                                <TableCell align="left">{getNumber(row)}</TableCell>
                                <TableCell align="left">{getPrice(row)}</TableCell>
                                <TableCell align="left">{parseInt(row.value).toLocaleString()}</TableCell>
                                <TableCell align="left">{row.type}</TableCell>
                                <TableCell align="left">{parseInt(row.balance).toLocaleString()}</TableCell>
                                <TableCell align="left">{row.created_date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                { total >= limit ? <a className="btn btn-primary LoadMore" color="secondary"  onClick={() => LoadMore()}>Load more</a> : ''}
            </Paper>
        </Card>
    );
}

function UsersList({history, location, firebase}) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Lịch sử
            </Typography>
            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <UsersTable history={history} firebase={firebase} location={location}/>
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
