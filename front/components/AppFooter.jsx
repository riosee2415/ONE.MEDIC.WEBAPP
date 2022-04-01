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
        <Wrapper fontWeight={`bold`}>미올한방병원</Wrapper>
        <Wrapper dr={`row`} fontSize={`12px`} margin={`15px 0`}>
          <Text color={Theme.grey_C}>대표</Text>
          <Text margin={`0 10px`}>이철희</Text>|
          <Text margin={`0 10px`} color={Theme.grey_C}>
            사업자등록번호
          </Text>
          <Text>347-49-00591</Text>
        </Wrapper>
        <Wrapper fontSize={`12px`}>
          서울특별시 은평구 통일로 636, 4층, 5층(녹번동, 은평 미드스퀘어)
        </Wrapper>
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
