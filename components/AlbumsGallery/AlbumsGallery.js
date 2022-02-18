import React from "react";

import { SRLWrapper } from 'simple-react-lightbox-pro'

// @material-ui/icons
import ExpandMore from "@material-ui/icons/ExpandMore";

function AlbumsGallery() {
  return (
    <SRLWrapper>
    <a href="https://storage.googleapis.com/atc.epinetov.com/public/aircraft/b747/main.webp" className="element_with_overlay">
      <div className="overlay" srl_overlay="true">
        <h1>Funny cap</h1>
        <p>£30.00</p>
      </div>
      <img src="https://storage.googleapis.com/atc.epinetov.com/public/aircraft/b747/main.webp" alt="Funny cap" />
    </a>
  </SRLWrapper>
  );
}

export default AlbumsGallery;