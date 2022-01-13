import React, { useEffect, useState, useCallback } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../../store/configureStore";
import {
  RsWrapper,
  Wrapper,
  Image,
  WholeWrapper,
  TextInput,
  CommonButton,
  Text,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import useWidth from "../../hooks/useWidth";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { NOTICE_LIST_REQUEST } from "../../reducers/notice";
import { useRouter } from "next/router";

const DownArrow = styled(DownOutlined)`
  display: ${(props) => props.display};
`;

const UpArrow = styled(UpOutlined)`
  display: ${(props) => props.display};
`;

const Login = () => {
  const width = useWidth();

  const router = useRouter();

  const dispatch = useDispatch();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { notices } = useSelector((state) => state.notice);

  const [datum, setDatum] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const getQs = () => {
    const qs = router.query;

    let value = "";

    if (!qs.page) {
      setCurrentPage(1);
      value = "?page=1";
    } else {
      setCurrentPage(qs.page);
      value = `?page=${qs.page}`;
    }

    if (qs.search) {
      value += `&search=${qs.search}`;
    }

    return value;
  };

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  useEffect(() => {
    const qs = getQs();
    dispatch({
      type: NOTICE_LIST_REQUEST,
      data: {
        qs,
      },
    });
  }, [router.query]);
  ////// TOGGLE //////
  ////// HANDLER //////
  const onClickToggleHandler = useCallback(
    (data) => {
      setDatum(data);

      if (datum && datum.id === data.id) {
        setDatum("");
      }
    },
    [datum]
  );
  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>

      <ClientLayout>
        <WholeWrapper>
          <RsWrapper
            minHeight={`calc(100vh - 170px - 64px)`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Wrapper padding={`16px 0 0`}>
              {notices && notices.length === 0 ? (
                <Empty description={`조회된 데이터가 없습니다.`} />
              ) : (
                notices &&
                notices.map((data) => {
                  return (
                    <>
                      <Wrapper
                        dr={`row`}
                        padding={`18px 0px`}
                        cursor={`pointer`}
                        onClick={() => onClickToggleHandler(data)}
                        borderBottom={
                          datum && datum.id === data.id
                            ? `none`
                            : `1px solid ${Theme.grey2_C}`
                        }
                      >
                        <Wrapper width={`90%`} al={`flex-start`}>
                          <Text width={`auto`} fontSize={`18px`}>
                            <Text
                              width={`auto`}
                              fontSize={`14px`}
                              padding={`0 5px 0 0`}
                              color={Theme.subTheme2_C}
                              display={
                                data.type === "undefined" || null
                                  ? `none`
                                  : `inline`
                              }
                            >
                              [{data.type}]
                            </Text>

                            {data.title}
                          </Text>
                          <Text
                            fontSize={`14px`}
                            color={Theme.grey_C}
                            padding={`5px 0 0`}
                          >
                            {data.createdAt.substring(0, 10)}
                          </Text>
                        </Wrapper>
                        <Wrapper width={`10%`}>
                          <DownArrow
                            display={
                              datum && datum.id === data.id ? `none` : `flex`
                            }
                          />
                          <UpArrow
                            display={
                              datum && datum.id === data.id ? `flex` : `none`
                            }
                          />
                        </Wrapper>
                      </Wrapper>

                      {datum && datum.id === data.id && (
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          bgColor={Theme.lightGrey_C}
                          padding={`10px`}
                        >
                          <Text fontSize={`14px`}>{data.content}</Text>
                        </Wrapper>
                      )}
                    </>
                  );
                })
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

    context.store.dispatch({
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Login;
