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
  Image,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import { useRouter } from "next/router";

import { BOUGHT_DETAIL_REQUEST } from "../../reducers/boughtHistory";
import { message } from "antd";

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const { paymentDetail } = useSelector((state) => state.paymentRequest);
  const { pprDetail } = useSelector(
    (state) => state.prescriptionPaymentRequest
  );

  const { boughtDetail } = useSelector((state) => state.boughtHistory);

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [detailData, setDetailData] = useState(null);

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

  useEffect(() => {
    if (paymentDetail || pprDetail) {
      setDetailData(paymentDetail || pprDetail);
    }
  }, [paymentDetail, pprDetail]);

  ////// TOGGLE //////
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
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 30px`}
              >
                <Wrapper
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                >
                  <Text
                    fontSize={`1rem`}
                    fontWeight={`700`}
                    color={Theme.grey_C}
                    margin={`0 0 20px`}
                  >
                    배송조회
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`15px 12px`}
                >
                  <Wrapper
                    width={`20px`}
                    margin={`0 40px 0 0`}
                    al={`flex-start`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/delivery_icon/box.png`}
                      alt={`box`}
                    />
                  </Wrapper>
                  <Wrapper
                    al={`flex-start`}
                    ju={`flex-start`}
                    width={`calc(100% - 60px)`}
                  >
                    <Text
                      color={Theme.black_C}
                      fontSize={`18px`}
                      fontWeight={`700`}
                      margin={`0 0 7px`}
                    >
                      {boughtDetail && boughtDetail.viewDeliveryStatus}
                    </Text>

                    {/* RECIVE DATA */}
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      al={`flex-start`}
                      margin={`20px 0 15px`}
                    >
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        받는 사람
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
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
                        전화번호
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {boughtDetail && boughtDetail.receiveMobile}
                      </Text>
                    </Wrapper>

                    <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        받는 주소
                      </Text>

                      <Wrapper width={`auto`} al={`flex-start`}>
                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {boughtDetail && boughtDetail.receiveAddress}
                        </Text>

                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {boughtDetail && boughtDetail.receiveDetailAddress}
                        </Text>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      height={`1px`}
                      bgColor={Theme.grey2_C}
                      margin={`15px 0`}
                    />

                    {/* SEND DATA */}
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
                        보내는 사람
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
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
                        전화번호
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {boughtDetail && boughtDetail.sendMobile}
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        보내는 주소
                      </Text>
                      <Wrapper width={`auto`} al={`flex-start`}>
                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {boughtDetail && boughtDetail.sendAddress}
                        </Text>

                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {boughtDetail && boughtDetail.sendDetailAddress}
                        </Text>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      height={`1px`}
                      bgColor={Theme.grey2_C}
                      margin={`15px 0`}
                    />

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
                        배송회사
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {boughtDetail && boughtDetail.deliveryCompany
                          ? boughtDetail.deliveryCompany
                          : "배송회사가 없습니다."}
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
                        운송장번호
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {boughtDetail && boughtDetail.deliveryNo
                          ? boughtDetail.deliveryNo
                          : "운송장번호가 없습니다."}
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
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
