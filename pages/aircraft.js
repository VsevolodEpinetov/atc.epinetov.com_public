/*eslint-disable*/
import React from "react";
import Image from 'next/image'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import Footer from "components/Footer/Footer.js";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";

import Box from '@material-ui/core/Box';
import Close from "@material-ui/icons/Close";
import { getAllAircraftData } from 'lib/aircraft'

import { rankSpeed, colorForSpeed, getWeightStats, rankCeiling, colorForCeiling } from 'lib/utility'

import style from "assets/jss/nextjs-material-kit-pro/pages/aircraftPageStyle.js";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);

export default function AircraftPage({ allAircraftData }) {
  //const [modals, setModalsState] = React.useState({});
  const [modals, setModalsState] = React.useState(() => {
    var object = {};
    allAircraftData.forEach(({ aircraftName }) => {
      object[aircraftName] = false;
    })
    return object;
  });
  const [aircraftThumbnailIsShown, setAircraftThumbnailIsShown] = React.useState(() => {
    var object = {};
    allAircraftData.forEach(({ aircraftName }) => {
      object[aircraftName] = 'block';
    })
    return object;
  });
  const [filterByWeightState, setFilterByWeightState] = React.useState("");
  const [filterByNameState, setFilterByNameState] = React.useState("");

  function openModal(aircraft) {
    setModalsState((prevState) => ({ ...prevState, [aircraft]: true }));
  }
  function closeModal(aircraft) {
    setModalsState((prevState) => ({ ...prevState, [aircraft]: false }));
  }

  function showAircraftThumbnail(aircraft) {
    setAircraftThumbnailIsShown((prevState) => ({ ...prevState, [aircraft]: '' }));
  }
  function hideAircraftThumbnail(aircraft) {
    setAircraftThumbnailIsShown((prevState) => ({ ...prevState, [aircraft]: 'filtered' }));
  }

  const filterAircraftByWeight = event => {
    setFilterByWeightState(event.target.value);
    handleAircraftFilters(event.target.value, filterByNameState);
  };

  const filterAircraftByName = event => {
    setFilterByNameState(event.target.value.toLowerCase());
    handleAircraftFilters(filterByWeightState, event.target.value.toLowerCase());
  };


  function handleAircraftFilters(weightType, searchString) {
    allAircraftData.forEach(aircraft => {
      let needToHide = false;
      if (searchString.length >= 2) {
        if (aircraft.aircraftInfo.name.plain.toLowerCase().includes(searchString)) {
          switch (weightType) {
            case 'heavy':
              if (aircraft.aircraftInfo.specs.maxTakeOffWeight.kg < 136000) needToHide = true;
              break;
            case 'medium':
              if (aircraft.aircraftInfo.specs.maxTakeOffWeight.kg > 136000) needToHide = true;
              break;
          }
        } else {
          needToHide = true;
        }
      } else {
        switch (weightType) {
          case 'heavy':
            if (aircraft.aircraftInfo.specs.maxTakeOffWeight.kg < 136000) needToHide = true;
            break;
          case 'medium':
            if (aircraft.aircraftInfo.specs.maxTakeOffWeight.kg > 136000) needToHide = true;
            break;
        }
      }

      if (needToHide) hideAircraftThumbnail(aircraft.aircraftName)
      else showAircraftThumbnail(aircraft.aircraftName)
    })

  }

  const classes = useStyles();

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
            >
              <h2 className={classes.title}>Воздушные суда</h2>
              <h5 className={classes.description}>
                Список наиболее часто встречающихся при ОВД воздушных судов. На страничке каждого ВС имеются ранги некоторых характеристик. Очень важно понимать, что значения характеристик (а значит, и баллов) - это частные случаи, которые можно ожидать от ВС в большинстве случаев. На практике все значения зависят от состояния ВС, экипажа, погоды, времени года и прочих факторов. Список будет полезен в основном тем, кто очень плохо разбирается в ВС и с чем их едят :)
              </h5>
              <h5 className={classes.description}>
                Информация взята с различных источников: от <a href="https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D0%B7%D0%B4%D1%83%D1%88%D0%BD%D0%BE%D0%B5_%D1%81%D1%83%D0%B4%D0%BD%D0%BE">Википедии</a> до знаний опытных диспетчеров
              </h5>
            </GridItem>
            <GridItem
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto}
              style={{ marginBottom: '3em !important' }}
            >
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="filter-by-weight"
                  className={classes.selectLabel}
                >
                  По весу
                </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={filterByWeightState}
                  onChange={filterAircraftByWeight}
                  inputProps={{
                    name: "filterByWeightState",
                    id: "filter-by-wight"
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    По весу
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="all"
                  >
                    Все
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="medium"
                  >
                    Средние
                  </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="heavy"
                  >
                    Тяжёлые
                  </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto}
              style={{ marginBottom: '3em !important' }}
            >
              <CustomInput
                inputRootCustomClasses={classes.inputRootCustomClasses}
                formControlProps={{
                  className: classes.formControl
                }}
                inputProps={{
                  placeholder: "Фильтр по названию",
                  inputProps: {
                    "aria-label": "Поиск",
                    className: classes.searchInput
                  }
                }}
                value={filterByWeightState}
                onChange={filterAircraftByName}
                fullWidth
              />
            </GridItem>
            { 
              allAircraftData.map(({ aircraftName, aircraftInfo }) => (
                <GridItem xs={12} sm={6} md={3} key={`${aircraftName}`} className={aircraftThumbnailIsShown[aircraftName]}>
                  <GridContainer onClick={() => openModal(aircraftName)}>
                    <GridItem md={12}>
                      <Box
                        color="black"
                        backgroundсolor="rgba(255, 255, 255, 0)"
                      >
                        <Image
                          placeholder='blur'
                          src={`https://storage.googleapis.com/atc.epinetov.com/public/aircraft/${aircraftName}/thumbnail.webp`}
                          alt={aircraftInfo.name.plain}
                          className={'cursor-pointer'}
                          width="290px"
                          height="220px"
                        />
                      </Box>
                    </GridItem>
                    <GridItem style={{ cursor: "pointer" }}>
                      <h3>{aircraftInfo.name.plain}</h3>
                      <p>{aircraftInfo.specs.engines.quantity} двигателя <br /> <span className={classes[`${getWeightStats(aircraftInfo.specs.maxTakeOffWeight.kg).color}Text`]}>{getWeightStats(aircraftInfo.specs.maxTakeOffWeight.kg).rus}</span></p>
                    </GridItem>
                  </GridContainer>
                  <Dialog
                    scroll="paper"
                    open={modals[aircraftName]}
                    TransitionComponent={Transition}
                    maxWidth='md'
                    onClose={() => closeModal(aircraftName)}
                    aria-labelledby={`aircraft-${aircraftName}-slide-title`}
                    aria-describedby={`aircraft-${aircraftName}-slide-description`}
                  >
                    <DialogTitle id="scroll-dialog-title">
                      {aircraftInfo.name.plain}
                    </DialogTitle>
                    <DialogContent
                      id={`aircraft-${aircraftName}-modal-description`}
                      className={classes.modalBody}
                      dividers
                    >
                      <DialogContentText
                        id={`scroll-dialog-${aircraftName}-description`}
                        component='span'
                      >
                        <GridContainer>
                          <GridItem md={12} className={classes.imageHolder}>
                            <Image
                              placeholder='blur'
                              src={`https://storage.googleapis.com/atc.epinetov.com/public/aircraft/${aircraftName}/main.webp`}
                              alt={aircraftInfo.name.plain}
                              style={{ display: "block", cursor: "pointer", opacity: "0" }}
                              width="900px"
                              height="600px"
                            />
                          </GridItem>
                          <GridItem md={12}>
                            <h2 className={classes.title}>{aircraftInfo.name.plain}</h2>
                            <h3>Общее</h3>
                            <p>{aircraftInfo.commentary.summary}</p>
                            {
                              aircraftInfo.commentary.atc && (
                                <>
                                  <h3>Особенности при ОВД</h3>
                                  <p>{aircraftInfo.commentary.atc}</p>
                                </>
                              )
                            }
                            {
                              aircraftInfo.commentary.atcHtml && (
                                <>
                                  <h3>Особенности при ОВД</h3>
                                  <span dangerouslySetInnerHTML={{ __html: aircraftInfo.commentary.atcHtml }} />
                                </>
                              )
                            }
                            <br />
                            <p>Скорость: {rankSpeed(aircraftInfo.specs.speed.cruising.kmh)['10']}/10 ({aircraftInfo.specs.speed.cruising.kmh} км/ч)</p>
                            <CustomLinearProgress
                              variant="determinate"
                              color={colorForSpeed(aircraftInfo.specs.speed.cruising.kmh)}
                              value={rankSpeed(aircraftInfo.specs.speed.cruising.kmh)['100']}
                            />
                            <p>Потолок: {rankCeiling(aircraftInfo.specs.ceiling.fl)['10']}/10 (FL{aircraftInfo.specs.ceiling.fl})</p>
                            <CustomLinearProgress
                              variant="determinate"
                              color={colorForCeiling(aircraftInfo.specs.ceiling.fl)}
                              value={rankCeiling(aircraftInfo.specs.ceiling.fl)['100']}
                            />
                            <Button color="white" justIcon href={aircraftInfo.links.wiki}>
                              <i className="fab fa-wikipedia-w" />
                            </Button>
                          </GridItem>
                        </GridContainer>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions
                      className={
                        classes.modalFooter + " " + classes.modalFooterCenter
                      }
                    >
                      <Button
                        onClick={() => closeModal(aircraftName)}
                        color="info"
                        round
                      >
                        Закрыть
                        </Button>
                    </DialogActions>
                  </Dialog>
                </GridItem>
              ))
            }
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const allAircraftData = getAllAircraftData()
  return {
    props: {
      allAircraftData
    }
  }
}