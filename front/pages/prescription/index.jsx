import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../../reducers/user";
import ClientLayout from "../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  Image,
  CommonButton,
  SpanText,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { Empty, Modal, Select, Radio } from "antd";
import { useRouter } from "next/router";
import { RightOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import react, { useState } from "react";

const CustomCommonButton = styled(CommonButton)`
  border: 0px;
`;

const ListWrapper = styled(Wrapper)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px;
  cursor: pointer;
`;

const DeleteModal = styled(Modal)`
  .ant-modal-close-x {
    display: none;
  }

  .ant-modal-content {
    border-radius: 20px;
  }
`;

const SelectModal = styled(Modal)`
  .ant-modal-close-x {
    font-size: 25px;
    width: 60px;
  }

  .ant-modal-content {
    border-radius: 20px;
  }
`;

const ComboBox = styled(Select)`
  width: 100%;
  border: 0px;

  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0px;
    border-bottom: 1px solid ${Theme.grey2_C};
    padding: 0px;
  }

  &.ant-select-selector {
    padding: 0;
  }
`;

const RadioBox = styled(Radio)`
  .ant-radio-inner::after {
    background-color: ${Theme.subTheme_C};
  }

  .ant-radio-checked .ant-radio-inner {
    border-color: ${Theme.subTheme_C};
  }
`;

const Prescription = ({}) => {
  const width = useWidth();

  const { Option } = Select;

  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [toggleArr, setToggleArr] = useState([false, false]);
  const [isChecked, setIsChecked] = useState([false, false]);
  ////// REDUX //////
  ////// USEEFFECT //////

  ////// TOGGLE //////

  const ModalToggleHandler1 = useCallback(() => {
    setIsModalVisible1(!isModalVisible1);
  }, [isModalVisible1]);

  const ModalToggleHandler2 = useCallback(() => {
    setIsModalVisible2(!isModalVisible2);
  }, [isModalVisible2]);
  ////// HANDLER //////

  const listHandler = useCallback((bool, idx2) => {
    let save = toggleArr.map((data, idx) => {
      return idx === idx2 ? !data : data;
    });

    setToggleArr(save);
  }, []);

  const okModalDeleteHandler = useCallback(() => {}, []);

  const okModalKindofHandler = useCallback(() => {}, []);

  const deleteHandler = useCallback(() => {
    ModalToggleHandler2();
  }, [isModalVisible1, isModalVisible2]);

  const radioBoxHandler = useCallback((e, idx2) => {
    let save = isChecked.map((data, idx) => {
      return idx === idx2 ? !data : data;
    });

    setIsChecked(save);
  }, []);
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
            minHeight={`calc(100vh - 64px)`}
            ju={`flex-start`}
            position={`relative`}
            padding={`0`}
          >
            <Wrapper
              height={`64px`}
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `0px 10px` : `0px 38px`}
              dr={`row`}
            >
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/1.prescrip.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
                  처방정보
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              {/* <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/2.cart_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  장바구니
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              /> */}
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/3.delivery_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  배송정보
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/4.card_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  결제정보
                </Text>
              </Wrapper>
            </Wrapper>
            <Wrapper
              padding={width < 800 ? `15px 10px` : `15px 38px`}
              minHeight={`calc(100vh - 170px)`}
              ju={`flex-start`}
            >
              <Wrapper
                padding={`20px`}
                shadow={Theme.shadow_C}
                radius={`20px`}
                margin={`0 0 15px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey_C}>종류</Text>
                  <Image
                    onClick={() => ModalToggleHandler1()}
                    cursor={`pointer`}
                    alt="icon"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/pencil.png`}
                    width={`16px`}
                  />
                </Wrapper>
                <Wrapper argin={`10px 0 0`} al={`flex-start`}>
                  <Text fontSize={width < 800 ? `16px` : `18px`}>
                    20첩 / 32팩 / 120ml
                  </Text>
                </Wrapper>
              </Wrapper>
              <Wrapper padding={`20px`} shadow={Theme.shadow_C} radius={`20px`}>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`0 5px 10px`}
                >
                  <Text color={Theme.grey_C} fontSize={`16px`}>
                    구성약재
                  </Text>
                  <Image
                    onClick={() => ModalToggleHandler2()}
                    cursor={`pointer`}
                    alt="icon"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/garbage.png`}
                    width={`16px`}
                  />
                </Wrapper>
                <Wrapper>
                  <ListWrapper
                    onClick={(e) => listHandler(toggleArr, 0)}
                    borderBottom={
                      toggleArr[0] ? `null` : `1px solid ${Theme.grey2_C}`
                    }
                  >
                    <Wrapper
                      dr={`row`}
                      width={`auto`}
                      fontSize={width < 600 ? `16px` : `18px`}
                      color={`${Theme.black_C}`}
                    >
                      {/* {toggleArr[0] ? (
                        <UpOutlined
                          style={{
                            padding: "0 12px 0 0",
                            color: `${Theme.grey3_C}`,
                          }}
                        />
                      ) : (
                        <DownOutlined
                          style={{
                            padding: "0 12px 0 0",
                            color: `${Theme.grey3_C}`,
                          }}
                        />
                      )} */}

                      <Text fontWeight={`800`}>녹용</Text>
                    </Wrapper>

                    <Text
                      color={`${Theme.black_C}`}
                      fontSize={width < 600 ? `16px` : `18px`}
                    >
                      6&nbsp;g
                    </Text>

                    <Text
                      color={`${Theme.black_C}`}
                      fontSize={width < 600 ? `16px` : `18px`}
                    >
                      57,880
                    </Text>
                  </ListWrapper>

                  {/* {toggleArr[0] && (
                    <Wrapper bgColor={Theme.lightGrey_C} padding={`10px 0px`}>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`0 0 5px 0`}
                        padding={`0 10px 0 30px`}
                      >
                        <Wrapper dr={`row`} width={`auto`}>
                          <RadioBox
                            onChange={(e) => radioBoxHandler(e, 0)}
                            checked={isChecked[0]}
                          >
                            <Text color={Theme.black_C} fontSize={`16px`}>
                              뉴질랜드&nbsp;
                              <SpanText
                                fontSize={`14px`}
                                color={`${Theme.grey_C}`}
                              >
                                (중대)
                              </SpanText>
                            </Text>
                          </RadioBox>
                        </Wrapper>

                        <Wrapper width={`auto`} color={Theme.black_C}>
                          <Text fontSize={`16px`}>19,280</Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        bgColor={Theme.lightGrey_C}
                        padding={`0 10px 0 30px`}
                      >
                        <Wrapper dr={`row`} width={`auto`}>
                          <RadioBox
                            onChange={(e) => radioBoxHandler(e, 1)}
                            checked={isChecked[1]}
                          >
                            <Text color={Theme.black_C} fontSize={`16px`}>
                              러시아&nbsp;
                              <SpanText
                                fontSize={`14px`}
                                color={`${Theme.grey_C}`}
                              >
                                (중대)
                              </SpanText>
                            </Text>
                          </RadioBox>
                        </Wrapper>

                        <Wrapper width={`auto`} color={Theme.black_C}>
                          <Text fontSize={`16px`}>19,280</Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  )} */}
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper
              height={`50px`}
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}
              bgColor={Theme.white_C}
            >
              <Wrapper
                height={`100%`}
                dr={`row`}
                width={
                  width < 800 ? `calc(100% - 130px)` : `calc(100% - 170px)`
                }
                ju={`flex-start`}
                padding={width < 800 ? `0 10px` : `0 38px`}
                fontSize={width < 800 ? `15px` : `20px`}
              >
                <Text fontWeight={`bold`}>총 주문금액 : </Text>
                <Text fontWeight={`bold`}> 432,000</Text>
              </Wrapper>
              <CommonButton
                shadow={`0`}
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
              >
                주문하기
              </CommonButton>
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>

        {/*  KindOf Modal */}
        <SelectModal
          visible={isModalVisible1}
          onOk={() => okModalDeleteHandler()}
          onCancel={() => ModalToggleHandler1()}
          footer={null}
          width={350}
        >
          <Wrapper padding={`50px 30px`}>
            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.grey_C}
                fontWeight={`800`}
                padding={`10px 0 10px 0 `}
              >
                첩수
              </Text>
              <ComboBox defaultValue="lucy">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
              </ComboBox>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.grey_C}
                fontWeight={`800`}
                padding={`10px 0 10px 0 `}
              >
                팩수
              </Text>
              <ComboBox defaultValue="lucy">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
              </ComboBox>
            </Wrapper>

            <Wrapper al={`flex-start`}>
              <Text
                color={Theme.grey_C}
                fontWeight={`800`}
                padding={`10px 0 10px 0 `}
              >
                팩용량
              </Text>
              <ComboBox defaultValue="lucy">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
              </ComboBox>
            </Wrapper>

            <Wrapper margin={`20px 0 0 0`}>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Text fontWeight={`600`} color={Theme.grey_C}>
                  총 용량
                </Text>
                <Text fontSize={`18px`}>
                  10,488.0
                  <SpanText fontSize={`16px`} color={Theme.grey_C}>
                    g
                  </SpanText>
                </Text>
              </Wrapper>
              <Wrapper dr={`row`} ju={`space-between`}>
                <Text fontWeight={`600`} color={Theme.grey_C}>
                  약제비
                </Text>
                <Text fontSize={`18px`}>
                  223,920
                  <SpanText fontSize={`16px`} color={Theme.grey_C}>
                    원
                  </SpanText>
                </Text>
              </Wrapper>
            </Wrapper>
            <Wrapper al={`flex-end`} margin={`10px 0 0 0`}>
              <CommonButton width={`90px`} height={`40px`} fontWeight={`800`}>
                완료
              </CommonButton>
            </Wrapper>
          </Wrapper>
        </SelectModal>

        {/*  Delete Modal */}
        <DeleteModal
          width={380}
          visible={isModalVisible2}
          onOk={() => okModalKindofHandler()}
          onCancel={() => ModalToggleHandler2()}
          footer={null}
        >
          <Wrapper>
            <Wrapper ju={`flex-start`} padding={`30px 0 10px 0`}>
              <Text color={Theme.grey_C} fontSize={`18px`}>
                선택된 약재를 삭제하시겠습니까?
              </Text>
              <Wrapper dr={`row`} padding={`10px 0 0 60px`}>
                <CustomCommonButton
                  onClick={() => deleteHandler()}
                  kindOf={`white`}
                  width={`90px`}
                  height={`40px`}
                  margin={`0 5px 0 0`}
                  border={`1px solid ${Theme.white_C}`}
                  shadow={`0px`}
                >
                  아니요
                </CustomCommonButton>
                <CommonButton
                  width={`90px`}
                  height={`40px`}
                  onClick={() => deleteHandler()}
                >
                  네
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </DeleteModal>
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
export default Prescription;
