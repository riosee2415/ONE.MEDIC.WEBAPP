import React, { useState, useEffect, useCallback } from "react";
import {
  Wrapper,
  Text,
  Image,
  ATag,
  WholeWrapper,
  RsWrapper,
} from "./commonComponents";
import { withResizeDetector } from "react-resize-detector";
import styled from "styled-components";
import Theme from "./Theme";
import { Drawer } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { LeftOutlined } from "@ant-design/icons";

const Dot = styled(Wrapper)`
  width: 4.5px;
  height: 4.5px;
  background: ${(props) => props.theme.white_C};
  border-radius: 100%;
`;

const DotWrapper = styled(Wrapper)`
  position: relative;
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 5px;
    background: ${(props) => props.theme.red_C};
    border-radius: 100%;
  }
`;

const AppHeader = ({ children, width }) => {
  const router = useRouter();
  ////////////// - USE STATE- ///////////////
  const [headerScroll, setHeaderScroll] = useState(false);
  const [pageY, setPageY] = useState(0);
  // const documentRef = useRef(document);

  const [drawar, setDrawar] = useState(false);
  const [subMenu, setSubMenu] = useState(``);

  ///////////// - EVENT HANDLER- ////////////

  const drawarToggle = useCallback(() => {
    setDrawar(!drawar);
  });

  const handleScroll = useCallback(() => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const headerScroll = pageY && pageYOffset !== 0 && pageYOffset !== pageY;
    setHeaderScroll(headerScroll);
    setPageY(pageYOffset);
  });

  ////////////// - USE EFFECT- //////////////
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [pageY]);
  return (
    <WholeWrapper height={`64px`} zIndex={`100`} position={`relative`}>
      {router.pathname === "/join" ? (
        <RsWrapper>
          <Wrapper
            fontSize={width < 800 ? `20px` : `26px`}
            fontWeight={`bold`}
            dr={`row`}
            ju={`flex-start`}
          >
            <Link href={`/`}>
              <a>
                <Wrapper
                  width={`auto`}
                  color={Theme.grey2_C}
                  fontSize={`20px`}
                  margin={`0 10px 0 0`}
                >
                  <LeftOutlined />
                </Wrapper>
              </a>
            </Link>
            회원가입
          </Wrapper>
        </RsWrapper>
      ) : router.pathname === "/login" ? (
        <RsWrapper>
          <Wrapper
            fontSize={width < 800 ? `20px` : `26px`}
            fontWeight={`bold`}
            dr={`row`}
            ju={`flex-start`}
          >
            <Link href={`/`}>
              <a>
                <Wrapper
                  width={`auto`}
                  color={Theme.grey2_C}
                  fontSize={`20px`}
                  margin={`0 10px 0 0`}
                >
                  <LeftOutlined />
                </Wrapper>
              </a>
            </Link>
            로그인
          </Wrapper>
        </RsWrapper>
      ) : (
        <RsWrapper bgColor={Theme.basicTheme_C} color={Theme.white_C}>
          <Wrapper dr={`row`} ju={`space-between`}>
            <Text fontSize={width < 800 ? `20px` : `26px`} fontWeight={`bold`}>
              주문목록
            </Text>
            <DotWrapper width={`26px`} onClick={drawarToggle}>
              <Dot />
              <Dot margin={`4px 0`} />
              <Dot />
            </DotWrapper>
          </Wrapper>
          {drawar && (
            <Drawer
              placement="right"
              closable={true}
              onClose={drawarToggle}
              visible={drawarToggle}
              getContainer={false}
            >
              <Wrapper>
                <Wrapper
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  height={`64px`}
                  borderBottom={`1px solid ${Theme.subTheme_C}`}
                ></Wrapper>
                <Wrapper
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  padding={width < 800 ? `25px 20px 40px` : `25px 38px 40px`}
                >
                  <Wrapper dr={`row`} ju={`space-between`}>
                    <Wrapper
                      width={`auto`}
                      dr={`row`}
                      fontSize={width < 800 ? `16px` : `18px`}
                    >
                      <Image
                        alt="profile"
                        width={`50px`}
                        height={`50px`}
                        radius={`100%`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/thumbnail/detail_thumb.png`}
                      />
                      <Text
                        fontSize={`20px`}
                        fontWeight={`bold`}
                        margin={`0 2px 0 10px`}
                      >
                        홍길동
                      </Text>
                      님
                    </Wrapper>
                    <Wrapper
                      width={`auto`}
                      dr={`row`}
                      fontSize={`14px`}
                      color={Theme.grey2_C}
                    >
                      <Text margin={`0 10px 0 0`}>계정관리</Text>
                      <Text>로그아웃</Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
                <Wrapper padding={width < 800 ? `0 20px` : `0 38px`}>
                  <Wrapper
                    radius={`15px`}
                    bgColor={Theme.white_C}
                    color={Theme.black_C}
                    shadow={Theme.shadow_C}
                    margin={`-20px 0 0`}
                    padding={width < 800 ? `30px` : `50px`}
                  >
                    <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/1.jar.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        약속처방
                      </Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      padding={`0 0 20px`}
                      margin={`0 0 20px`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                    >
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/2.prescript.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        처방하기
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/3.list.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        주문조회
                      </Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      padding={`0 0 20px`}
                      margin={`0 0 20px`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                    >
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/4.cart.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        장바구니
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/5.megaphone.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        공지사항
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`}>
                      <Image
                        alt="icon"
                        width={`26px`}
                        height={`26px`}
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/6.consult.png`}
                      />
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        margin={`0 0 0 30px`}
                      >
                        문의하기
                      </Text>
                    </Wrapper>
                  </Wrapper>
                  <Wrapper
                    radius={`15px`}
                    bgColor={Theme.white_C}
                    color={Theme.black_C}
                    shadow={Theme.shadow_C}
                    margin={`15px 0 0`}
                    padding={`30px`}
                    dr={`row`}
                  >
                    <Image
                      alt="icon"
                      width={`55px`}
                      height={`55px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/public-number.png`}
                    />
                    <Wrapper
                      width={`calc(100% - 55px)`}
                      al={`flex-start`}
                      padding={`0 0 0 30px`}
                    >
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        fontWeight={`bold`}
                      >
                        대표번호
                      </Text>
                      <Text
                        fontSize={width < 800 ? `20px` : `24px`}
                        fontWeight={`bold`}
                        color={Theme.basicTheme_C}
                      >
                        02-466-1575
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Drawer>
          )}
        </RsWrapper>
      )}
    </WholeWrapper>
  );
};

export default withResizeDetector(AppHeader);
