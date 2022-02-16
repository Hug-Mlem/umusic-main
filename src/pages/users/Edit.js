import React, { useState, useEffect } from "react";
import request from 'request-promise'
import styled from "styled-components";
import { withFirebase } from "../../Firebase";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import countryList from 'react-select-country-list'
import queryString from 'query-string';
// import randomToken from 'random-token';
import JSAlert from 'js-alert';
// import md5 from 'md5';
import { postApi, urlApi } from "../../pages/api/config.js";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import {
    Avatar,
    Button,
    Card as MuiCard,
    CardContent,
    // Dialog,
    // DialogActions,
    // DialogContent,
    // DialogContentText,
    // DialogTitle,
    FormLabel,
    Divider as MuiDivider,
    FormControl as MuiFormControl,
    Grid,
    Input,
    // Checkbox,
    Radio,
    RadioGroup,
    // FormControlLabel,
    // InputLabel,
    Typography,
    // TextareaAutosize,
    Select as MuiSelect,
    MenuItem
} from "@material-ui/core";

import { CloudUpload as MuiCloudUpload } from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

// const CloudUpload = styled(MuiCloudUpload)(spacing);

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

function LeftForm({ firebase, location }) {

    let params = queryString.parse(location.search)
    const [token, setToken] = useState(params.query)
    const [loading, setloading] = useState(true)
    const [userid, setUserid] = useState(0)
    const [user, setUser] = useState({
        fullname: '', status: 'Active', language: '', vpn_loading: '', debug_mode: 'production', TotalVM: '', MaxThreadNoxLD: '', OpenApkAfterNSeconds: '',
        clone_count: '1', resolution: '1', cpu: '1', ram: '512', force_update: '1',
        FacebookMobileCloneCount: '100', FacebookNoxCount: '25', FacebookNoxCloneCount: '5',
        FBLiteMobileCloneCount: '100', FBLiteNoxCount: '25', FBLiteNoxCloneCount: '5',
        InstagramMobileCloneCount: '100', InstagramNoxCount: '25', InstagramNoxCloneCount: '5',
        YouTobeMobileCloneCount: '100', YouTobeNoxCount: '25', YouTobeNoxCloneCount: '5',
        TwitterMobileCloneCount: '100', TwitterNoxCount: '25', TwitterNoxCloneCount: '5',
        ZaloMobileCloneCount: '100', ZaloNoxCount: '25', ZaloNoxCloneCount: '5',
    })

    useEffect(() => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/getUser',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({ token: token, page: 1 })
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                let dataView = []
                setloading(false)
                if (parsedBodyArr.result.data) {
                    for (const [key, value] of Object.entries(parsedBodyArr.result.data)) {
                        value.id = key
                        setUserid(key)
                        dataView = value
                    }
                    setUser(dataView)
                }
            })
    }, [])

    const onChange = event => setUser({ ...user, [event.target.name]: event.target.value })
    const onCheckBox = event => setUser({ ...user, [event.target.name]: event.target.checked });
    const onclickRedirect = async e => {
        window.location.href = '/users/list';
    }
    const onSubmit = async e => {
        e.preventDefault();
        setloading(true)
        if (user.resolution === 1) {
            user.height = 1080
            user.weight = 1920
            user.dpi = 480
        }
        if (user.resolution === 2) {
            user.height = 900
            user.weight = 1600
            user.dpi = 320
        }
        if (user.resolution === 3) {
            user.height = 720
            user.weight = 1280
            user.dpi = 320
        }
        if (user.resolution === 4) {
            user.height = 540
            user.weight = 960
            user.dpi = 240
        }
        user._id = userid
        const data = {
            user: user
        }
        const url = urlApi() + '/InsertUser'
        const result = await postApi(url, data);
        setloading(false)
        if (result.success) {
            window.location.href = '/users/list';
        } else {
            JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    }
    return (
        <Card mb={6}>
            <CardContent>
                {loading ? <div className="waitting">
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
                            <Input name="username" id="name" value={user.username} disabled />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Language</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <Select id="language" name="language" mt={4} value={user.language} onChange={onChange} style={{ width: '200px' }}>
                            <MenuItem key="1" value="vn">Việt Nam</MenuItem>
                            <MenuItem key="2" value="in">Indonesia</MenuItem>
                            <MenuItem key="3" value="en">England</MenuItem>
                            <MenuItem key="4" value="au">Australia</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>VPN Loading</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="vpn_loading" id="vpn_loading" value={user.vpn_loading} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Debug mode</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <Select id="debug_mode" name="debug_mode" mt={4} value={user.debug_mode} onChange={onChange} style={{ width: '200px' }}>
                            <MenuItem key="1" value="test">Test</MenuItem>
                            <MenuItem key="2" value="production">Production</MenuItem>
                            <MenuItem key="3" value="training">Indonesia</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Total Nox/LD Player</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="TotalVM" id="TotalVM" value={user.TotalVM} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Max Thread</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="MaxThreadNoxLD" id="MaxThreadNoxLD" value={user.MaxThreadNoxLD} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Open Apk After</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="OpenApkAfterNSeconds" id="OpenApkAfterNSeconds" value={user.OpenApkAfterNSeconds} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Apk Number</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="clone_count" id="clone_count" value={user.clone_count} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Nox/LD config</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Resolution</FormLabel>
                            <RadioGroup defaultValue="resolution" aria-label="resolution" name="resolution" value={user.resolution} onChange={onChange}>
                                <Radio value="1" label="1080x1920 (dpi 480)" /> 1080x1920 (dpi 480)
                                <Radio value="2" label="900x1600 (dpi 320)" /> 900x1600 (dpi 320)
                                <Radio value="3" label="720x1280 (dpi 320)" /> 720x1280 (dpi 320)
                                <Radio value="4" label=" 540x960 (dpi 240)" /> 540x960 (dpi 240)
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>CPU</FormLabel>
                        <Select displayEmpty id="cpu" name="cpu" mt={4} value={user.cpu} onChange={onChange} style={{ width: '100px' }}>
                            <MenuItem key="1" value="1">1 cores</MenuItem>
                            <MenuItem key="2" value="2">2 cores</MenuItem>
                            <MenuItem key="3" value="3">3 cores</MenuItem>
                            <MenuItem key="4" value="4">4 cores</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>RAM</FormLabel>
                        <Select displayEmpty id="ram" name="ram" mt={4} value={user.ram} onChange={onChange} style={{ width: '100px' }}>
                            <MenuItem value="512">Test</MenuItem>
                            <MenuItem key="1" value="512">512M</MenuItem>
                            <MenuItem key="1" value="768">768M</MenuItem>
                            <MenuItem key="2" value="1024">1024M</MenuItem>
                            <MenuItem key="3" value="1536">1536M</MenuItem>
                            <MenuItem key="4" value="2048">2048M</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Force update/re-install</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <input type="checkbox" name="force_update" checked={user.force_update} onChange={onCheckBox} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Facebook</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookMobileCloneCount" id="FacebookMobileCloneCount" value={user.FacebookMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookNoxCount" id="FacebookNoxCount" value={user.FacebookNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookNoxCloneCount" id="FacebookNoxCloneCount" value={user.FacebookNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Facebook</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookMobileCloneCount" id="FacebookMobileCloneCount" value={user.FacebookMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookNoxCount" id="FacebookNoxCount" value={user.FacebookNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FacebookNoxCloneCount" id="FacebookNoxCloneCount" value={user.FacebookNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>FB Lite</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FBLiteMobileCloneCount" id="FBLiteMobileCloneCount" value={user.FBLiteMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FBLiteNoxCount" id="FBLiteNoxCount" value={user.FBLiteNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="FBLiteNoxCloneCount" id="FBLiteNoxCloneCount" value={user.FBLiteNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Instagram</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="InstagramMobileCloneCount" id="InstagramMobileCloneCount" value={user.InstagramMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="InstagramNoxCount" id="InstagramNoxCount" value={user.InstagramNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="InstagramNoxCloneCount" id="InstagramNoxCloneCount" value={user.InstagramNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>YouTobe</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="YouTobeMobileCloneCount" id="YouTobeMobileCloneCount" value={user.YouTobeMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="YouTobeNoxCount" id="YouTobeNoxCount" value={user.YouTobeNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="YouTobeNoxCloneCount" id="YouTobeNoxCloneCount" value={user.YouTobeNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Twitter</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="TwitterMobileCloneCount" id="TwitterMobileCloneCount" value={user.TwitterMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="TwitterNoxCount" id="TwitterNoxCount" value={user.TwitterNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="TwitterNoxCloneCount" id="TwitterNoxCloneCount" value={user.TwitterNoxCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Zalo</FormLabel>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Mobile Clone Count</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="ZaloMobileCloneCount" id="ZaloMobileCloneCount" value={user.ZaloMobileCloneCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="ZaloNoxCount" id="ZaloNoxCount" value={user.ZaloNoxCount} onChange={onChange} />
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormLabel>Simulator Clone</FormLabel>
                        <FormControl fullWidth mb={3}>
                            <Input name="ZaloNoxCloneCount" id="ZaloNoxCloneCount" value={user.ZaloNoxCloneCount} onChange={onChange} />
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
                        <SaveButton variant="contained" color="primary" onClick={onSubmit} >
                            Save
                        </SaveButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function Settings({ firebase, location }) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Customer Settings
            </Typography>

            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <LeftForm firebase={firebase} location={location} />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const SettingComponent = compose(
    withRouter,
    withFirebase
)(Settings);

export default SettingComponent;
