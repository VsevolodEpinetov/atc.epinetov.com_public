/*eslint-disable*/
import React from "react";
import Image from 'next/image'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import Box from '@material-ui/core/Box';
import Close from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getAllData } from 'lib/allData'

import style from "assets/jss/nextjs-material-kit-pro/pages/aircraftPageStyle.js";
import { red } from "@material-ui/core/colors";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(style);

const getWordForShownResults = (totalResults) => {
  let word = 'все результаты';
  if (totalResults > 10) word = `первые 10 результатов`
  return word;
}

const getPhraseForTotalResults = (totalResults) => {
  let phrase = 'Совпадение нашлось только в заголовке. В самом тексте совпадений нет.';
  if (totalResults) {
    phrase = `В тексте нашлось ${totalResults.length} совпадений. Ниже показаны `
    if (totalResults.length > 10) phrase += `10 из них.`; else phrase += `все совпадения`;
  }
  return phrase;
}

export default function AircraftPage({ allData }) {
  const searchRef = React.useRef(null)
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(false)
  const [results, setResults] = React.useState([])

  const searchEndpoint = (query) => `/api/search?q=${query}`

  const onChange = React.useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
    if (query.length) {
      fetch(searchEndpoint(query))
        .then(res => res.json())
        .then(res => {
          setResults(res)
        })
    } else {
      setResults([])
    }
  }, [])

  const onFocus = React.useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = React.useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])


  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  const [filterByWeightState, setFilterByWeightState] = React.useState("");
  const [filterByNameState, setFilterByNameState] = React.useState("");

  const filterAircraftByWeight = event => {
    setFilterByWeightState(event.target.value);
  };

  const filterAircraftByName = event => {
    setFilterByNameState(event.target.value.toLowerCase());
  };

  const classes = useStyles();

  const test = '1';

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
              <h2 className={classes.title}>Поиск по сайту</h2>
              <h5 className={classes.description}>
                См. заголовок
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
                value={query}
                onChange={onChange}
                onFocus={onFocus}
                fullWidth
              />
            </GridItem>
            <GridItem
              md={12}
              className={classes.mlAuto + " " + classes.mrAuto}
              style={{ marginBottom: '3em !important' }}
            >
              {
                results.results && results.results.map((result, id) => (
                  <Accordion expanded={expanded === `panel${id}`} onChange={handleChange(`panel${id}`)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${id}bh-content`}
                      id={`panel${id}bh-header`}
                    >
                      <p>{result.type}: {result.title}</p>
                    </AccordionSummary>
                    <AccordionDetails className={'accordion-root'}>
                      <p>{getPhraseForTotalResults(result.resultsInContents)}</p>
                      {result.resultsInContents && result.resultsInContents.map((resultInContents, id) => (
                        id <= 9 && <p className='search-content-result'>{resultInContents.stringBefore}<span style={{color: 'red'}}>{resultInContents.searchedFor}</span>{resultInContents.stringPast}</p>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              }
            </GridItem>
          </GridContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const allData = getAllData()
  return {
    props: {
      allData
    }
  }
}