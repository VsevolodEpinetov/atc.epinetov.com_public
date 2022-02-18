import Link from 'next/link';
import { useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Table from "components/Table/Table.js";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Done from "@material-ui/icons/Done";
import DoneAll from "@material-ui/icons/DoneAll";
import Close from "@material-ui/icons/Close";

import { convertTimestampToDate } from '../lib/date';

export default function TestFeed({ tests, testType }) {
  let testData = convertTestData(tests, testType);

  return testData ? testData.map((test, testId) => <TestItem test={test} testId={testId} />) : null;
}

function TestItem({ test, testId }) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion expanded={expanded === `panel-aircraftTest${testId}`} onChange={handleChange(`panel-aircraftTest${testId}`)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-aircraftTest${testId}bh-content`}
        id={`panel-aircraftTest${testId}bh-header`}
      >
        <p>Тест от {convertTimestampToDate(test.timestamp)}, {test.totalPointsGot}/{test.totalPoints}</p>
      </AccordionSummary>
      <AccordionDetails className={'accordion-root'}>
        <Table
          striped
          tableHead={["#", "ВС", "Верный ответ", "Твой ответ", "Результат", "Баллы"]}
          tableData={test.table}
        />
      </AccordionDetails>
    </Accordion>
  );
}



const convertTestData = (testData, testType) => {
  let resultsData = [];
  testData?.forEach(testResults => {
    let data = {
      timestamp: testResults.timestamp,
      totalPoints: testResults.totalPoints,
      totalPointsGot: testResults.totalPointsGot,
      table: []
    };
    let questionNumber = 1;

    testResults.results.forEach(result => {
      let tableRow;


      // AIRCRAFT TEST
      if (testType === 'aircraft') {
        let classForText = 'textOrange';
        let ResultIcon = Done;
        if (result.pointsGot === 1) {
          classForText = 'textGreen'
          ResultIcon = DoneAll;
        }
        if (result.pointsGot === 0) {
          classForText = 'textRed'
          ResultIcon = Close;
        }
        let correctAnswer = `L${result.correctAnswer.engines.number}${result.correctAnswer.engines.type}, ${result.correctAnswer.category}, ${result.correctAnswer.speed} км/ч, FL${result.correctAnswer.ceiling}`
        let userAnswer = `L${result.userAnswer.engines.number}${result.userAnswer.engines.type}, ${result.userAnswer.category}, ${result.userAnswer.speed} км/ч, FL${result.userAnswer.ceiling}`
        tableRow = [
          <span className={classForText}>{questionNumber}</span>, 
          <span className={classForText}>{result.question}</span>, 
          <span className={classForText}>{correctAnswer}</span>, 
          <span className={classForText}>{userAnswer}</span>, 
          <span className={classForText}><ResultIcon /></span>, 
          `${result.pointsGot}`
        ];
      }




      // CITIES TEST
      if (testType === 'cities') {
        let classForText = 'textRed';
        let ResultIcon = Close;
        let pointsGot = 0;
        if (result.correctAnswer.includes(result.userAnswer)) {
          if (result.hintUses != 3) ResultIcon = Done;
          if (result.hintUses == 1) {
            classForText = 'textOrange';
            pointsGot = 0.5;
          }
          if (result.hintUses == 2) {
            classForText = 'textOrange';
            pointsGot = 0.25;
          }
          if (result.hintUses == 0) {
            classForText = 'textGreen';
            pointsGot = 1;
          }
        }
        tableRow = [
          <span className={classForText}>{questionNumber}</span>, 
          <span className={classForText}>{result.question}</span>, 
          <span className={classForText}>{result.correctAnswer[0]}/{result.correctAnswer[1]}</span>, 
          <span className={classForText}>{result.userAnswer}</span>, 
          <span className={classForText}><ResultIcon /></span>, 
          `${pointsGot}`
        ];
      }




      data.table.push(tableRow)
      questionNumber++;
    })
    resultsData.push(data);
  })

  return resultsData;
}