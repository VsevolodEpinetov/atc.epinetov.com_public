/*eslint-disable*/
import React from "react";
import { useContext } from "react";
import Link from "next/link";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Table from "components/Table/Table.js";

import citiesPageStyle from "assets/jss/nextjs-material-kit-pro/pages/citiesPageStyle.js";

import Search from "@material-ui/icons/Search";
import Done from "@material-ui/icons/Done";
import Close from "@material-ui/icons/Close";

import { getAllCitiesTestData } from 'lib/cities'

// auth
import { auth, firestore } from '../../lib/firebase';
import { UserContext } from '../../lib/context';

const useStyles = makeStyles(citiesPageStyle);


function getRandomQuestionsFromData(testData, amountOfQuestions, areas) {
  const dataWithCertainAreas = testData.filter(airport => areas.includes(airport.area.icao.eng))
  const data = dataWithCertainAreas.sort(() => 0.5 - Math.random()).slice(0, amountOfQuestions)
  let questions = [];
  data.forEach(city => {
    questions.push({
      "question": city.name,
      "answer": [city.icao.rus, city.icao.eng]
    })
  })

  return questions;
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

function getTableWithResults (results) {
  let data = [];
  let questionNumber = 1;
  results.forEach(result => {
    let classForText = 'textRed';
    let ResultIcon = Close;
    let pointsGot = 0;
    if (result.correctAnswer.includes(result.userAnswer)) {
      console.log(result.hintUses)
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
    data.push([<span className={classForText}>{questionNumber}</span>, <span className={classForText}>{result.question}</span>, <span className={classForText}>{result.correctAnswer[0]}/{result.correctAnswer[1]}</span>, <span className={classForText}>{result.userAnswer}</span>, <span className={classForText}><ResultIcon/></span>, `${pointsGot}`])
    questionNumber++;
  })
  return data;
}

const allAreas = [
  {
    "name": 'Хабаровский РЦ',
    "icao": 'UH'
  },
  {
    "name": 'Якутский РЦ',
    "icao": 'UE'
  },
  {
    "name": 'Иркутский РЦ',
    "icao": 'UI'
  },
  {
    "name": 'Новосибирский РЦ',
    "icao": 'UN'
  },
  {
    "name": 'Норильский РЦ',
    "icao": 'UO'
  },
  {
    "name": 'Самарский РЦ',
    "icao": 'UW'
  },
  {
    "name": 'Екатеринбургский РЦ',
    "icao": 'US'
  },
  {
    "name": 'Московский РЦ',
    "icao": 'UU'
  }
]

export default function docsPage({ testData, userData }) {

  const { user } = useContext(UserContext);

  // ---------------------------------
  // Start of Quiz Variables and Handlers
  const [quiz, setQuiz] = React.useState([]);
  const [quizResults, setQuizResults] = React.useState([]);
  const [pts, setPts] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  const [hint, setHint] = React.useState('Подсказка');
  const [hintColor, setHintColor] = React.useState('info');

  const [textFieldValidationSuccess, setTextFieldValidationSuccess] = React.useState(false);
  const [textFieldValidationError, setTextFieldValidationError] = React.useState(false);


  // Resets current state of the quiz
  const resetQuiz = (amOfQuestions, chAreas) => {
    setQuiz(getRandomQuestionsFromData(testData, amOfQuestions, chAreas));
    setCurrentQuestion(0);
    setPts(0);

    setHint('Подсказка');
    setHintColor('info');

    document.getElementById('hint-button') && document.getElementById('hint-button').classList.remove('btn-disabled')
    document.getElementById('check-button') && document.getElementById('check-button').classList.remove('btn-disabled')

    let answerField = document.getElementById('answer-field');
    if (answerField) {
      answerField.value = '';
      answerField.disabled = false;
      answerField.classList.remove('textRed')
      answerField.classList.remove('textGreen')
    }

    let testAnswer = document.getElementById('test-answer');
    if (testAnswer)
      if (!testAnswer.classList.contains('is-hidden'))
        testAnswer.classList.add('is-hidden')

    setTextFieldValidationError(false);
    setTextFieldValidationSuccess(false);
  }

  const fillButtons = [
    { color: "info", icon: Search },
    { color: "success", icon: Search },
    { color: "danger", icon: Search }
  ].map((prop, key) => {
    return (
      <Button justIcon size="sm" color={prop.color} key={key}>
        <prop.icon />
      </Button>
    );
  });

  const [amountOfQuestions, setAmountOfQuestions] = React.useState(5);
  const [simpleSelect, setSimpleSelect] = React.useState("5");
  const handleAmountOfQuestionsSelector = event => {
    setAmountOfQuestions(parseInt(event.target.value));
    resetQuiz(parseInt(event.target.value), areas);
  };


  const [areas, setAreas] = React.useState(["UH", "UE", "UI", "UN", "UO", "UW", "US", "UU"]);
  const handleAreasSelector = event => {
    setAreas(event.target.value);
    resetQuiz(amountOfQuestions, event.target.value);
  };


  const startAgain = async (e) => {
    e.preventDefault();
    resetQuiz(amountOfQuestions, areas);
  };

  // Initiate a quiz
  React.useEffect(() => {
    if (quiz.length == 0) setQuiz(getRandomQuestionsFromData(testData, amountOfQuestions, areas));
  })
  // End of Quiz Variables and Handlers
  // ---------------------------------


  // ---------------------------------
  // Start of Quiz Functions
  const checkAnswer = (e) => {
    let userAnswer = document.getElementById('answer-field').value.toUpperCase();

    if (userAnswer.length === 4) {

      document.getElementById('hint-button').classList.add('btn-disabled');
      document.getElementById('answer-field').disabled = true;
      document.getElementById('next-button').classList.remove('btn-disabled');

      if (quiz[currentQuestion].answer.includes(userAnswer)) {
        setTextFieldValidationSuccess(true)
        document.getElementById('answer-field').classList.add('textGreen')
      } else {
        setTextFieldValidationError(true)
        document.getElementById('answer-field').classList.add('textRed')
        document.getElementById('test-answer').classList.remove('is-hidden')
      }

    }
  }

  const nextQuestion = async (e) => {
    let userAnswer = document.getElementById('answer-field').value.toUpperCase();
    let hintUses = 0;

    if (quiz[currentQuestion].answer.includes(userAnswer)) {
      switch (hint) {
        case 'Подсказка':
          setPts(pts + 1);
          break;
        case 'Ещё плз':
          setPts(pts + 0.5);
          hintUses = 1;
          break;
        case 'Весь ответ 🙏':
          setPts(pts + 0.25);
          hintUses = 2;
          break;
        case 'Всё!':
          hintUses = 3;
          break;
      }
    } else {
      switch (hint) {
        case 'Ещё плз':
          hintUses = 1;
          break;
        case 'Весь ответ 🙏':
          hintUses = 2;
          break;
      }
    }

    setHint('Подсказка');
    setHintColor('info');

    document.getElementById('hint-button').classList.remove('btn-disabled')
    document.getElementById('next-button').classList.add('btn-disabled')

    document.getElementById('answer-field').value = '';
    document.getElementById('answer-field').classList.remove('textRed')
    document.getElementById('answer-field').classList.remove('textGreen')
    document.getElementById('answer-field').disabled = false;

    document.getElementById('test-answer').classList.add('is-hidden')

    setTextFieldValidationError(false);
    setTextFieldValidationSuccess(false);

    let newResults = quizResults;
    newResults.push({
      "question": quiz[currentQuestion].question,
      "correctAnswer": quiz[currentQuestion].answer,
      "userAnswer": userAnswer,
      "hintUses": hintUses
    })
    setQuizResults(newResults)

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
        await userRef.collection('testsCities').add(obj);
      }
    }
  }

  const enterHint = (e) => {
    switch (hint) {
      case 'Подсказка':
        document.getElementById('answer-field').value = quiz[currentQuestion].answer[0].substring(0, 2);
        setHint('Ещё плз');
        setHintColor('warning');
        break;
      case 'Ещё плз':
        document.getElementById('answer-field').value = quiz[currentQuestion].answer[0].substring(0, 3);
        setHint('Весь ответ 🙏');
        setHintColor('danger');
        break;
      case 'Весь ответ 🙏':
        document.getElementById('answer-field').value = quiz[currentQuestion].answer[0];
        document.getElementById('answer-field').disabled = true;
        setHint('Всё!');
        document.getElementById('hint-button').classList.add('btn-disabled');
        document.getElementById('next-button').classList.remove('btn-disabled');
        break;
    }
  }

  // ---------------------------------
  // End of Quiz Functions

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
              <h2 className={classes.title}>Тестирование. Аэропорты России</h2>
              <h5 className={classes.description}>
                Тестирование на знание 4-буквенных обозначений ICAO аэропортов в разных городах России. По-умолчанию запущено тестирование из 5 вопросов. За каждый верный ответ без использования подсказок даётся 1 балл. Первая подсказка открывает первые 2 буквы (так как первая - всегда У, как ни парадоксально), вторая - третью, третья подсказка показывает всё обозначение целиком. При использовании подсказок за верный ответ даётся меньше баллов: 0.5, 0.25 и 0 соответственно.
              </h5>
              <h5 className={classes.description}>
                Обозначения можно вводить как на кириллице, так и на латинице любым регистром (строчным/заглавным). После ввода 4 символов проверка проводится автоматически, для перехода к следующему вопросу используй кнопку "Дальше".
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
              md={6}
              className={classes.mlAuto + " " + classes.mrAuto + ' margin-bottom-fix'}
              key='test-cities-settings-areas'
            >
              <FormControl fullWidth className={classes.selectFormControl}>
                <InputLabel
                  htmlFor="multiple-select"
                  className={classes.selectLabel}
                >
                  Зоны
                    </InputLabel>
                <Select
                  multiple
                  value={areas}
                  onChange={handleAreasSelector}
                  MenuProps={{
                    className: classes.selectMenu,
                    classes: { paper: classes.selectPaper }
                  }}
                  classes={{ select: classes.select }}
                  inputProps={{
                    name: "areasSelector",
                    id: "areas-selector"
                  }}
                >
                  <MenuItem
                    disabled
                    classes={{
                      root: classes.selectMenuItem
                    }}
                  >
                    Зоны
                      </MenuItem>

                  {allAreas.map(area => (
                    <MenuItem key={area.icao} value={area.icao} classes={{
                      root: classes.selectMenuItem,
                      selected: classes.selectMenuItemSelectedMultiple
                    }}>
                      {area.name}
                    </MenuItem>
                  ))}
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
                    <p className='test-answer is-hidden' id='test-answer' dangerouslySetInnerHTML={{ __html: `${quiz[currentQuestion].answer}` }}></p>
                  </GridItem>

                  <GridItem
                    md={12}
                    className={classes.mlAuto + " " + classes.mrAuto + " " + classes.textRed}
                    key='13'
                  >
                    <CustomInput
                      id="answer-field"
                      inputProps={{
                        placeholder: "Ответ"
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                      success={textFieldValidationSuccess}
                      error={textFieldValidationError}
                      onChange={checkAnswer}
                      className={classes.textRed}
                    />
                  </GridItem>
                  <GridItem
                    md={6}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='16'
                  >
                    <Button color={hintColor} size="sm" fullWidth onClick={enterHint} id='hint-button'>
                      {hint}
                    </Button>
                  </GridItem>
                  <GridItem
                    md={6}
                    className={classes.mlAuto + " " + classes.mrAuto}
                    key='17'
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
                    tableHead={["#", "Вопрос", "Верный ответ", "Твой ответ", "Результат", "Баллы"]}
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
  const testData = getAllCitiesTestData()
  return {
    props: {
      testData
    }
  }
}