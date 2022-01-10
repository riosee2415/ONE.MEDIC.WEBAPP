import { createGlobalStyle, css } from "styled-components";

const fontStyle = css`
  @font-face {
    font-family: "NanumBarunGothic";
    font-style: normal;
    font-weight: 400;
    src: url("//cdn.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.eot");
    src: url("//cdn.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.eot?#iefix")
        format("embedded-opentype"),
      url("//cdn.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.woff")
        format("woff"),
      url("//cdn.jsdelivr.net/font-nanumlight/1.0/NanumBarunGothicWeb.ttf")
        format("truetype");
  }
`;

const GlobalStyles = createGlobalStyle`
  ${fontStyle}

  body {
    font-family: 'NanumSquare', sans-serif;
  }

  a {
    color : inherit;
    text-decoration : none;
  }

  textarea {
    resize: none;
    outline: none;
  }

  input {
    outline: none;
    font-family: "NanumBarunGothic";
  }
  
  a:hover {
    color : inherit;
  }
  
  @media (max-width : 576px) {
    html { 
      font-size : 14px;
    }
  }
`;

export default GlobalStyles;
