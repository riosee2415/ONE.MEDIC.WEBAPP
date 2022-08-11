import React from "react";
import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";

const FindId = () => {
  return (
    <ClientLayout>
      <WholeWrapper>
        <RsWrapper minHeight={`calc(100vh - 170px - 64px)`}>
          <Wrapper padding={`100px 0`}>아이디 찾기</Wrapper>
        </RsWrapper>
      </WholeWrapper>
    </ClientLayout>
  );
};

export default FindId;
