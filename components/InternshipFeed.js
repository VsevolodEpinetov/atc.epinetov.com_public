import React, { useState } from "react";
import PropTypes from 'prop-types';

import { makeStyles } from "@material-ui/core/styles";

import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Tooltip from "@material-ui/core/Tooltip";

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Skeleton from "@material-ui/lab/Skeleton";

import { convertTimestampToDateInternship } from "../lib/date.js";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { firestore, auth } from "../lib/firebase.js";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";

import linearProgressInternshipStyle from "../assets/jss/nextjs-material-kit-pro/components/linearProgressInternshipStyle.js";
const useStylesLinearProgress = makeStyles(linearProgressInternshipStyle);

import style from "assets/jss/nextjs-material-kit-pro/pages/aircraftPageStyle.js";
const useStyles = makeStyles(style);


const materialsToRead = [
  [
    {
      name: 'Организационная структура МЦ АУВД',
      type: 'post',
      link: '/posts/matcc-structure'
    }
  ]
]



export default function InternshipFeed({ internshipInfo, historyPreliminary, historyWorking, historyNeighbours, historyTraining }) {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCurrentInternshipState = (info) => {
    let state = '';

    if (info.currentHoursPreliminary < info.totalHoursPreliminary)
      state = `Предварительная подготовка`
    else {
      state = `На рабочем месте. Задача №`

      let trainingTaskNumber = '0';
      switch (true) {
        case info.currentHoursTraining < 10:
          trainingTaskNumber = 1;
          break;
        case info.currentHoursTraining < 20:
          trainingTaskNumber = 2;
          break;
        case info.currentHoursTraining < 30:
          trainingTaskNumber = 3;
          break;
        default:
          trainingTaskNumber = 4;
          break;
      }
      state += trainingTaskNumber;
    }

    return state;
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <TableWithHours
          historyPreliminary={historyPreliminary}
          historyNeighbours={historyNeighbours}
          historyWorking={historyWorking}
          historyTraining={historyTraining}
          internshipInfo={internshipInfo}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        Текущий этап: {getCurrentInternshipState(internshipInfo)}
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Accordion expanded={expanded === `panel-internship-materials`} onChange={handleChange(`panel-internship-materials`)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-internship-materials-bh-content`}
            id={`panel-internship-materials-bh-header`}
          >
            Материалы для изучения
          </AccordionSummary>
          <AccordionDetails className={'accordion-root'}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <Card>
                  <CardBody>
                    <h4 className={classes.cardTitle}>ФП ИВП</h4>
                    <h6 className={classes.cardSubtitle}>Документ</h6>
                    <p>
                      Руководящий документ
                    </p>
                    <a
                      href="#pablo"
                      className={classes.cardLink}
                      onClick={e => e.preventDefault()}
                    >
                      Прочитать
                    </a>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <Card>
                  <CardBody>
                    <h4 className={classes.cardTitle}>ФАП 362</h4>
                    <h6 className={classes.cardSubtitle}>Документ</h6>
                    <p>
                      Руководящий документ
                    </p>
                    <a
                      href="#pablo"
                      className={classes.cardLink}
                      onClick={e => e.preventDefault()}
                    >
                      Прочитать
                    </a>
                  </CardBody>
                </Card>
              </GridItem>
            </GridContainer>
          </AccordionDetails>
        </Accordion>
      </GridItem>
    </GridContainer>
  )

}


function TableWithHours({ internshipInfo, historyPreliminary, historyWorking, historyNeighbours, historyTraining }) {

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.currentHours}</TableCell>
          <TableCell align="right">{row.restHours}</TableCell>
          <TableCell align="right">{row.totalHours}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  История
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата</TableCell>
                      <TableCell>Задачи</TableCell>
                      <TableCell align="right">Часы</TableCell>
                      <TableCell align="right">Всего часов</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.history.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.tasks}</TableCell>
                        <TableCell align="right">{historyRow.hours}</TableCell>
                        <TableCell align="right">
                          {historyRow.totalHours}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      name: PropTypes.string.isRequired,
      currentHours: PropTypes.number.isRequired,
      restHours: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          hours: PropTypes.number.isRequired,
          totalHours: PropTypes.number.isRequired,
          tasks: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ).isRequired,
      totalHours: PropTypes.number.isRequired,
    }).isRequired,
  };


  function createData(name, currentHours, restHours, totalHours, history) {
    return {
      name,
      currentHours,
      restHours,
      totalHours,
      history,
    };
  }

  let rows = [];
  let history = [];
  let currentHours = 0;

  let allCurrentHours = {
    preliminary: 0,
    working: 0,
    training: 0,
    neighbours: 0
  }

  historyPreliminary?.forEach(historyEntry => {
    currentHours += historyEntry.hours;
    history.push({ date: convertTimestampToDateInternship(historyEntry.when.seconds), hours: historyEntry.hours, totalHours: currentHours, tasks: historyEntry.tasks })
  })
  history = history.reverse();
  allCurrentHours.preliminary = currentHours;
  rows.push(createData('Предварительная', currentHours, internshipInfo.totalHoursPreliminary - currentHours, internshipInfo.totalHoursPreliminary, history))


  currentHours = 0;
  history = [];
  historyTraining?.forEach(historyEntry => {
    currentHours += historyEntry.hours;
    history.push({ date: convertTimestampToDateInternship(historyEntry.when.seconds), hours: historyEntry.hours, totalHours: currentHours, tasks: historyEntry.tasks })
  })
  history = history.reverse();
  allCurrentHours.training = currentHours;
  rows.push(createData('Тренажёры', currentHours, internshipInfo.totalHoursTraining - currentHours, internshipInfo.totalHoursTraining, history))

  currentHours = 0;
  history = [];
  historyNeighbours?.forEach(historyEntry => {
    currentHours += historyEntry.hours;
    history.push({ date: convertTimestampToDateInternship(historyEntry.when.seconds), hours: historyEntry.hours, totalHours: currentHours, tasks: historyEntry.tasks })
  })
  history = history.reverse();
  allCurrentHours.neighbours = currentHours;
  rows.push(createData('Соседи', currentHours, internshipInfo.totalHoursNeighbours - currentHours, internshipInfo.totalHoursNeighbours, history))

  currentHours = 0;
  history = [];
  historyWorking?.forEach(historyEntry => {
    currentHours += historyEntry.hours;
    history.push({ date: convertTimestampToDateInternship(historyEntry.when.seconds), hours: historyEntry.hours, totalHours: currentHours, tasks: historyEntry.tasks })
  })
  history = history.reverse();
  allCurrentHours.working = currentHours;
  rows.push(createData('На рабочем месте', currentHours, internshipInfo.totalHoursWorking - currentHours, internshipInfo.totalHoursWorking, history))

  return (
    <>
      <InternshipProgress
        allCurrentHours={allCurrentHours}
        internshipInfo={internshipInfo}
      />
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Вид стажировки</TableCell>
              <TableCell align="right">Сейчас</TableCell>
              <TableCell align="right">Осталось</TableCell>
              <TableCell align="right">Всего</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}


function InternshipProgress({ allCurrentHours, internshipInfo }) {
  const classesLinearProgress = useStylesLinearProgress();

  const totalHours = internshipInfo.totalHoursNeighbours + internshipInfo.totalHoursPreliminary + internshipInfo.totalHoursTraining + internshipInfo.totalHoursWorking;
  const percentagePreliminary = Math.ceil((allCurrentHours.preliminary / totalHours) * 100);
  const percentageTraining = Math.ceil((allCurrentHours.training / totalHours) * 100);
  const percentageNeighbours = Math.ceil((allCurrentHours.neighbours / totalHours) * 100);
  const percentageWorking = 100 - percentagePreliminary - percentageTraining - percentageNeighbours;

  const valueWorking = parseInt((allCurrentHours.working / internshipInfo.totalHoursWorking) * 100);

  return (
    <>
      <Tooltip
        title={`Предварительная ${allCurrentHours.preliminary}/${internshipInfo.totalHoursPreliminary}`}
        aria-label="tooltip-linear-preliminary"
        classes={{
          tooltip: classesLinearProgress.tooltipFont,
        }}
      >
        <LinearProgress
          variant="determinate"
          classes={{
            root: classesLinearProgress.root + " " + classesLinearProgress['success' + "Background"],
            bar: classesLinearProgress.bar + " " + classesLinearProgress['success']
          }}
          value={100}
          style={{ width: `${percentagePreliminary}%`, display: "inline-block" }}
        />
      </Tooltip>
      <Tooltip
        title={`Ознакомление со смежными ${allCurrentHours.neighbours}/${internshipInfo.totalHoursNeighbours}`}
        aria-label="tooltip-linear-neighbours"
        classes={{
          tooltip: classesLinearProgress.tooltipFont,
        }}
      >
        <LinearProgress
          variant="determinate"
          classes={{
            root: classesLinearProgress.root + " " + classesLinearProgress['warning' + "Background"],
            bar: classesLinearProgress.bar + " " + classesLinearProgress['warning']
          }}
          value={100}
          style={{ width: `${percentageNeighbours}%`, display: "inline-block" }}
        />
      </Tooltip>
      <Tooltip
        title={`Тренажёры ${allCurrentHours.training}/${internshipInfo.totalHoursTraining}`}
        aria-label="tooltip-linear-training"
        classes={{
          tooltip: classesLinearProgress.tooltipFont,
        }}
      >
        <LinearProgress
          variant="determinate"
          classes={{
            root: classesLinearProgress.root + " " + classesLinearProgress['info' + "Background"],
            bar: classesLinearProgress.bar + " " + classesLinearProgress['info']
          }}
          value={100}
          style={{ width: `${percentageTraining}%`, display: "inline-block" }}
        />
      </Tooltip>
      <Tooltip
        title={`На рабочем месте ${allCurrentHours.working}/${internshipInfo.totalHoursWorking}`}
        aria-label="tooltip-linear-working"
        classes={{
          tooltip: classesLinearProgress.tooltipFont,
        }}
      >
        <LinearProgress
          variant="determinate"
          classes={{
            root: classesLinearProgress.root + " " + classesLinearProgress['primary' + "Background"],
            bar: classesLinearProgress.bar + " " + classesLinearProgress['primary']
          }}
          value={valueWorking}
          style={{ width: `${percentageWorking}%`, display: "inline-block" }}
        />
      </Tooltip>
    </>
  )
}