/*eslint-disable*/
import React from "react";
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Switch from "@material-ui/core/Switch";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import TextField from '@material-ui/core/TextField';

import Add from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import Pageview from "@material-ui/icons/Pageview";

import postsPageStyle from "assets/jss/nextjs-material-kit-pro/pages/postsPageStyle.js";

const useStyles = makeStyles(postsPageStyle);

export default function calculatorPage() {
  const classes = useStyles();
  const [checkedA, setCheckedA] = React.useState(true);


  return (
    <div>
      <Header
        links={<HeaderLinks dropdownHoverColor="dark" />}
        color="transparent"
      />
      <div className={classes.projects}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem
              md={12}
              className={classes.mlAuto + " " + classes.mrAuto}
              style={{ marginBottom: '3em !important' }}
              key='posts-header'
            >
              <h2 className={classes.title}>Калькулятор времени</h2>
              <h5 className={classes.description}>
                Туц туц
              </h5>
            </GridItem>
            <GridItem
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto}
              key='controllers-body'
            >
              <GridContainer>
                <GridItem md={12}>
                  <h5>
                    Настройки Диспетчеров
                  </h5>
                </GridItem>
                <GridItem md={12}>
                <TextField 
                    id="standard-basic" 
                    label="Диспетчер 1" 
                    style={{marginTop: '-8px'}}
                  />
                  <Button color="twitter" round justIcon simple>
                    <Close className={classes.icons} />
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkedA}
                        onChange={event => setCheckedA(event.target.checked)}
                        value="checkedA"
                        classes={{
                          switchBase: classes.switchBase,
                          checked: classes.switchChecked,
                          thumb: classes.switchIcon,
                          track: classes.switchBar
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label="Toggle is on"
                  />
                </GridItem>
                <GridItem md={12}>
                  <Button color="success">
                    <Add className={classes.icons} /> Добавить диспетчера
                  </Button>
                </GridItem>
              </GridContainer>
            </GridItem>
            <GridItem
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto}
              key='sector-body'
            >
              <GridContainer>
                <GridItem md={12}>
                  <h5>
                    Настройки Сектора
                  </h5>
                </GridItem>
                <GridItem md={12}>
                  <TextField 
                    id="standard-basic" 
                    label="Диспетчер 1" 
                    style={{marginTop: '-8px'}}
                  />
                  <Button color="twitter" round justIcon simple>
                    <Close className={classes.icons} />
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={checkedA}
                        onChange={event => setCheckedA(event.target.checked)}
                        value="checkedA"
                        classes={{
                          switchBase: classes.switchBase,
                          checked: classes.switchChecked,
                          thumb: classes.switchIcon,
                          track: classes.switchBar
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                      root: classes.labelRoot
                    }}
                    label="Toggle is on"
                  />
                </GridItem>
                <GridItem md={12}>
                  <Button color="success">
                    <Add className={classes.icons} /> Добавить диспетчера
                  </Button>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}