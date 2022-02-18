/*eslint-disable*/
import React from "react";
import Head from 'next/head'
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Button from "components/CustomButtons/Button.js";
import Table from "components/Table/Table.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Footer from "components/Footer/Footer.js";

import GetApp from "@material-ui/icons/GetApp";

import aipPageStyle from "assets/jss/nextjs-material-kit-pro/pages/aipPageStyle.js";

import { getAllAIPData } from 'lib/aip'
import moment from "moment";
import 'moment/locale/ru';


const useStyles = makeStyles(aipPageStyle);

const createAIPDate = (allAIPData) => {
  var fullTable = [];

  allAIPData.forEach(airportData => {
    var row = [airportData.aeroportICAOCode, airportData.aeroportInfo.name, airportData.aeroportInfo.country];

    let possibleAIPTypes = ["full", "STAR", "SID", "Approach"];

    possibleAIPTypes.forEach(type => {
      if (airportData.availableAIPTypes[type]) {
        //let link = `https://storage.googleapis.com/atc.epinetov.com/public/aip/${aeroportICAOCode}/${aeroportICAOCode}_${type}.pdf`;
        row.push(<Button href={`https://storage.googleapis.com/atc.epinetov.com/public/aip/${airportData.aeroportICAOCode}/${airportData.aeroportICAOCode}_${type}.pdf`} color="blue"> <GetApp /> {`${type}`} </Button>)
      } else {
        row.push(<Button disabled color="blue"> <GetApp /> {`${type}`} </Button>)
      }

    })

    fullTable.push(row);
  })

  return fullTable;
}

const GetDateOfUpdatingAIP = () => {
                  // 9 sept       //7 oct       //4 nov        //2 dec     //30 dec
  const UPDATES = ['1631156395', '1633575595', '1635994795', '1638413995', '1640833195'];
  let currentDate = moment().unix();
  //let currentDate = 1640919595;
  let willUpdateAt = UPDATES[0];
  UPDATES.forEach((timestamp, id) => {
    if (currentDate > timestamp) {
      if (id < UPDATES.length - 1)
        {
          willUpdateAt = UPDATES[id+1];
        }
        else {
          willUpdateAt = 1643511595;
        }
    }
  })
  let date = moment.unix(willUpdateAt).format('LL');
  let daysUntil = moment.unix(willUpdateAt).fromNow();
  return <>{date} ({daysUntil})</>;
}

export default function AIPPage({ allAIPData }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>AIP | ATC</title>
      </Head>
      <Header
        links={<HeaderLinks dropdownHoverColor="dark" />}
        color="transparent"
      />
      <div className={classes.container}>
        <GridContainer>
          <GridItem
            md={12}
            className={classes.mlAuto + " " + classes.mrAuto}
            style={{ marginBottom: '3em !important' }}
          >
            <h2 className={classes.title}>Актуальная информация AIP</h2>
            <h5 className={classes.description}>
              На этой странице вы можете найти актуальную опубликованную аэронавигационную информацию по аэродромам гражданской авиации и совместного базирования.
            </h5>
            <h5 className={classes.description}>
              Все файлы взяты с <a href="http://www.caiga.ru/" target='_blank'>сайта ЦАИ ГА</a>.
            </h5>
            <h5 className={classes.description}>
              В последний раз обновлено <span style={{color: "#dc7474"}}>9 сентября 2021 г.</span>
            </h5>
            <h5 className={classes.description}>
              Следующее обновление примерно планируется <GetDateOfUpdatingAIP/>
            </h5>
          </GridItem>
          <GridItem
            md={12}
            className={classes.mlAuto + " " + classes.mrAuto}
            style={{ marginBottom: '2em !important' }}
          >
            <Table
              striped
              hover
              tableHead={[
                "ICAO",
                "Название",
                "Страна",
                "Полный",
                "STAR",
                "SID",
                "Approach"
              ]}
              tableData={createAIPDate(allAIPData)}
            />
          </GridItem>
        </GridContainer>
      </div>
      <Footer/>
    </div>
  );
}

export async function getStaticProps() {
  const allAIPData = getAllAIPData()
  return {
    props: {
      allAIPData
    }
  }
}