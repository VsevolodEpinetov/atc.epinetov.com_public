import {
  warningColor,
  primaryColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  defaultFont
} from "assets/jss/nextjs-material-kit-pro.js";

const tableStyle = {
  warning: {
    color: warningColor[0]
  },
  primary: {
    color: primaryColor[0]
  },
  danger: {
    color: dangerColor[0]
  },
  success: {
    color: successColor[0]
  },
  info: {
    color: infoColor[0]
  },
  rose: {
    color: roseColor[0]
  },
  gray: {
    color: grayColor[0]
  },
  right: {
    textAlign: "right"
  },
  table: {
    marginBottom: "0",
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "transparent",
    //borderSpacing: "0",
    borderSpacing: "2px",
    //borderCollapse: "collapse",
    borderCollapse: "separate",
    overflow: "auto",
    "& > tbody > tr, & > thead > tr": {
      height: "auto"
    },
    // below - added
    borderRadius: "6px",
    border: "1px solid #ececec"
  },
  tableShoppingHead: {
    fontSize: "0.75em !important",
    textTransform: "uppercase !important"
  },
  tableCell: {
    ...defaultFont,
    lineHeight: "1.5em",
    padding: "12px 8px!important",
    verticalAlign: "middle",
    fontSize: "0.875rem",
    borderBottom: "none",
    //borderTop: "1px solid " + grayColor[6],
    borderTop: "none",
    position: "relative",
    color: grayColor[1]
  },
  tableHeadCell: {
    fontSize: "1.063rem",
    borderBottomWidth: "1px",
    fontWeight: "600",
    color: grayColor[15],
    borderTopWidth: "0 !important"
  },
  tableCellTotal: {
    fontWeight: "500",
    fontSize: "1.0625rem",
    paddingTop: "20px",
    textAlign: "right"
  },
  tableCellAmount: {
    fontSize: "26px",
    fontWeight: "300",
    marginTop: "5px",
    textAlign: "right"
  },
  tableResponsive: {
    minHeight: "0.1%",
    overflowX: "auto"
  },
  tableStripedRow: {
    backgroundColor: grayColor[16]
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: grayColor[23]
    }
  },
  warningRow: {
    backgroundColor: warningColor[4],
    "&:hover": {
      backgroundColor: warningColor[5]
    }
  },
  dangerRow: {
    backgroundColor: dangerColor[4],
    "&:hover": {
      backgroundColor: dangerColor[5]
    }
  },
  successRow: {
    backgroundColor: successColor[4],
    "&:hover": {
      backgroundColor: successColor[5]
    }
  },
  infoRow: {
    backgroundColor: infoColor[4],
    "&:hover": {
      backgroundColor: infoColor[5]
    }
  }
};

export default tableStyle;
