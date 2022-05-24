import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import ClientLayout from "../../components/ClientLayout";
import { Empty, Modal, Select, Radio, Form } from "antd";
import { RightOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
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
import { numberWithCommas } from "../../components/commonUtils";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { SEARCH_LIST_REQUEST } from "../../reducers/search";
import { PP_GET_REQUEST } from "../../reducers/prescriptionPrice";

const CustomCommonButton = styled(CommonButton)`
  border: 0px;
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
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
  const { userMaterials } = useSelector((state) => state.material);
  const { price } = useSelector((state) => state.prescriptionPrice);

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [toggleArr, setToggleArr] = useState([false, false]);
  const [isChecked, setIsChecked] = useState([false, false]);

  const [chubSelectArr, setChubSelectArr] = useState(null);
  const [packSelectArr, setPackSelectArr] = useState(null);
  const [volumnSelectArr, setVolumnSelectArr] = useState(null);

  const [chubSelect, setChubSelect] = useState("20");
  const [packSelect, setPackSelect] = useState("32");
  const [volumnSelect, setVolumnSelect] = useState("120");

  const [materialTotalPrice, setMaterialTotalPrice] = useState(0);
  const [packTotalPrice, setPackTotalPrice] = useState(0);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    let chubArr = [];
    let packArr = [];
    let volumnArr = ["60", "70", "80", "90", "100", "110", "120"];

    for (let i = 1; i < 51; i++) {
      chubArr.push(String(i));
    }
    for (let i = 1; i < 121; i++) {
      packArr.push(String(i));
    }

    setChubSelectArr(chubArr);
    setPackSelectArr(packArr);
    setVolumnSelectArr(volumnArr);
  }, [router.query]);

  useEffect(() => {
    if (price) {
      setPackTotalPrice(parseInt(packSelect) * price[0].price);
    }
  }, [price, packSelect]);

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

  const selectHandler = useCallback(
    (data) => {
      setChubSelect(data.chub ? data.chub : chubSelect);
      setPackSelect(data.pack ? data.pack : packSelect);
      setVolumnSelect(data.volumn ? data.volumn : volumnSelect);

      setIsModalVisible1(!isModalVisible1);
    },
    [chubSelect, packSelect, volumnSelect, isModalVisible1]
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
                    {chubSelect}첩 / {packSelect}팩 / {volumnSelect}ml
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
                  {userMaterials.map((data) => {
                    console.log(data);
                    return (
                      <ListWrapper
                        onClick={(e) => listHandler(toggleArr, 0)}
                        borderBottom={`1px solid ${Theme.grey2_C}`}
                      >
                        <Wrapper
                          dr={`row`}
                          width={`auto`}
                          fontSize={width < 600 ? `16px` : `18px`}
                          color={`${Theme.black_C}`}
                        >
                          <Text fontWeight={`800`}>{data.name}</Text>
                        </Wrapper>

                        <Text
                          color={`${Theme.black_C}`}
                          fontSize={width < 600 ? `16px` : `18px`}
                        >
                          {data.qnt}&nbsp;{data.unit}
                        </Text>

                        <Text
                          color={`${Theme.black_C}`}
                          fontSize={width < 600 ? `16px` : `18px`}
                        >
                          {data.qnt === 0
                            ? 0
                            : numberWithCommas(String(data.price))}
                          원
                        </Text>
                      </ListWrapper>
                    );
                  })}
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
                <Text fontWeight={`bold`}>
                  {numberWithCommas(
                    String(materialTotalPrice + packTotalPrice)
                  )}
                  원
                </Text>
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
          <CustomForm onFinish={selectHandler}>
            <Wrapper padding={`50px 30px`}>
              <Wrapper al={`flex-start`}>
                <Text
                  color={Theme.grey_C}
                  fontWeight={`800`}
                  padding={`10px 0 10px 0 `}
                >
                  첩수
                </Text>
                <Form.Item name="chub">
                  <ComboBox defaultValue="20">
                    {chubSelectArr &&
                      chubSelectArr.map((data) => (
                        <Option value={data}>{data}</Option>
                      ))}
                  </ComboBox>
                </Form.Item>
              </Wrapper>

              <Wrapper al={`flex-start`}>
                <Text
                  color={Theme.grey_C}
                  fontWeight={`800`}
                  padding={`10px 0 10px 0 `}
                >
                  팩수
                </Text>
                <Form.Item name="pack">
                  <ComboBox defaultValue="32">
                    {packSelectArr &&
                      packSelectArr.map((data) => (
                        <Option value={data}>{data}</Option>
                      ))}
                  </ComboBox>
                </Form.Item>
              </Wrapper>

              <Wrapper al={`flex-start`}>
                <Text
                  color={Theme.grey_C}
                  fontWeight={`800`}
                  padding={`10px 0 10px 0 `}
                >
                  팩용량
                </Text>
                <Form.Item name="volumn">
                  <ComboBox defaultValue="120">
                    {volumnSelectArr &&
                      volumnSelectArr.map((data) => (
                        <Option value={data}>{data}</Option>
                      ))}
                  </ComboBox>
                </Form.Item>
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
                <CommonButton
                  width={`90px`}
                  height={`40px`}
                  fontWeight={`800`}
                  htmlType="submit"
                >
                  완료
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </CustomForm>
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

    context.store.dispatch({
      type: SEARCH_LIST_REQUEST,
      data: {
        search: "",
      },
    });

    context.store.dispatch({
      type: PP_GET_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Prescription;
