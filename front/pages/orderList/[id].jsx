import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import ClientLayout from "../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import { useRouter } from "next/router";
import { message } from "antd";
import { BOUGHT_DETAIL_REQUEST } from "../../reducers/boughtHistory";

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  ////// HOOKS //////

  const { me } = useSelector((state) => state.user);
  const { boughtDetail } = useSelector((state) => state.boughtHistory);

  const router = useRouter();
  const dispatch = useDispatch();

  const [openHistory, setOpenHistory] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: BOUGHT_DETAIL_REQUEST,
        data: {
          id: parseInt(router.query.id),
        },
      });
    }
  }, [router.query]);

  ////// TOGGLE //////
  const historyToggle = useCallback(() => {
    setOpenHistory(!openHistory);
  });
  ////// HANDLER //////

  ////// DATAVIEW //////

  return (
    <>
      <ClientLayout>
        <WholeWrapper>
          <RsWrapper ju={`flex-start`} position={`relative`} padding={`0`}>
            <Wrapper
              minHeight={`calc(100vh - 120px)`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              al={`flex-start`}
              ju={`flex-start`}
            >
              <Wrapper
                al={`flex-start`}
                ju={`flex-start`}
                shadow={Theme.shadow_C}
                padding={`20px`}
                radius={`20px`}
              >
                <Text
                  margin={`0 0 20px`}
                  fontSize={`18px`}
                  fontWeight={`700`}
                  color
                >
                  보내는 사람
                </Text>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    이름
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.receiveUser}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    연락처
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.receiveMobile}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    주소
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.receiveAddress}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    상세주소
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.receiveDetailAddress}
                  </Text>
                </Wrapper>

                <Text
                  margin={`20px 0`}
                  fontSize={`18px`}
                  fontWeight={`700`}
                  color
                >
                  받는 사람
                </Text>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    이름
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.sendUser}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    연락처
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.sendMobile}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    주소
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.sendAddress}
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    상세주소
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.sendDetailAddress}
                  </Text>
                </Wrapper>

                <Text
                  margin={`20px 0`}
                  fontSize={`18px`}
                  fontWeight={`700`}
                  color
                >
                  금액
                </Text>

                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    결제방법
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.viewPayInfo}
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    결제일시
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {boughtDetail && boughtDetail.viewCreatedAt}
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    결제금액
                  </Text>
                  <Wrapper width={`calc(100% - 100px)`} fontSize={`18px`}>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      margin={`0 0 10px`}
                    >
                      <Text fontWeight={`700`}>배송비</Text>
                      <Text fontWeight={`700`}>
                        {boughtDetail && boughtDetail.viewDeliveryPrice}
                      </Text>
                    </Wrapper>

                    {boughtDetail && boughtDetail.type === 2 && (
                      <>
                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          margin={`0 0 10px`}
                        >
                          <Text fontWeight={`700`}>탕전료</Text>
                          <Text fontWeight={`700`}>
                            {boughtDetail && boughtDetail.viewTangjeonPrice}
                          </Text>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          margin={`0 0 10px`}
                        >
                          <Text fontWeight={`700`}>조제료</Text>
                          <Text fontWeight={`700`}>
                            {boughtDetail && boughtDetail.viewPharmacyPrice}
                          </Text>
                        </Wrapper>
                      </>
                    )}
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper
                al={`flex-start`}
                ju={`flex-start`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                radius={`20px`}
                margin={`10px 0`}
              >
                {openHistory ? (
                  boughtDetail &&
                  (boughtDetail.type === 1 ? (
                    <>
                      {boughtDetail &&
                        boughtDetail.lists.map((data) => {
                          return (
                            <Wrapper margin={`0 0 20px`} al={`flex-start`}>
                              <Text
                                margin={`0 0 20px`}
                                fontSize={`18px`}
                                fontWeight={`700`}
                                color
                              >
                                요청사항
                              </Text>

                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  처방명
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.title}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  환자명
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.receiverName}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  복약지도
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.medication}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  요청사항
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.content}
                                </Text>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                padding={`10px 0`}
                                margin={`20px 0 0`}
                                borderBottom={`1px solid ${Theme.grey2_C}`}
                                bgColor={Theme.grey2_C}
                              >
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  재료명
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  수량
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  가격
                                </Text>
                              </Wrapper>
                              {boughtDetail.items
                                .filter(
                                  (value) =>
                                    value.WishPaymentContainerId === data.id
                                )
                                .map((value) => (
                                  <Wrapper
                                    dr={`row`}
                                    ju={`space-between`}
                                    padding={`10px 0`}
                                    borderBottom={`1px solid ${Theme.grey2_C}`}
                                  >
                                    <Wrapper
                                      width={`calc(100% / 3)`}
                                      al={`flex-start`}
                                    >
                                      <Text>{value.pack}</Text>
                                      <Text>
                                        {value.type}&nbsp;({value.unit})
                                      </Text>
                                    </Wrapper>

                                    <Text
                                      width={`calc(100% / 3)`}
                                      textAlign={`center`}
                                    >
                                      {value.qnt}개
                                    </Text>

                                    <Text
                                      width={`calc(100% / 3)`}
                                      textAlign={`end`}
                                    >
                                      {value.viewTotalPrice}
                                    </Text>
                                  </Wrapper>
                                ))}
                            </Wrapper>
                          );
                        })}
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        al={`flex-end`}
                        padding={`15px 0 0`}
                      >
                        합계 : {boughtDetail && boughtDetail.viewTotalPrice}
                      </Wrapper>
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        onClick={historyToggle}
                        cursor={`pointer`}
                        padding={`20px 0 0`}
                      >
                        닫기
                      </Wrapper>
                    </>
                  ) : (
                    <>
                      {boughtDetail &&
                        boughtDetail.lists.map((data) => {
                          return (
                            <Wrapper margin={`0 0 20px`} al={`flex-start`}>
                              <Text
                                margin={`0 0 20px`}
                                fontSize={`18px`}
                                fontWeight={`700`}
                                color
                              >
                                요청사항
                              </Text>

                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  처방명
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.title}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  환자명
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.receiverName}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  복약지도
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.medication}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  요청사항
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.content}
                                </Text>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                ju={`flex-start`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`80px`}
                                  margin={`0 20px 0 0`}
                                  color={Theme.grey_C}
                                  fontSize={`16px`}
                                >
                                  팩 가격
                                </Text>
                                <Text fontSize={`18px`} fontWeight={`700`}>
                                  {data.viewPackPrice}
                                </Text>
                              </Wrapper>

                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                padding={`10px 0`}
                                margin={`20px 0 0`}
                                borderBottom={`1px solid ${Theme.grey2_C}`}
                                bgColor={Theme.grey2_C}
                              >
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  재료명
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  수량
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                >
                                  가격
                                </Text>
                              </Wrapper>
                              {boughtDetail.items
                                .filter(
                                  (value) =>
                                    value.WishPrescriptionItemId === data.id
                                )
                                .map((value) => (
                                  <Wrapper
                                    dr={`row`}
                                    ju={`space-between`}
                                    padding={`10px 0`}
                                    borderBottom={`1px solid ${Theme.grey2_C}`}
                                  >
                                    <Text
                                      width={`calc(100% / 3)`}
                                      textAlign={`center`}
                                    >
                                      {value.name}
                                    </Text>
                                    <Text
                                      width={`calc(100% / 3)`}
                                      textAlign={`center`}
                                    >
                                      {value.qnt}&nbsp;
                                      {value.unit}
                                    </Text>
                                    <Text
                                      width={`calc(100% / 3)`}
                                      textAlign={`end`}
                                    >
                                      {value.viewTotalPrice}
                                    </Text>
                                  </Wrapper>
                                ))}
                            </Wrapper>
                          );
                        })}

                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        al={`flex-end`}
                        padding={`15px 0 0`}
                      >
                        합계 : {boughtDetail && boughtDetail.viewTotalPrice}
                      </Wrapper>

                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        onClick={historyToggle}
                        cursor={`pointer`}
                        padding={`20px 0 0`}
                      >
                        닫기
                      </Wrapper>
                    </>
                  ))
                ) : (
                  <Wrapper
                    fontSize={`18px`}
                    padding={`30px 0 5px`}
                    onClick={historyToggle}
                    cursor={`pointer`}
                  >
                    상세내역확인
                  </Wrapper>
                )}
              </Wrapper>
            </Wrapper>

            {/* <Wrapper
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}
            >
              <CommonButton
                shadow={`0`}
                width={`100%`}
                height={`50px`}
                radius={`0`}
                cursor={`pointer`}
              >
                확인
              </CommonButton>
            </Wrapper> */}
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
