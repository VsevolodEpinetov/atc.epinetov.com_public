import React from "react";
import Link from "next/link";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
import Close from "@material-ui/icons/Close";
// core components
import styles from "assets/jss/nextjs-material-kit-pro/components/headerStyle.js";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const classes = useStyles();
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;

    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, links, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Button className={classes.title}>
          <Link href="/">
            <img
              style={{ height: "1.5em", display: "block" }}
              className={classes.imgCardTop}
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NjIgMTU2IiB3aWR0aD0iNDYyIiBoZWlnaHQ9IjE1NiI+Cgk8c3R5bGU+CgkJdHNwYW4geyB3aGl0ZS1zcGFjZTpwcmUgfQoJCS5zaHAwIHsgZmlsbDogIzRjNGM0YyB9IAoJPC9zdHlsZT4KCTxwYXRoIGlkPSJSZWN0YW5nbGUgMSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGFzcz0ic2hwMCIgZD0iTTAgMTU0LjU1TDExNS4xIDExLjU3QzExNS4xIDExLjU3IDEyNS4zOSAxLjUzIDEzMy4yOCAxLjVDMTQxLjE2IDEuNDYgMTc2LjY5IDEuNSAxNzYuNjkgMS41TDE3Ni42OSAxNTUuNTZMOTkuOTYgMTU1LjU2Qzk5Ljk2IDE1NS41NiA4NS4xOSAxMzYuNiAxMTAuMDYgMTA4LjIzQzExMi4wNyAxMTIuMjYgMTE0LjA5IDExNi4yOSAxMTYuMTEgMTIwLjMyQzExNi4xMSAxMjAuMzIgMTE4LjA3IDEyMi4wNSAxMTkuMTQgMTE5LjMxQzExOC4xMyAxMTQuNjEgMTE3LjEyIDEwOS45MSAxMTYuMTEgMTA1LjIxTDExNi4xMSAxMDQuMkwxMjYuMjEgOTMuMTNMMTM5LjM0IDExMC4yNUMxMzkuMzQgMTEwLjI1IDE0My41IDExMi43MiAxNDIuMzcgMTA2LjIyQzEzOS42NyA5OC41IDEzNi45OCA5MC43OCAxMzQuMjkgODMuMDZMMTQ1LjM5IDYzLjkzQzE0NS4zOSA2My45MyAxNDcuMjQgNTguMjMgMTQxLjM2IDYwLjkxQzEzNi4zMSA2NS42IDEzMS4yNiA3MC4zIDEyNi4yMSA3NUwxMjYuMjEgNzYuMDFDMTE3LjQ2IDc1LjM0IDEwOC43MSA3NC42NyA5OS45NiA3NEM5OS45NiA3NCA5NC41NCA3My43MiA5Ny45NCA3Ny4wMkMxMDQuNjcgNzkuNyAxMTEuNCA4Mi4zOSAxMTguMTMgODUuMDdMMTE4LjEzIDg3LjA5QzExNC43NyA5MC43OCAxMTEuNCA5NC40NyAxMDguMDQgOTguMTZMOTQuOTEgOTguMTZDOTQuOTEgOTguMTYgOTAuNTYgOTkuMzggOTMuOSAxMDIuMTlDOTcuNiAxMDMuMiAxMDEuMyAxMDQuMiAxMDUuMDEgMTA1LjIxQzEwNS4wMSAxMDUuMjEgNjQuOTEgMTU5LjA5IDEuMDEgMTU0LjU1QzEuMDEgMTU0LjU1IDAuMzQgMTU0LjU1IDAgMTU0LjU1Wk0xOTIgMTVMMzAxIDE1TDMwMSA0NkwyNjMgNDZMMjYzIDE1NEwyMzAgMTU0TDIzMCA0NkwxOTIgNDZMMTkyIDE1Wk0zODkuMTcgMTIuMzRDNDI0LjY5IDEyLjM0IDQ1NC4xOSAzOC4xMyA0NTkuOTcgNzJMNDI4LjY1IDcyQzQyMy41OSA1NS4yMiA0MDguMDIgNDMgMzg5LjU5IDQzQzM2Ny4wNyA0MyAzNDguODEgNjEuMjYgMzQ4LjgxIDgzLjc4QzM0OC44MSAxMDYuMzEgMzY3LjA3IDEyNC41NyAzODkuNTkgMTI0LjU3QzQwNy40OSAxMjQuNTcgNDIyLjcgMTEzLjA0IDQyOC4xOSA5N0w0NTkuODYgOTdDNDUzLjgxIDEzMC41NSA0MjQuNDYgMTU2IDM4OS4xNyAxNTZDMzQ5LjUgMTU2IDMxNy4zNCAxMjMuODQgMzE3LjM0IDg0LjE3QzMxNy4zNCA0NC41IDM0OS41IDEyLjM0IDM4OS4xNyAxMi4zNFoiIC8+Cjwvc3ZnPg=="
              alt="Logo"
            />
          </Link>
        </Button>
        <Hidden smDown implementation="css" className={classes.hidden}>
          <div className={classes.collapse}>{links}</div>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.closeButtonDrawer}
          >
            <Close />
          </IconButton>
          <div className={classes.appResponsive}>{links}</div>
        </Drawer>
      </Hidden>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "dark"
};

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  links: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};
