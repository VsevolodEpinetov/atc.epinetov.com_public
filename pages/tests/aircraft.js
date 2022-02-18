/*eslint-disable*/
import React from "react";
import { useContext } from "react";
import Link from 'next/link'
// @material-ui/core components
import { withStyles, makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Table from "components/Table/Table.js";
import PropTypes from 'prop-types';

import Slider from '@material-ui/core/Slider';

import testsAircraftPageStyle from "assets/jss/nextjs-material-kit-pro/pages/testsAircraftPageStyle.js";

import Done from "@material-ui/icons/Done";
import DoneAll from "@material-ui/icons/DoneAll";
import Close from "@material-ui/icons/Close";

import { getAllAircraftTestData } from 'lib/testAircraft'


// auth
import { auth, firestore } from '../../lib/firebase';
import { UserContext } from '../../lib/context';

const useStyles = makeStyles(testsAircraftPageStyle);

function valueLabelFormat(value) {
  return `FL${value}`;
}

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

function getRandomQuestionsFromData(testData, amountOfQuestions) {
  const data = testData.sort(() => 0.5 - Math.random()).slice(0, amountOfQuestions)
  let questions = [];
  data.forEach(aircraft => {
    let category = 'M';
    if (aircraft.specs.maxTakeOffWeight.kg > 136000) category = 'H'
    questions.push({
      question: aircraft.name.plain,
      answers: {
        engines: {
          number: aircraft.specs.engines.quantity,
          type: aircraft.specs.engines.type,
        },
        ceiling: aircraft.specs.ceiling.fl,
        speed: aircraft.specs.speed.cruising.kmh,
        category: category
      }
    })
  })

  return questions;
}

const getTextForAnswer = (answers) => {
  return `Двигатели: L${answers.engines.number}${answers.engines.type}, Категория: ${answers.category}, Скорость: ${answers.speed} км/ч, Потолок: FL${answers.ceiling}`
}

function getPhraseForTestResults(goal, result) {
  const mark = parseInt(result) / parseInt(goal);
  let message = '🙈';
  if (mark > 0.3) message = 'Не то, чтобы прям плохо, но есть куда стремиться 🌚'
  if (mark >= 0.6) message = 'В целом неплохо, но ты точно можешь лучше! 💪'
  if (mark >= 0.8) message = 'Так держать, горжусь тобой! 🥰'
  if (mark >= 1) message = 'Вау, ты верно назвал абсолютно всё. Чемпион! 🥇'

  return message;
}

function getTableWithResults(results) {
  let data = [];
  let questionNumber = 1;
  results.forEach(result => {
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
    data.push([<span className={classForText}>{questionNumber}</span>, <span className={classForText}>{result.question}</span>, <span className={classForText}>{correctAnswer}</span>, <span className={classForText}>{userAnswer}</span>, <span className={classForText}><ResultIcon /></span>, `${result.pointsGot}`])
    questionNumber++;
  })
  return data;
}

const marksForCeiling = [
  {
    value: 200,
    label: 'FL200'
  },
  {
    value: 300,
    label: 'FL300'
  },
  {
    value: 400,
    label: 'FL400'
  },
  {
    value: 500,
    label: 'FL500'
  },
  {
    value: 600,
    label: 'FL600'
  }
]

const marksForSpeed = [
  {
    value: 300,
    label: '300'
  },
  {
    value: 500,
    label: '500'
  },
  {
    value: 700,
    label: '700'
  },
  {
    value: 900,
    label: '900'
  }
]

const colorsForSliders = {
  orange: "#ff9800",
  red: "#f44336",
  green: "#4caf50",
  purple: "#9c27b0",
  correctAnswer: '#80b58e',
  wrongAnswer: '#de7d7d'
}

export default function docsPage({ testData, userData }) {

  const { user } = useContext(UserContext);

  

  // ---------------------------------
  // Start of Quiz Variables and Handlers
  const startingSpeed = 400;
  const startingCeiling = 200;
  const startingSpeedColor = colorsForSliders.orange;
  const startingCeilingColor = colorsForSliders.red;

  const [quiz, setQuiz] = React.useState([]);
  const [quizResults, setQuizResults] = React.useState([]);
  const [pts, setPts] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  const [ceilingSliderColor, setCeilingSliderColor] = React.useState(startingCeilingColor);
  const [speedSliderColor, setSpeedSliderColor] = React.useState(startingSpeedColor);

  const [speed, setSpeed] = React.useState(startingSpeed);
  const [ceiling, setCeiling] = React.useState(startingCeiling);
  const [numberOfEngines, setNumberOfEngines] = React.useState('');
  const [typeOfEngines, setTypeOfEngines] = React.useState('');
  const [typeOfAircraft, setTypeOfAircraft] = React.useState('');


  const [numberOfEnginesSelectorIsDisabled, setNumberOfEnginesSelectorIsDisabled] = React.useState(false);
  const [typeOfEnginesSelectorIsDisabled, setTypeOfEnginesSelectorIsDisabled] = React.useState(false);
  const [typeOfAircraftSelectorIsDisabled, setTypeOfAircraftSelectorIsDisabled] = React.useState(false);
  const [ceilingIsDisabled, setCeilingIsDisabled] = React.useState(false);
  const [speedIsDisabled, setSpeedIsDisabled] = React.useState(false);


  const [numberOfEnginesSelectorError, setNumberOfEnginesSelectorError] = React.useState(false);
  const [typeOfEnginesSelectorError, setTypeOfEnginesSelectorError] = React.useState(false);
  const [typeOfAircraftSelectorError, setTypeOfAircraftSelectorError] = React.useState(false);

  // Resets current state of the quiz
  const resetQuiz = (amOfQuestions) => {
    setQuiz(getRandomQuestionsFromData(testData, amOfQuestions));
    setCurrentQuestion(0);
    setPts(0);
    setQuizResults([]);

    document.getElementById('check-button') && document.getElementById('check-button').classList.remove('btn-disabled')
    
    let testAnswer = document.getElementById('test-answer');
    if (testAnswer)
      if (!testAnswer.classList.contains('is-hidden'))
        testAnswer.classList.add('is-hidden')

    setNumberOfEnginesSelectorIsDisabled(false);
    setNumberOfEnginesSelectorError(false);
    setNumberOfEngines('')

    setTypeOfEnginesSelectorIsDisabled(false);
    setTypeOfEnginesSelectorError(false);
    setTypeOfEngines('')

    setTypeOfAircraftSelectorIsDisabled(false);
    setTypeOfAircraftSelectorError(false);
    setNumberOfEngines('')

    setSpeedIsDisabled(false);
    setSpeed(startingSpeed)
    setSpeedSliderColor(startingSpeedColor);
    let speedLabel = document.getElementById('speed-label');
    if (speedLabel) {
      speedLabel.classList.remove('textGreen');
      speedLabel.classList.remove('textRed');
    }

    setCeilingIsDisabled(false);
    setCeiling(startingCeiling)
    setCeilingSliderColor(startingCeilingColor);
    let ceilingLabel = document.getElementById('ceiling-label');
    if (ceilingLabel) {
      ceilingLabel.classList.remove('textGreen');
      ceilingLabel.classList.remove('textRed');
    }

    let nextButton = document.getElementById('next-button');
    if (nextButton)
      if (!nextButton.classList.contains('btn-disabled'))
        nextButton.classList.add('btn-disabled')
  }

  const [amountOfQuestions, setAmountOfQuestions] = React.useState(5);
  const handleAmountOfQuestionsSelector = event => {
    setAmountOfQuestions(parseInt(event.target.value));
    resetQuiz(parseInt(event.target.value));
  };

  const handleSpeedSlider = (event, newValue) => {
    let color = colorsForSliders.green;
    if (newValue >= 900) color = colorsForSliders.purple;
    else if (newValue < 750) {
      if (newValue >= 350) color = colorsForSliders.orange;
      else color = colorsForSliders.red;
    }

    setSpeedSliderColor(color);
    setSpeed(newValue);
  }

  const handleCeilingSlider = (event, newValue) => {
    let color = colorsForSliders.green;
    if (newValue >= 480) color = colorsForSliders.purple;
    else if (newValue < 400) {
      if (newValue >= 300) color = colorsForSliders.orange;
      else color = colorsForSliders.red;
    }

    setCeilingSliderColor(color);
    setCeiling(newValue);
  }


  const startAgain = (e) => {
    e.preventDefault();
    resetQuiz(amountOfQuestions);
  };

  // Initiate a quiz
  React.useEffect(() => {
    if (quiz.length == 0) setQuiz(getRandomQuestionsFromData(testData, amountOfQuestions));
  })
  // End of Quiz Variables and Handlers
  // ---------------------------------


  // ---------------------------------
  // Start of Quiz Functions
  const checkAnswer = (e) => {
    let userAnswer = {
      engines: {
        number: numberOfEngines,
        type: typeOfEngines
      },
      category: typeOfAircraft,
      ceiling: ceiling,
      speed: speed
    }

    let pointsGot = 0;

    setNumberOfEnginesSelectorIsDisabled(true);
    if (userAnswer.engines.number === quiz[currentQuestion].answers.engines.number) {
      pointsGot += 0.2
    } else {
      setNumberOfEnginesSelectorError(true);
    }

    setTypeOfEnginesSelectorIsDisabled(true);
    if (userAnswer.engines.type === quiz[currentQuestion].answers.engines.type) {
      pointsGot += 0.2
    } else {
      setTypeOfEnginesSelectorError(true);
    }

    setTypeOfAircraftSelectorIsDisabled(true);
    if (userAnswer.category === quiz[currentQuestion].answers.category) {
      pointsGot += 0.2
    } else {
      setTypeOfAircraftSelectorError(true);
    }

    setSpeedIsDisabled(true);
    if (quiz[currentQuestion].answers.speed + 50 > userAnswer.speed && userAnswer.speed > quiz[currentQuestion].answers.speed - 50) {
      pointsGot += 0.2
      setSpeedSliderColor(colorsForSliders.correctAnswer);
      document.getElementById('speed-label').classList.add('textGreen');
    } else {
      setSpeedSliderColor(colorsForSliders.wrongAnswer);
      document.getElementById('speed-label').classList.add('textRed');
    }

    setCeilingIsDisabled(true);
    if (quiz[currentQuestion].answers.ceiling + 30 > userAnswer.ceiling && userAnswer.ceiling > quiz[currentQuestion].answers.ceiling - 30) {
      pointsGot += 0.2
      setCeilingSliderColor(colorsForSliders.correctAnswer);
      document.getElementById('ceiling-label').classList.add('textGreen');
    } else {
      setCeilingSliderColor(colorsForSliders.wrongAnswer);
      document.getElementById('ceiling-label').classList.add('textRed');
    }

    pointsGot = parseFloat(pointsGot.toFixed(1))

    let newResults = quizResults;
    newResults.push({
      "question": quiz[currentQuestion].question,
      "correctAnswer": quiz[currentQuestion].answers,
      "userAnswer": userAnswer,
      "pointsGot": pointsGot
    })
    setQuizResults(newResults)

    let newPoints = pts + pointsGot;
    setPts(newPoints);

    document.getElementById('next-button').classList.remove('btn-disabled')
    document.getElementById('check-answer-button').classList.add('btn-disabled')

    document.getElementById('test-answer').classList.remove('is-hidden')

  }

  const nextQuestion = async (e) => {
    document.getElementById('test-answer').classList.add('is-hidden')

    setNumberOfEnginesSelectorIsDisabled(false);
    setNumberOfEnginesSelectorError(false);
    setNumberOfEngines('')

    setTypeOfEnginesSelectorIsDisabled(false);
    setTypeOfEnginesSelectorError(false);
    setTypeOfEngines('')

    setTypeOfAircraftSelectorIsDisabled(false);
    setTypeOfAircraftSelectorError(false);
    setTypeOfAircraft('')

    setSpeedIsDisabled(false);
    setSpeed(startingSpeed)
    setSpeedSliderColor(startingSpeedColor);
    document.getElementById('speed-label').classList.remove('textGreen');
    document.getElementById('speed-label').classList.remove('textRed');

    setCeilingIsDisabled(false);
    setCeiling(startingCeiling)
    setCeilingSliderColor(startingCeilingColor);
    document.getElementById('ceiling-label').classList.remove('textGreen');
    document.getElementById('ceiling-label').classList.remove('textRed');

    document.getElementById('next-button').classList.add('btn-disabled')
    document.getElementById('check-answer-button').classList.remove('btn-disabled')

    setCurrentQuestion(currentQuestion + 1);

    if (currentQuestion + 1 === amountOfQuestions) {
      if (user) {
        const userRef = firestore.collection('users').doc(auth.currentUser.uid) ;
        let obj = {
          results: quizResults,
          timestamp: Date.now(),
          totalPointsGot: pts,
          totalPoints: quizResults.length
        }
        await userRef.collection('testsAircraft').add(obj);
      }
    }
  }

  // ---------------------------------
  // End of Quiz Functions

  const handleNumberOfEnginesChange = (event) => {
    setNumberOfEngines(event.target.value);
  };

  const handleTypeOfEnginesChange = (event) => {
    setTypeOfEngines(event.target.value);
  };

  const handleTypeOfAircraftChange = (event) => {
    setTypeOfAircraft(event.target.value);
  };

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
              key='test-cities-header'
            >
              <h2 className={classes.title}>Тестирование. ЛТХ ВС</h2>
              <h5 className={classes.description}>
                Тестирование на знание ЛТХ ВС, которые чаще всего встречаются при ОВД в зоне МУДР (все ВС перечислены на <Link href='/aircraft'>соответствующей странице</Link>). По-умолчанию запущено тестирование из 5 вопросов. Каждый вопрос состоит из 5 частей: количество двигателей ВС, их тип, категория ВС по шкале ИКАО  по турбулентности в следе (WTC), крейсерская скорость (пока в км/ч, <b>в Махах будет реализовано, но позже</b>) и потолок ВС (в FL). За каждый верный ответ даётся по 0.2 балла. Таким образом, за абсолютно верный ответ можно получить 1 балл.
              </h5>
            </GridItem>
            <GridItem
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto + ' margin-bottom-fix'}
              style={{ marginBottom: '3em !important' }}
              key='test-cities-settings-number'
            >
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="simple-select"
                  className={classes.selectLabel}
                >
                  Количество вопросов
                    </InputLabel>
                <Select
                  MenuProps={{
                    className: classes.selectMenu
                  }}
                  classes={{
                    select: classes.select
                  }}
                  value={amountOfQuestions}
                  onChange={handleAmountOfQuestionsSelector}
                  inputProps={{
                    name: "handleAmountOfQuestionsSelector",
                    id: "amount-of-questions-selector"
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Количество вопросов
                      </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="5"
                  >
                    5
                      </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="10"
                  >
                    10
                      </MenuItem>
                  <MenuItem
                    classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelected
                    }}
                    value="20"
                  >
                    20
                      </MenuItem>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem
              md={12}
              className={classes.mlAuto + " " + classes.mrAuto}
              style={{ marginBottom: '3em !important' }}
              key='test-cities-body'
            >
              {quiz[currentQuestion] &&

                <GridContainer>
                  <GridItem
                    md={12}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='12'
                  >
                    <p className='test-step' dangerouslySetInnerHTML={{ __html: `${currentQuestion + 1}/${quiz.length}` }}></p>
                    <p className='test-question' dangerouslySetInnerHTML={{ __html: `${quiz[currentQuestion].question}` }}></p>
                    <p className='test-answer is-hidden' id='test-answer' dangerouslySetInnerHTML={{ __html: `${getTextForAnswer(quiz[currentQuestion].answers)}` }}></p>
                  </GridItem>

                  <GridItem
                    md={3}
                    sm={6}
                    className={classes.mlAuto + " " + classes.mrAuto + " " + classes.mb3em}
                    key='answer-field-engines'
                  >
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      disabled={numberOfEnginesSelectorIsDisabled}
                      error={numberOfEnginesSelectorError}
                    >
                      <InputLabel id="answer-number-of-engines-label">Количество двигателей</InputLabel>
                      <Select
                        labelId="answer-number-of-engines-select-label"
                        id="answer-number-of-engines-select"
                        value={numberOfEngines}
                        onChange={handleNumberOfEnginesChange}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem
                    md={3}
                    sm={6}
                    className={classes.mlAuto + " " + classes.mrAuto + " " + classes.mb3em}
                    key='answer-field-enginges-type'
                    disabled={typeOfEnginesSelectorIsDisabled}
                  >
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      disabled={typeOfEnginesSelectorIsDisabled}
                      error={typeOfEnginesSelectorError}
                    >
                      <InputLabel id="answer-type-of-engines-label">Тип двигателей</InputLabel>
                      <Select
                        labelId="answer-type-of-engines-select-label"
                        id="answer-type-of-engines-select"
                        value={typeOfEngines}
                        onChange={handleTypeOfEnginesChange}
                      >
                        <MenuItem value='J'>Реактивные</MenuItem>
                        <MenuItem value='P'>Турбовинтовые</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem
                    md={6}
                    sm={12}
                    className={classes.mlAuto + " " + classes.mrAuto + " " + classes.mb3em}
                    key='answer-field-category'
                  >
                    <FormControl
                      className={classes.formControl}
                      fullWidth
                      disabled={typeOfAircraftSelectorIsDisabled}
                      error={typeOfAircraftSelectorError}
                    >
                      <InputLabel id="answer-type-of-aircraft-label">Категория ВС</InputLabel>
                      <Select
                        labelId="answer-type-of-aircraft-select-label"
                        id="answer-type-of-aircraft-select"
                        value={typeOfAircraft}
                        onChange={handleTypeOfAircraftChange}
                      >
                        <MenuItem value='L'>Лёгкое</MenuItem>
                        <MenuItem value='M'>Среднее</MenuItem>
                        <MenuItem value='H'>Тяжёлое</MenuItem>
                      </Select>
                    </FormControl>
                  </GridItem>
                  <GridItem
                    md={6}
                    sm={12}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='answer-field-speed'
                  >
                    <span id='speed-label'>Скорость: {speed} км/ч</span>
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="slider-speed"
                      defaultValue={startingSpeed}
                      ValueLabelComponent={ValueLabelComponent}
                      onChange={handleSpeedSlider}
                      min={300}
                      max={1000}
                      classes={{
                        root: classes.sliderRoot,
                        thumb: classes.sliderThumb,
                        valueLabel: classes.sliderValueLabel,
                        track: classes.sliderTrack,
                        rail: classes.sliderRail,
                        markLabel: classes.sliderMarkLabel
                      }}
                      style={{
                        color: speedSliderColor
                      }}
                      marks={marksForSpeed}
                      disabled={speedIsDisabled}
                      value={speed}
                    />
                  </GridItem>
                  <GridItem
                    md={6}
                    sm={12}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='answer-field-ceiling'
                  >
                    <span id='ceiling-label'>Потолок: FL{ceiling}</span>
                    <Slider
                      valueLabelDisplay="auto"
                      aria-label="slider-ceiling"
                      defaultValue={startingCeiling}
                      ValueLabelComponent={ValueLabelComponent}
                      onChange={handleCeilingSlider}
                      min={100}
                      max={600}
                      step={10}
                      classes={{
                        root: classes.sliderRoot,
                        thumb: classes.sliderThumb,
                        valueLabel: classes.sliderValueLabel,
                        track: classes.sliderTrack,
                        rail: classes.sliderRail,
                        markLabel: classes.sliderMarkLabel,
                        disabled: classes.sliderDisabled
                      }}
                      style={{
                        color: ceilingSliderColor
                      }}
                      getAriaValueText={valueLabelFormat}
                      valueLabelFormat={valueLabelFormat}
                      marks={marksForCeiling}
                      disabled={ceilingIsDisabled}
                      value={ceiling}
                    />
                  </GridItem>
                  <GridItem
                    md={6}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='check-answer-button'
                  >
                    <Button color='info' size="sm" fullWidth onClick={checkAnswer} id='check-answer-button'>
                      Проверить
                    </Button>
                  </GridItem>
                  <GridItem
                    md={6}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='next-button'
                  >
                    <Button color="primary" size="sm" fullWidth onClick={nextQuestion} id='next-button' className='btn-disabled'>
                      Дальше
                    </Button>
                  </GridItem>

                </GridContainer>
              }
              {currentQuestion == quiz.length &&
                <>
                  <p className='test-results'>Из {quiz.length} возможных баллов ты получил {pts}.</p>
                  <p className='test-results-substring'>{getPhraseForTestResults(quiz.length, pts)}</p>
                  <Table
                    striped
                    tableHead={["#", "ВС", "Верный ответ", "Твой ответ", "Результат", "Баллы"]}
                    tableData={getTableWithResults(quizResults)}
                  />
                  <Button color="primary" size="sm" fullWidth onClick={startAgain} id='start-again'>
                    Давай по новой
                  </Button>
                </>
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
  const testData = getAllAircraftTestData()
  return {
    props: {
      testData
    }
  }
}