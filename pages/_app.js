import React from "react";
import ReactDOM from "react-dom";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'

import PageChange from "components/PageChange/PageChange.js";

import "assets/scss/nextjs-material-kit-pro.scss?v=1.1.0";

import "assets/css/react-demo.css";

import "assets/css/custom.css";

import "animate.css/animate.min.css";

Router.events.on("routeChangeStart", url => {
  console.log(`Загрузка: ${url}`);
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

/*class MyApp extends App {
  componentDidMount() {
    let comment = document.createComment(`
=========================================================
* Методические, учебные и просто полезные материалы для диспетчеров УВД
=========================================================

* Дизайн: NextJS Material Kit PRO v1.1.0, основано на Material Kit PRO - v2.0.2 (Bootstrap 4.0.0 Final Edition) и Material Kit PRO React v1.8.0
* Разработка темы Creative Tim (https://www.creative-tim.com)

* Доработка темы/разработка бекенда Vsevolod Epinetov (https://epinetov.com)
=========================================================

`);
    document.insertBefore(comment, document.documentElement);
  }

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    const userData = useUserData();

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, userData };
  }

  render() {
    const { Component, pageProps, userData } = this.props;

    return (
      <UserContext.Provider value={userData}>
          <React.Fragment>
            <Head>
              <title>Информация по ОВД | ATC</title>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-SPEBEGWV0S" />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-SPEBEGWV0S');
                  
                  `
                }}
              />
            </Head>
            <Component {...pageProps} />
          </React.Fragment>
      </UserContext.Provider>
    );
  }
}
*/


function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
        <React.Fragment>
          <Head>
            <title>Информация по ОВД | ATC</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-SPEBEGWV0S" />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SPEBEGWV0S');
              
              `
              }}
            />
          </Head>
          <Component {...pageProps} />
        </React.Fragment>
    </UserContext.Provider>
  )
}

export default MyApp