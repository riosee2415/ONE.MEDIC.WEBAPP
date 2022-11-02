import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import ClientLayout from "../../components/ClientLayout";
import { Empty, Modal, Select, Radio, Form, message, Input } from "antd";
import { RightOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  Image,
  CommonButton,
  SpanText,
  TextInput,
  GuideLi,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { numberWithCommas } from "../../components/commonUtils";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { SEARCH_LIST_REQUEST } from "../../reducers/search";
import { PP_GET_REQUEST } from "../../reducers/prescriptionPrice";
import { MATERIAL_USER_ADD } from "../../reducers/material";
import {
  PPR_CREATE_REQUEST,
  PPR_DETAIL_REQUEST,
} from "../../reducers/prescriptionPaymentRequest";

import useInput from "../../hooks/useInput";
import { REQUEST_ALL_LIST_REQUEST } from "../../reducers/userRequest";
import { WISH_PRE_CREATE_REQUEST } from "../../reducers/wish";

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
  border-bottom: 1px solid ${Theme.grey2_C};
  padding: 10px 5px;
  cursor: pointer;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-close-x {
    display: none;
  }

  & .ant-modal-content {
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

const Prescription = ({}) => {
  const width = useWidth();

  const { Option } = Select;

  ////// GLOBAL STATE //////
  const { userMaterials } = useSelector((state) => state.material);
  const { price } = useSelector((state) => state.prescriptionPrice);
  const { pprId, pprDetail, st_pprCreateDone, st_pprCreateError } = useSelector(
    (state) => state.prescriptionPaymentRequest
  );

  const {
    st_wishPreCreateLoading,
    st_wishPreCreateDone,
    st_wishPreCreateError,
  } = useSelector((state) => state.wish);

  const { me } = useSelector((state) => state.user);

  const { requestAllList } = useSelector((state) => state.userRequest);

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [isModalVisible3, setIsModalVisible3] = useState(false);

  const [chubSelectArr, setChubSelectArr] = useState(null);
  const [packSelectArr, setPackSelectArr] = useState(null);
  const [volumnSelectArr, setVolumnSelectArr] = useState(null);

  const [chubSelect, setChubSelect] = useState("20");
  const [packSelect, setPackSelect] = useState("32");
  const [volumnSelect, setVolumnSelect] = useState("120");

  const [materialTotalPrice, setMaterialTotalPrice] = useState(0);
  const [materialTotalUnit, setMaterialTotalUnit] = useState(0);
  const [packTotalPrice, setPackTotalPrice] = useState(0);

  const [selectMaterial, setSelectMaterial] = useState(0);
  const [materialArr, setMaterialArr] = useState(null);

  // 수량 선택 수정
  const qntInput = useInput(0);
  const [qntForm] = Form.useForm();
  const [qntSelect, setQntSelect] = useState(null);

  // 요청사항 모달
  const [rForm] = Form.useForm();
  const [rData, setRData] = useState(null);
  const [rModal, setRModal] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////

  // 로그인

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push("/login");
    }
  }, [me]);

  // 첩, 팩, 용량 select
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

    sessionStorage.removeItem("recipeName");
    setChubSelectArr(chubArr);
    setPackSelectArr(packArr);
    setVolumnSelectArr(volumnArr);

    const rePprData = sessionStorage.getItem("rePprData")
      ? JSON.parse(sessionStorage.getItem("rePprData"))
      : null;

    if (rePprData) {
      dispatch({
        type: PPR_DETAIL_REQUEST,
        data: {
          pprId: rePprData.id,
        },
      });
    }
    return;
  }, [router.query]);

  useEffect(() => {
    if (pprDetail) {
      dispatch({
        type: MATERIAL_USER_ADD,
        data: pprDetail.materialDatum.map((data) => ({
          id: data.MaterialId,
          name: data.name,
          qnt: data.qnt,
          unit: data.unit,
          price: data.buyPrice,
        })),
      });

      sessionStorage.removeItem("rePprData");

      return;
    }
  }, [pprDetail]);

  // 팩 가격
  useEffect(() => {
    if (price) {
      setPackTotalPrice(parseInt(packSelect) * price.packPrice);
    }
  }, [price, packSelect]);

  // 약재 선택시 실행되는 effect
  // 선택된 전체 약재 가격 & 선택된 전체 약재 용량

  useEffect(() => {
    if (userMaterials) {
      setMaterialArr(userMaterials.map((data) => data));

      setMaterialTotalPrice(
        userMaterials &&
          userMaterials.length > 0 &&
          userMaterials
            .map((data) => data.price * data.qnt)
            .reduce((a, b) => a + b)
      );

      setMaterialTotalUnit(
        userMaterials &&
          userMaterials.length > 0 &&
          userMaterials.map((data) => data.qnt).reduce((a, b) => a + b)
      );
    }
  }, [userMaterials]);

  // 주문하기

  useEffect(() => {
    if (st_wishPreCreateDone) {
      router.push("/cart");
      return message.success("장바구니에 담겼습니다.");
    }
  }, [st_wishPreCreateDone]);

  useEffect(() => {
    if (st_wishPreCreateError) {
      return message.error(st_wishPreCreateError);
    }
  }, [st_wishPreCreateError]);

  ////// TOGGLE //////

  // 종류 변경 모달
  const modalToggleHandler1 = useCallback(() => {
    setIsModalVisible1(!isModalVisible1);
  }, [isModalVisible1]);

  // 약재 삭제 모달
  const modalToggleHandler2 = useCallback(() => {
    if (!selectMaterial) {
      return message.error("재료를 선택해주세요.");
    }
    setIsModalVisible2(!isModalVisible2);
  }, [isModalVisible2, selectMaterial]);

  // 약재 용량 수정 모달
  const modalToggleHandler3 = useCallback(() => {
    if (!selectMaterial) {
      return message.error("재료를 선택해주세요.");
    }

    qntForm.setFieldsValue({
      qnt: selectMaterial.qnt,
    });
    setIsModalVisible3(!isModalVisible3);
  }, [isModalVisible3, selectMaterial]);

  // 수량 선택
  const qntSelectHandler = useCallback(
    (data) => {
      if (qntSelect === data.id) {
        setQntSelect(null);
        qntInput.setValue(0);
        return;
      }

      qntInput.setValue(data.qnt);
      setQntSelect(data.id);
    },
    [qntSelect, qntInput.value]
  );

  // 요청사항 모달
  const rModalToggle = useCallback(() => {
    if (rData) {
      rForm.setFieldsValue(rData);
    } else {
      rForm.resetFields();
    }

    setRModal((prev) => !prev);
  }, [rData, rModal]);

  ////// HANDLER //////

  // 약재 선택
  const selectMaterialHandler = useCallback(
    (data) => {
      setSelectMaterial(data);
    },
    [selectMaterial]
  );

  // 약재 삭제
  const deleteMaterialHandler = useCallback(() => {
    if (!selectMaterial) {
      return message.error("재료를 선택해주세요.");
    }

    dispatch({
      type: MATERIAL_USER_ADD,
      data: materialArr.filter((data) => data.id !== selectMaterial.id),
    });

    setMaterialArr(materialArr.filter((data) => data.id !== selectMaterial.id));

    setSelectMaterial(null);
    setIsModalVisible2(false);
  }, [materialArr, selectMaterial, isModalVisible2]);

  // 종류 선택
  const selectHandler = useCallback(
    (data) => {
      setChubSelect(data.chub ? data.chub : chubSelect);
      setPackSelect(data.pack ? data.pack : packSelect);
      setVolumnSelect(data.volumn ? data.volumn : volumnSelect);

      setIsModalVisible1(!isModalVisible1);
    },
    [chubSelect, packSelect, volumnSelect, isModalVisible1]
  );

  // 약제 용량 수정
  const qntSaveHandler = useCallback(() => {
    if (
      !qntSelect ||
      userMaterials.find((item) => item.id === qntSelect).qnt ===
        Math.round(parseFloat(qntInput.value) * 100) / 100 ||
      !qntInput.value ||
      Math.round(parseFloat(qntInput.value) * 100) / 100 === 0
    ) {
      return;
    }

    const updateArr = userMaterials.map((item) => {
      if (item.id === qntSelect) {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          qnt: Math.round(parseFloat(qntInput.value) * 100) / 100,
          unit: item.unit,
        };
      } else {
        return item;
      }
    });

    dispatch({
      type: MATERIAL_USER_ADD,
      data: updateArr,
    });

    setQntSelect(null);
  }, [userMaterials, qntSelect, qntInput.value]);

  // 약재 용량 수정
  const updateQntHandler = useCallback(
    (data) => {
      const updateArr = userMaterials.map((item) => {
        if (item.id === selectMaterial.id) {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            qnt: Math.round(parseFloat(data.qnt) * 100) / 100,
            unit: item.unit,
          };
        } else {
          return item;
        }
      });

      dispatch({
        type: MATERIAL_USER_ADD,
        data: updateArr,
      });

      setSelectMaterial(null);
      setIsModalVisible3(false);
    },
    [userMaterials, selectMaterial, isModalVisible3]
  );

  // 주문하기
  const paymentCreateHandler = useCallback(() => {
    sessionStorage.setItem("METAERIAL", JSON.stringify(userMaterials));
    sessionStorage.setItem(
      "METAERIAL2",
      JSON.stringify({
        chubSelect: chubSelect + "첩",
        packSelect: packSelect + "팩",
        volumnSelect: volumnSelect + "ml",
      })
    );
    const recipeName = sessionStorage.getItem("recipeName");

    if (!rData) {
      return message.error("요청사항을 설정해주세요.");
    }

    for (let i = 0; i < userMaterials.length; i++) {
      if (userMaterials[i].qnt === 0) {
        return message.error("용량이 0인 약재가 있습니다.");
      }
    }

    // dispatch({
    //   type: PPR_CREATE_REQUEST,
    //   data: {
    //     useMaterialData: userMaterials,
    //     totalPrice: materialTotalPrice + packTotalPrice,
    //     name: recipeName
    //       ? recipeName
    //       : `${userMaterials[0].name}${
    //           userMaterials.length > 1 ? `외 ${userMaterials.length - 1}개` : ""
    //         }`,
    //   },
    // });

    dispatch({
      type: WISH_PRE_CREATE_REQUEST,
      data: {
        title: rData.title,
        totalPrice: materialTotalPrice * 100 + packTotalPrice,
        cheob: chubSelect,
        pack: packSelect,
        unit: volumnSelect,
        receiverName: rData.receiverName,
        content: rData.content,
        medication: rData.medication,
        materials: userMaterials.map((data) => {
          return { materialId: data.id, ...data };
        }),
      },
    });
  }, [
    rData,
    userMaterials,
    materialTotalPrice,
    packTotalPrice,
    chubSelect,
    packSelect,
    volumnSelect,
  ]);

  // 요청사항 선택
  const requestChangeHandler = useCallback((data) => {
    const jsonData = data ? JSON.parse(data) : null;

    if (jsonData) {
      rForm.setFieldsValue(jsonData);
    }
  }, []);

  // 요청사항 설정
  const requestSetHandler = useCallback(
    (data) => {
      setRData(data);

      setRModal(false);
    },
    [rData, rModal]
  );

  ////// DATAVIEW //////

  return (
    <>
      <ClientLayout>
        <WholeWrapper onClick={qntSaveHandler}>
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

              <Wrapper width={`auto`}>
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
              />

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
              {/* CHUB / PACK / VOLUMN SELECT AREA */}
              <Wrapper
                padding={`20px`}
                shadow={Theme.shadow_C}
                radius={`20px`}
                margin={`0 0 15px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey_C}>종류</Text>
                  <Image
                    onClick={() => modalToggleHandler1()}
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
              {/* CHUB / PACK / VOLUMN SELECT AREA END */}

              {/* 요청사항 SELECT AREA */}
              <Wrapper
                padding={`20px`}
                shadow={Theme.shadow_C}
                radius={`20px`}
                margin={`0 0 15px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey_C}>요청사항</Text>
                  <CommonButton onClick={rModalToggle}>설정하기</CommonButton>
                </Wrapper>

                {rData && (
                  <Wrapper al={`flex-start`} margin={`10px 0 0`}>
                    <Text width={`100%`}>{rData.title}</Text>
                    <Text width={`100%`} margin={`10px 0 0`}>
                      {rData.receiverName}
                    </Text>
                    <Text width={`100%`} margin={`10px 0 0`}>
                      {rData.medication}
                    </Text>
                    <Text width={`100%`} margin={`10px 0 0`}>
                      {rData.content}
                    </Text>
                  </Wrapper>
                )}
              </Wrapper>
              {/* 요청사항 SELECT AREA END */}

              {/* SELECT MATERIAL VIEW AREA */}
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
                  <Wrapper dr={`row`} width={`auto`}>
                    <Image
                      onClick={modalToggleHandler3}
                      cursor={`pointer`}
                      alt="icon"
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/bowl.png`}
                      width={`16px`}
                      margin={`0 10px 0 0`}
                    />
                    <Image
                      onClick={modalToggleHandler2}
                      cursor={`pointer`}
                      alt="delete-icon"
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/garbage.png`}
                      width={`16px`}
                    />
                  </Wrapper>
                </Wrapper>
                <Wrapper>
                  {userMaterials &&
                    (userMaterials.length === 0 ? (
                      <Wrapper margin={`40px 0`}>
                        <Empty description="선택된 약제가 없습니다." />
                      </Wrapper>
                    ) : (
                      userMaterials.map((data) => {
                        return (
                          <ListWrapper
                            key={data.id}
                            bgColor={
                              selectMaterial &&
                              selectMaterial.id === data.id &&
                              Theme.lightGrey_C
                            }
                          >
                            <Wrapper
                              dr={`row`}
                              ju={`flex-start`}
                              width={`35%`}
                              color={`${Theme.black_C}`}
                              onClick={() => selectMaterialHandler(data)}
                            >
                              <Text
                                fontSize={width < 600 ? `16px` : `18px`}
                                fontWeight={`800`}
                              >
                                {data.name}
                              </Text>
                            </Wrapper>

                            <Wrapper
                              width={`25%`}
                              onClick={() =>
                                !qntSelect && qntSelectHandler(data)
                              }
                            >
                              {qntSelect && qntSelect === data.id ? (
                                <Wrapper dr={`row`}>
                                  <Wrapper
                                    dr={`row`}
                                    width={`calc(100% - 25px)`}
                                  >
                                    <TextInput
                                      width={`100%`}
                                      placeholder={`용량`}
                                      type={`number`}
                                      {...qntInput}
                                      onKeyPress={(e) =>
                                        e.key === "Enter" && qntSaveHandler()
                                      }
                                    />
                                  </Wrapper>
                                  &nbsp;{data.unit}
                                </Wrapper>
                              ) : (
                                <Text
                                  color={`${Theme.black_C}`}
                                  fontSize={width < 600 ? `16px` : `18px`}
                                >
                                  {data.qnt}&nbsp;{data.unit}
                                </Text>
                              )}
                            </Wrapper>

                            <Wrapper
                              width={`40%`}
                              al={`flex-end`}
                              onClick={() => selectMaterialHandler(data)}
                            >
                              <Text
                                color={`${Theme.black_C}`}
                                fontSize={width < 600 ? `16px` : `18px`}
                              >
                                {numberWithCommas(data.price * data.qnt * 100)}
                                원
                              </Text>
                            </Wrapper>
                          </ListWrapper>
                        );
                      })
                    ))}
                </Wrapper>
              </Wrapper>
              {/* SELECT MATERIAL VIEW AREA END */}
            </Wrapper>

            {/* FOOTER AREA */}
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
                {packTotalPrice &&
                  (materialTotalPrice ? (
                    <Text fontWeight={`bold`}>
                      {numberWithCommas(
                        materialTotalPrice * 100 + packTotalPrice
                      )}
                      원
                    </Text>
                  ) : (
                    <Text fontWeight={`bold`}>
                      {numberWithCommas(packTotalPrice)}원
                    </Text>
                  ))}
              </Wrapper>
              <CommonButton
                shadow={`0`}
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
                onClick={paymentCreateHandler}
                loading={st_wishPreCreateLoading}
              >
                장바구니 담기
              </CommonButton>
            </Wrapper>
            {/* FOOTER AREA END */}
          </RsWrapper>
        </WholeWrapper>

        {/* CHUB / PACK / VOLUMN UPDATE Modal */}
        <SelectModal
          visible={isModalVisible1}
          onCancel={() => modalToggleHandler1()}
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
                  {materialTotalUnit && (
                    <Text fontSize={`18px`}>
                      {numberWithCommas(materialTotalUnit)}
                      <SpanText fontSize={`16px`} color={Theme.grey_C}>
                        g
                      </SpanText>
                    </Text>
                  )}
                </Wrapper>
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontWeight={`600`} color={Theme.grey_C}>
                    약제비
                  </Text>
                  {materialTotalPrice && packTotalPrice && (
                    <Text fontSize={`18px`}>
                      {numberWithCommas(materialTotalPrice + packTotalPrice)}
                      <SpanText fontSize={`16px`} color={Theme.grey_C}>
                        원
                      </SpanText>
                    </Text>
                  )}
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

        {/* MATERIAL UPDATE MODAL */}
        <CustomModal
          width={380}
          visible={isModalVisible3}
          onCancel={() => modalToggleHandler3()}
          footer={null}
        >
          <Wrapper>
            <Wrapper ju={`flex-start`} padding={`30px 0 10px 0`}>
              <Text color={Theme.grey_C} fontSize={`18px`}>
                해당 약재의 용량을 입력해주세요.
              </Text>
              <CustomForm form={qntForm} onFinish={updateQntHandler}>
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Wrapper width={`85%`}>
                    <Form.Item
                      name="qnt"
                      rules={[
                        { required: true, message: "용량을 입력해주세요." },
                      ]}
                    >
                      <TextInput
                        margin={`20px 0`}
                        width={`100%`}
                        placeholder="용량을 입력해주세요."
                      />
                    </Form.Item>
                  </Wrapper>
                  <Text margin={`0 0 20px`} fontSize={`18px`}>
                    {selectMaterial && selectMaterial.unit}
                  </Text>
                </Wrapper>
                <Wrapper dr={`row`} ju={`flex-end`}>
                  <CustomCommonButton
                    onClick={() => modalToggleHandler3()}
                    kindOf={`white`}
                    width={`90px`}
                    height={`40px`}
                    margin={`0 5px 0 0`}
                    border={`1px solid ${Theme.white_C}`}
                    shadow={`0px`}
                  >
                    취소
                  </CustomCommonButton>
                  <CommonButton
                    width={`90px`}
                    height={`40px`}
                    htmlType="submit"
                  >
                    확인
                  </CommonButton>
                </Wrapper>
              </CustomForm>
            </Wrapper>
          </Wrapper>
        </CustomModal>

        {/* DELETE MODAL */}
        <CustomModal
          width={380}
          visible={isModalVisible2}
          onCancel={() => modalToggleHandler2()}
          footer={null}
        >
          <Wrapper>
            <Wrapper ju={`flex-start`} padding={`30px 0 10px 0`}>
              <Text color={Theme.grey_C} fontSize={`18px`}>
                선택된 약재를 삭제하시겠습니까?
              </Text>
              <Wrapper dr={`row`} padding={`10px 0 0 60px`}>
                <CustomCommonButton
                  onClick={() => modalToggleHandler2()}
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
                  onClick={deleteMaterialHandler}
                >
                  네
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </CustomModal>
        {/* REQUEST MODAL */}
        <CustomModal
          width={`450px`}
          visible={rModal}
          onCancel={rModalToggle}
          footer={null}
        >
          <Wrapper al={`flex-start`} margin={`0 0 30px`}>
            <Text fontSize={`20px`} fontWeight={`bold`}>
              요청사항 설정
            </Text>
          </Wrapper>

          <Wrapper margin={`0 0 30px`} al={`flex-start`}>
            <Text>요청사항</Text>
            <ComboBox
              placeholder={`요청사항을 선택해주세요.`}
              onChange={requestChangeHandler}
            >
              {requestAllList &&
                requestAllList.map((data) => {
                  return (
                    <Option key={data.id} value={JSON.stringify(data)}>
                      {data.title} - {data.receiverName}
                    </Option>
                  );
                })}
            </ComboBox>
            <GuideLi isImpo>
              요청사항을 선택시 정보들이 자동으로 들어갑니다.
            </GuideLi>
          </Wrapper>

          <Form form={rForm} onFinish={requestSetHandler}>
            <Text>처방명</Text>
            <Form.Item
              name={`title`}
              rules={[{ required: true, message: "처방명을 입력해주세요." }]}
            >
              <TextInput
                width={`100%`}
                placeholder={`처방명을 입력해주세요.`}
              />
            </Form.Item>

            <Text>환자이름</Text>
            <Form.Item
              name={`receiverName`}
              rules={[{ required: true, message: "환자이름을 입력해주세요." }]}
            >
              <TextInput
                width={`100%`}
                placeholder={`환자이름을 입력해주세요.`}
              />
            </Form.Item>

            <Text>복약지도</Text>
            <Form.Item
              name={`medication`}
              rules={[{ required: true, message: "복약지도를 입력해주세요." }]}
            >
              <TextInput
                width={`100%`}
                placeholder={`복약지도를 입력해주세요.`}
              />
            </Form.Item>

            <Text>추가요청사항</Text>
            <Form.Item
              name={`content`}
              rules={[
                { required: true, message: "추가요청사항을 입력해주세요." },
              ]}
            >
              <TextInput
                width={`100%`}
                placeholder={`추가요청사항을 입력해주세요.`}
              />
            </Form.Item>

            <Wrapper dr={`row`} ju={`flex-end`}>
              <CustomCommonButton
                kindOf={`white`}
                width={`90px`}
                height={`40px`}
                margin={`0 5px 0 0`}
                border={`1px solid ${Theme.white_C}`}
                shadow={`0px`}
                onClick={rModalToggle}
              >
                취소
              </CustomCommonButton>
              <CommonButton width={`90px`} height={`40px`} htmlType="submit">
                설정
              </CommonButton>
            </Wrapper>
          </Form>
        </CustomModal>
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
      type: SEARCH_LIST_REQUEST,
      data: {
        search: "",
      },
    });

    context.store.dispatch({
      type: PP_GET_REQUEST,
    });

    context.store.dispatch({
      type: REQUEST_ALL_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Prescription;
