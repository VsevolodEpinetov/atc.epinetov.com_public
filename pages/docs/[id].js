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
import Parallax from "components/Parallax/Parallax.js";
import Hidden from '@material-ui/core/Hidden';
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Footer from "components/Footer/Footer.js";
import BackToTopButton from "components/BackToTopButton/BackToTopButton.js"
import smoothScroll from "components/SmoothScroll/SmoothScroll.js"
// styles
import docPageStyle from "assets/jss/nextjs-material-kit-pro/pages/docPageStyle.js";
// libraries
import { getAllDocsIds, getDocData } from 'lib/docs'
import Date from 'lib/date'
// images

const useStyles = makeStyles(docPageStyle);

export default function DocPage({ docData }) {
  const [mainWidthForMD, setMainWidthMD] = React.useState(8)
  const [navigationBarIsSeen, setNavigationBarIsSeen] = React.useState('')
  const [navBarHeight, setNavBarHeight] = React.useState(9999)


  React.useEffect(() => {
    const onScroll = e => {
      if (navBarHeight === 9999) setNavBarHeight(document.getElementById('navigation-bar').offsetHeight + 500)
      if (e.target.documentElement.scrollTop > navBarHeight) {
        setMainWidthMD(12);
        setNavigationBarIsSeen('filtered')
      } else {
        setMainWidthMD(8);
        setNavigationBarIsSeen('')
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  const structureList = (structure) => {
    const headersLinks = Object.keys(structure).map(id => {
      let subheaderLinks;
      if (structure[id].subheaders) subheaderLinks = structure[id].subheaders.map((subheader, subheaderID) => <li key={`link-${id}-${subheaderID}`}><a href={`#${id}-${subheaderID}`} onClick={e => { e.preventDefault(); smoothScroll(`${id}-${subheaderID}`); }}>{subheader}</a></li>)
      return <span><li key={`link-${id}`}><a href={`#${id}`} onClick={e => { e.preventDefault(); smoothScroll(`${id}`); }}>{structure[id].name}</a></li><ul className='nav-sidebar-subheaders'>{subheaderLinks}</ul></span>;
    });
    return (<ul className='nav-sidebar-headers'>{headersLinks}</ul>);
  }

  const navigationLinks = (docData) => {
    var summaryLink = <a href='#' className='link-is-disabled'>✂️ Краткая версия</a>;

    if (docData.summaryExists) summaryLink = <Link href={`summary/${docData.id}`}><a>✂️ Краткая версия</a></Link>

    return (
      <div>
        <h5>Ссылки</h5>
        {summaryLink}<br />
        <a href="#" className='link-is-disabled'>✅ Скачать документ</a> <br />
        <Link href='/docs'><a>📄 К документам</a></Link> <br />
        <Link href='/'><a>🏠 На главную</a></Link>
      </div>
    )
  }

  const navigationElements = (docData) => {
    return (
      <Card id='navigation-bar'>
        <CardBody>
          {navigationLinks(docData)}
          <br />
          <h5>Навигация</h5>
          {structureList(docData.structure)}
        </CardBody>
      </Card>
    )
  }

  const classes = useStyles();
  return (
    <div>
      <Header
        links={<HeaderLinks dropdownHoverColor="dark" />}
        color="transparent"
        fixed
        changeColorOnScroll={{
          height: 300,
          color: "white"
        }}
      />
      <Parallax image='https://storage.googleapis.com/atc.epinetov.com/public/img/pattern-bg.webp' small filter="light">
        <div className={classes.container} id="start">
          <GridContainer justify="center">
            <GridItem md={8} className={classes.textCenter} key='document-header'>
              <h1 className={classes.title}> {docData.title} </h1>
              <h4 className={classes.subtitle}> Редакция от <Date dateString={docData.date} /> </h4>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classes.main}>
        <div className={classes.container}>
          <div className={classes.section}>
            <GridContainer justify="center">
              <Hidden mdUp>
                <GridItem sm={12} key='document-nav-sm-devices'>
                  {navigationElements(docData)}
                </GridItem>
              </Hidden>

              <GridItem xs={12} sm={12} md={mainWidthForMD} id="document-body" key='document-header'>
                <div dangerouslySetInnerHTML={{ __html: docData.contentHtml }} />
              </GridItem>

              <Hidden smDown>
                <GridItem md={4} className={navigationBarIsSeen} key='document-nav-md-devices'>
                  {navigationElements(docData)}
                </GridItem>
              </Hidden>
            </GridContainer>
          </div>
        </div>
      </div>
      <BackToTopButton />
      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllDocsIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const docData = await getDocData(params.id)
  return {
    props: {
      docData
    }
  }
}