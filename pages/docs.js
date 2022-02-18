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
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Footer from "components/Footer/Footer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Tooltip from "@material-ui/core/Tooltip";

import docsPageStyle from "assets/jss/nextjs-material-kit-pro/pages/docsPageStyle.js";

import Search from "@material-ui/icons/Search";

import { getSortedDocsIDs } from 'lib/docs'
import Date from 'lib/date'

const useStyles = makeStyles(docsPageStyle);

export default function docsPage({ allDocs }) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
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
              key='docs-header'
            >
              <h2 className={classes.title}>Документация по ОВД</h2>
              <h5 className={classes.description}>
                Здесь находятся актуальные (и не очень) версии важных для ОВД документов. В некоторых документах имеется "краткая версия", которая содержит выжимку из документа только с важными частями. На странице всех документов снизу справа имеется кнопка для быстрого возврата в начало документа.
              </h5>
              <h5 className={classes.description}>
                Все файлы взяты из различных источников, но, как правило, все интересующие документы можно найти на сайте <a href="http://www.garant.ru/" target='_blank'>Гарант</a> и <a href="http://www.consultant.ru/" target='_blank'>Консультант.Плюс</a>.
              </h5>
            </GridItem>
            <GridItem
              md={12}
              className={classes.mlAuto + " " + classes.mrAuto}
              key='docs-active-header'
            >
              <h3>Актуальная документация</h3>
            </GridItem>
            {
              allDocs.active.map(({ id, date, title, summaryExists, fullName }) => (
                <GridItem
                  md={4}
                  className={
                    classes.textCenter
                  }
                  key={`card-${id}`}
                >
                  <Card>
                    <CardBody>
                      <Tooltip
                        id={`tooltip-${id}`}
                        title={`${fullName}`}
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <h4 className={classes.cardTitle}>{title}</h4>
                      </Tooltip>
                      <p>Ред. от <Date dateString={date} /></p>
                      <Button color="blue" href={`/docs/${id}`}>Смотреть</Button> {" "}
                      {summaryExists && <Button color="success" href={`/docs/summary/${id}`}>Кратко</Button>}
                    </CardBody>
                  </Card>
                </GridItem>
              ))
            }
            <GridItem
              md={12}
              className={classes.mlAuto + " " + classes.mrAuto}
              key='docs-not-active-header'
            >
              <h3>Утратившая силу документация</h3>
            </GridItem>
            {
              allDocs.notActive.map(({ id, date, title, summaryExists, fullName }) => (
                <GridItem
                  md={4}
                  className={
                    classes.textCenter
                  }
                  key={`card-${id}`}
                >
                  <Card>
                    <CardBody>
                      <Tooltip
                        id={`tooltip-${id}`}
                        title={`${fullName}`}
                        placement="top"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <h4 className={classes.cardTitle}>{title}</h4>
                      </Tooltip>
                      <p>Ред. от <Date dateString={date} /></p>
                      <Button color="blue" href={`/docs/${id}`}>Смотреть</Button> {" "}
                      {summaryExists && <Button color="success" href={`/docs/summary/${id}`}>Кратко</Button>}
                    </CardBody>
                  </Card>
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
  const allDocs = getSortedDocsIDs()
  return {
    props: {
      allDocs
    }
  }
}