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

import Subject from "@material-ui/icons/Subject";
import YouTube from "@material-ui/icons/YouTube";
import Pageview from "@material-ui/icons/Pageview";

import postsPageStyle from "assets/jss/nextjs-material-kit-pro/pages/postsPageStyle.js";

import { getSortedPostsData } from 'lib/posts'
import Date from 'lib/date'

const useStyles = makeStyles(postsPageStyle);

function convertPostTypeToRussian (postType) {
  switch (postType) {
    case 'article':
      return 'Статья';
    case 'yt':
      return 'Видео';
    default:
      return 'Полезность';
  }
  return 'Полезность';
}

export default function docsPage({ allPostsData }) {
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
              style={{ marginBottom: '3em !important' }}
              key='posts-header'
            >
              <h2 className={classes.title}>Полезные материалы</h2>
              <h5 className={classes.description}>
                То, что кажется полезным, но не подошло под другие категории
              </h5>
            </GridItem>
          </GridContainer>
          <GridContainer alignItems="stretch" spacing={3} direction="row" justify="flex-start" alignItems="baseline">
            {
              allPostsData.map(({ id, title, type, link, description }) => (
                <GridItem
                  md={4}
                  className={
                    classes.textCenter
                  }
                  item
                  key={`card-${id}`}
                >
                  <Card
                    background
                    style={{
                      backgroundImage: `url(https://storage.googleapis.com/atc.epinetov.com/public/posts/${id}/thumbnail.webp)`
                    }}
                  >
                    <CardBody background>
                      <h6 className={classes.cardCategoryWhite}>{convertPostTypeToRussian(type)}</h6>
                      <a href={`/posts/${id}`} onClick={e => e.preventDefault()}>
                        <h3 className={classes.cardTitleWhite}>
                          {title}
                        </h3>
                      </a>
                      {
                        description && (
                          <p className={classes.cardDescriptionWhite}>
                            {description}
                          </p>
                        )
                      }

                      { 
                        type == 'article' && (
                          <Button simple color="white" href={`/posts/${id}`}>
                            <Subject /> Читать
                          </Button>
                        )
                      }
                      { 
                        type == 'yt' && (
                          <Button simple color="white" href={`${link}`} target="_blank">
                            <YouTube /> Смотреть
                          </Button>
                        )
                      }
                      { 
                        type == 'link' && (
                          <Button simple color="white" href={`${link}`}>
                            <Pageview /> Перейти
                          </Button>
                        )
                      }
                    </CardBody>
                  </Card>
                </GridItem>
              ))
            }
          </GridContainer>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}