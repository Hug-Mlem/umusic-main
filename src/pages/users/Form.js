import React, { useState, useEffect } from "react";
import request from 'request-promise'
import styled from "styled-components";
import { withFirebase } from "../../Firebase";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
import countryList from 'react-select-country-list'
import queryString from 'query-string';
import JSAlert from 'js-alert';
import {postApi, urlApi} from "../../pages/api/config.js";
import md5 from 'md5';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import {
    Avatar,
    Button,
    Card as MuiCard,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormLabel,
    Divider as MuiDivider,
    FormControl as MuiFormControl,
    Grid,
    Input,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    InputLabel,
    Typography,
    TextareaAutosize,
    Select as MuiSelect,
    MenuItem
} from "@material-ui/core";

import { CloudUpload as MuiCloudUpload } from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const CloudUpload = styled(MuiCloudUpload)(spacing);

const Select = styled(MuiSelect)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing(2)}px;
`;

const SaveButton = styled(Button)`
  color:white;
  padding-left:40px;
  padding-right:40px;
`;

const CancelButton = styled(Button)`
  background: #3fa0ce;
  color:white;
  padding-left:35px;
  padding-right:35px;
`;

const countryoptions = countryList().getData()

function LeftForm({firebase, location}) {

    let params = queryString.parse(location.search)
    const [userid, setUserid] = useState(params.query)
    const [loading, setloading] = useState(false)
    const [user, setUser] = useState({
        fullname: '', status:'Active', username: '', password: ''
    })

    const onChange = event => setUser({ ...user, [event.target.name]: event.target.value})
    const onCheckBox = event => setUser({ ...user, [event.target.name]: event.target.checked});
    const onclickRedirect = async e => {
        window.location.href = '/users/list';
    }
    const onSubmit = async e => {
        setloading(true)
        e.preventDefault();
        user.password = md5(user.password)
        user.balance = 0
        const url = urlApi()+'/InsertUser'
        const result = await postApi(url,{user:user});
        setloading(false)
        if(result.success) {
            window.location.href = '/users/list';
        } else {
            JSAlert.alert('<code>'+result.message+'</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    }
    const isInvalid = user.password === "" || user.username === "" || user.username === "";
    return (
        <Card mb={6}>
            <CardContent>
                { loading ? <div className="waitting">
                    <Loader type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100} />
                </div> : ''}
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Họ và tên</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="fullname" id="name" value={user.fullname} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Phone Number</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="username" id="name" value={user.username} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Password</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="password" type="password" id="password" value={user.password} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={8}>
                    </Grid>
                    <Grid item md={2}>
                        <CancelButton variant="contained" onClick={onclickRedirect}>
                            Cancel
                        </CancelButton>
                    </Grid>
                    <Grid item md={2}>
                        <SaveButton variant="contained" color="primary" onClick={onSubmit}  disabled={isInvalid}>
                            Save
                        </SaveButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function Settings({firebase, location} ) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Customer Settings
            </Typography>

            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <LeftForm firebase={firebase} location={location}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const SettingComponent = compose(
    withRouter,
    // withFirebase
)(Settings);

export default SettingComponent;
