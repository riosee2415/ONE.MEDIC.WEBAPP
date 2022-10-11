import React, { useEffect } from "react";
import ClientLayout from "../../components/ClientLayout";

import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import axios from "axios";

import { FIND_EMAIL_REQUEST, LOAD_MY_INFO_REQUEST } from "../../reducers/user";

import Head from "next/head";
import {
  CommonButton,
  Image,
  RsWrapper,
  Text,
  TextInput,
  WholeWrapper,
  Wrapper,
} from "../../components/commonComponents";
import { useState } from "react";
import { useCallback } from "react";
import Link from "next/link";
import useInput from "../../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { message } from "antd";

const Index = () => {
  ////// GLOBAL STATE //////
  const { email, st_findEmailDone, st_findEmailError } = useSelector(
    (state) => state.user
  );

  ////// HOOKS //////
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();

  const name = useInput("");
  const mobile = useInput("");

  const [currentTab, setCurrentTab] = useState(false);

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_findEmailDone) {
      name.setValue("");
      mobile.setValue("");

      if (!email) {
        return message.error("올바르지 않은 정보입니다.");
      }

      setCurrentTab(true);

      return message.success("이메일을 찾았습니다.");
    }
  }, [st_findEmailDone]);

  useEffect(() => {
    if (st_findEmailError) {
      return message.error(st_findEmailError);
    }
  }, [st_findEmailError]);

  ////// TOGGLE //////

  ////// HANDLER //////
  const findEmailHandler = useCallback(() => {
    if (!name.value || name.value.trim() === "") {
      return message.error("이름을 입력해주세요.");
    }

    if (!mobile.value || mobile.value.trim() === "") {
      return message.error("휴대폰번호를 입력해주세요.");
    }

    dispatch({
      type: FIND_EMAIL_REQUEST,
      data: {
        nickname: name.value,
        mobile: mobile.value,
      },
    });
  }, [name.value, mobile.value]);

  ////// DATAVIEW //////

  const findEmail = email || "";

  const _view = findEmail.split("@");

  const __email = _view[0].slice(0, _view[0].length - 3);

  const viewEmail = __email + "***";

  const findViewEmail = viewEmail + "@" + _view[1];

  return (
    <>
      <Head>
        <title>ModerlLab | 이메일찾기</title>
      </Head>

      <ClientLayout>
        <WholeWrapper padding={width < 700 ? `100px 0` : `0`}>
          <RsWrapper minHeight={`calc(100vh - 170px - 64px)`}>
            <Wrapper width={width < 700 ? `100%` : `450px`}>
              {currentTab ? (
                <>
                  <Text
                    fontSize={`20px`}
                    fontWeight={`600`}
                    margin={`0 0 10px`}
                  >
                    이메일 찾기 결과
                  </Text>
                  <Text
                    margin={`0 0 45px`}
                    fontSize={`14px`}
                    color={Theme.darkGrey4_C}
                  >
                    입력하신 정보와 일치하는 이메일 정보입니다.
                  </Text>

                  <Wrapper al={`flex-start`}>
                    <Wrapper
                      height={`40px`}
                      border={`1px solid ${Theme.lightGrey2_C}`}
                      radius={`10px`}
                      padding={`10px 15px`}
                      al={`flex-start`}
                      margin={`0 0 10px`}
                    >
                      {findViewEmail}
                    </Wrapper>
                  </Wrapper>
                  <Text
                    fontSize={`14px`}
                    color={Theme.lightGrey6_C}
                    margin={`0 0 25px`}
                  >
                    개인정보보호를 위해 이메일 뒷자리는 ***로 표시됩니다.
                  </Text>

                  <Link href="/login">
                    <CommonButton
                      width={`100%`}
                      height={`50px`}
                      padding={`0`}
                      margin={`0 0 20px`}
                    >
                      로그인 하기
                    </CommonButton>
                  </Link>
                </>
              ) : (
                <>
                  <Text
                    fontSize={`20px`}
                    fontWeight={`600`}
                    margin={`0 0 40px`}
                  >
                    이메일 찾기
                  </Text>

                  <Wrapper al={`flex-start`} margin={`0 0 20px`}>
                    <Text
                      fontSize={`16px`}
                      color={Theme.darkGrey3_C}
                      fontWeight={`600`}
                      margin={`0 0 10px`}
                    >
                      이름
                    </Text>
                    <TextInput
                      width={`100%`}
                      height={`50px`}
                      placeholder="이름을 입력해주세요."
                      {...name}
                      onKeyDown={(e) => e.keyCode === 13 && findEmailHandler()}
                    />
                  </Wrapper>

                  <Wrapper al={`flex-start`} margin={`0 0 20px`}>
                    <Text
                      fontSize={`16px`}
                      fontWeight={`600`}
                      margin={`0 0 10px`}
                    >
                      연락처
                    </Text>
                    <TextInput
                      width={`100%`}
                      height={`50px`}
                      placeholder="연락처를 입력해주세요."
                      {...mobile}
                      onKeyDown={(e) => e.keyCode === 13 && findEmailHandler()}
                    />
                  </Wrapper>

                  <CommonButton
                    width={`100%`}
                    height={`50px`}
                    padding={`0`}
                    onClick={findEmailHandler}
                  >
                    이메일 찾기
                  </CommonButton>
                </>
              )}
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>
      </ClientLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // SSR Cookie Settings For Data Load/////////////////////////////////////
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    ////////////////////////////////////////////////////////////////////////
    // 구현부

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Index;
