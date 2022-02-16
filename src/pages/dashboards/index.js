import React, { useState, useEffect } from "react";
import styled, { withTheme } from "styled-components";

import { withFirebase } from "../../Firebase";



import {
  Avatar as MuiAvatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import { green, red, orange } from "@material-ui/core/colors";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${props => props.theme.palette.grey[300]};
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const Avatar = styled(MuiAvatar)`
  height: 28px;
  width: 28px;
  display: inline-block;
  margin-right: ${props => props.theme.spacing(2)}px;
`;

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${props => props.rgbcolor};
  color: ${props => props.theme.palette.common.white};
  margin-bottom: ${props => props.theme.spacing(4)}px;
`;

function Project({ image, title, description, chip }) {
  return (
    <Card mb={6}>
      {image ? <CardMedia image={image} title="Contemplative Reptile" /> : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>

        {chip}

        <Typography mb={4} component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Learn More
        </Button>
        <Button size="small" color="primary">
          Invest
        </Button>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

function Default({ firebase, theme }) {
  let offerRef = firebase.firestore.collection('offer')
  const [allOffers, setAllOffers] = useState(null)
  const offercolumn = new Array()
  const users = localStorage.getItem('users')
  let fullname = ''
  if (users) {
    const userArr = JSON.parse(users)
    fullname = userArr.fullname
  }

  return (
    <React.Fragment>
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" display="inline">
            Welcome back, {fullname}
          </Typography>
          <Typography variant="body2" ml={2} display="inline">
            {new Date().toLocaleString()}
          </Typography>
        </Grid>

      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        {allOffers && allOffers.map(row => (
          <Grid item xs={12} lg={6} xl={3} key={row.id}>
            <Project
              title={row.company}
              description={row.card}
              image={row.pitch}
            />
          </Grid>
        ))}

      </Grid>
    </React.Fragment>
  );
}

export default 
// withFirebase(
  withTheme(Default)
  // )
  ;
