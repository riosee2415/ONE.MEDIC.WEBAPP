import React from "react";
import { Text, Wrapper, WholeWrapper, RsWrapper } from "./commonComponents";
import Theme from "./Theme";
import styled from "styled-components";

const AppFooter = () => {
  return (
    <WholeWrapper>
      <RsWrapper
        fontSize={`14px`}
        bgColor={Theme.lightGrey2_C}
        padding={`25px 0`}
      >
        <Wrapper fontWeight={`bold`}>모던랩한의원</Wrapper>
        <Wrapper dr={`row`} fontSize={`12px`} margin={`15px 0`}>
          <Text color={Theme.grey_C}>대표</Text>
          <Text margin={`0 10px`}>김형규</Text>|
          <Text margin={`0 10px`} color={Theme.grey_C}>
            사업자등록번호
          </Text>
          <Text>251-24-01092</Text>
        </Wrapper>
        <Wrapper fontSize={`12px`}>서울 성동구 성수이로6길 13</Wrapper>
        <Wrapper dr={`row`} fontSize={`12px`} margin={`15px 0 0`}>
          <Text color={Theme.grey_C}>대표번호</Text>
          <Text margin={`0 10px`}>02-466-1575</Text>|
          <Text margin={`0 10px`} color={Theme.grey_C}>
            문의
          </Text>
          <Text>support@modernlab.io</Text>
        </Wrapper>
      </RsWrapper>
    </WholeWrapper>
  );
};

export default AppFooter;
