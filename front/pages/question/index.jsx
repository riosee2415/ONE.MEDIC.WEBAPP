import React, { useState, useCallback, useEffect } from "react";
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
  WholeWrapper,
  TextInput,
  Text,
  SpanText,
  CommonButton,
  TextArea,
  CommonCheckBox,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { Checkbox, message, notification, Empty } from "antd";
import { QUESTION_CREATE_REQUEST } from "../../reducers/question";
import useInput from "../../hooks/useInput";
import Modal from "antd/lib/modal/Modal";
import useWidth from "../../hooks/useWidth";

const TitleInput = styled(TextInput)`
  height: 43px;
  width: 100%;
  box-shadow: none;
  border-bottom: 1px solid ${Theme.grey2_C};
  border-radius: 0;
  margin: 0 0 30px;

  &::placeholder {
    font-size: 18px;
  }

  &:focus {
    border: none;
    border-bottom: 1px solid ${Theme.grey_C};
  }
`;

const ContentArea = styled(TextArea)`
  width: 100%;
  border: 1px solid ${Theme.lightGrey_C};
  border-radius: 0;
  margin: 0 0 20px;

  &::placeholder {
    font-size: 18px;
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.grey_C};
  }
`;

const CustomLabel = styled.label`
  cursor: pointer;
`;

const QuestionBtn = styled(CommonButton)`
  width: 85px;
  height: 30px;
  box-shadow: none;
  border: none;
  margin: 0 0 0 5px;
`;

const TermsModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
  }

  .ant-modal-header {
    border-radius: 20px;
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Question = () => {
  const width = useWidth();
  const dispatch = useDispatch();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { st_questionCreateDone, st_questionCreateError } = useSelector(
    (state) => state.question
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isTerms, setIsTerms] = useState(false);

  const titleInput = useInput("");
  const contentInput = useInput("");

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////
  ////// HANDLER //////
  useEffect(() => {
    if (st_questionCreateError) {
      return LoadNotification(
        "ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }, [st_questionCreateError]);

  useEffect(() => {
    if (st_questionCreateDone) {
      return LoadNotification(
        "등록완료",
        "문의사항이 정상적으로 등록되었습니다."
      );
    }
    titleInput.setValue("");
    contentInput.setValue("");
    setIsTerms(false);
  }, [st_questionCreateDone]);

  const TermsHandler = useCallback(
    (data) => {
      setIsTerms(data.target.checked);
    },
    [isTerms]
  );

  const onSubmit = useCallback(() => {
    if (!titleInput.value || titleInput.value.trim() === "") {
      return LoadNotification("안내", "제목을 입력해주세요.");
    }

    if (!contentInput.value || contentInput.value.trim() === "") {
      return LoadNotification("안내", "문의내용을 입력해주세요.");
    }

    if (isTerms === false) {
      return LoadNotification("안내", "개인정보 수집을 동의해주세요.");
    }

    dispatch({
      type: QUESTION_CREATE_REQUEST,
      data: {
        title: titleInput.value,
        type: 1,
        content: contentInput.value,
        isterm: isTerms.value,
      },
    });
  }, [titleInput.value, contentInput.value, isTerms]);

  const onCancel = useCallback(() => {
    titleInput.setValue("");
    contentInput.setValue("");
    setIsTerms(false);
  }, [titleInput.value, contentInput.value]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 20px`}
              al={`flex-start`}
              margin={`16px 0 15px`}
            >
              <Wrapper al={`flex-start`}>
                <Text padding={`0 0 23px`} fontSize={`22px`}>
                  문의하기
                </Text>
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  제목
                </Text>
                <TitleInput
                  placeholder="문의할 제목을 적어주세요."
                  {...titleInput}
                />
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  내용
                </Text>
                <ContentArea
                  placeholder="문의내용을 적어주세요."
                  {...contentInput}
                />
                <Wrapper
                  width={`auto`}
                  dr={`row`}
                  margin={`0 0 22px`}
                  al={`flex-start`}
                >
                  <Wrapper width={`auto`} padding={`0 12px 0 0`}>
                    <CommonCheckBox
                      checked={isTerms}
                      onChange={TermsHandler}
                      id="check"
                    />
                  </Wrapper>
                  <Wrapper width={`auto`} al={`flex-start`}>
                    <CustomLabel for="check">
                      <Wrapper
                        dr={`row`}
                        ju={`flex-start`}
                        width={`auto`}
                        fontSize={width < 500 ? `12px` : `14px`}
                        padding={`5px 0`}
                      >
                        <Text
                          borderBottom={`1px solid ${Theme.black_C}`}
                          lineHeight={`1`}
                        >
                          개인정보 제공
                        </Text>
                        <Text lineHeight={`1`}>
                          을 확인하였으며 이에 동의합니다.
                        </Text>
                      </Wrapper>
                    </CustomLabel>

                    <CommonButton
                      width={`52px`}
                      height={`25px`}
                      padding={`2px 0 0`}
                      fontSize={`12px`}
                      shadow={`none`}
                      onClick={showModal}
                    >
                      약관보기
                    </CommonButton>
                  </Wrapper>
                </Wrapper>
                <Wrapper dr={`row`} ju={`flex-end`}>
                  <QuestionBtn onClick={onCancel} kindOf={`white`}>
                    취소
                  </QuestionBtn>
                  <QuestionBtn onClick={onSubmit}>저장</QuestionBtn>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <TermsModal
              title="약관"
              visible={isModalVisible}
              onCancel={handleCancel}
              width={`800px`}
              footer
            >
              <Wrapper al={`flex-start`} fontSize={`12px`} color={Theme.grey_C}>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  미올한방병원 개인정보 취급방침 및 이용약관을 확인하세요.
                  미올한방병원은 이용자의 개인정보를 중요시하며, "정보통신망
                  이용촉진 및 정보보호 등에 관한 법률" 등 개인정보와 관련된 법령
                  상의 개인정보보호규정 및 방송통신위원회가 제정한
                  "개인정보보호지침"을 준수하고 있습니다. 또한, 회원가입시
                  귀하의 개인정보 수집과 관련하여 개인정보보호정책에 대한 동의를
                  받고 있습니다. 미올한방병원 원내탕전실 홈페이지의 회원가입을
                  위해 입력한 정보는 더 나은 서비스를 제공하는데 중요한 자료로
                  활용하며, 개인정보 보호정책에 따라 보호됩니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제1조. 목적
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  본 약관은 미올한방병원 원내탕전실(이하 "회사"라 칭합니다)의
                  홈페이지가 제공하는 모든 정보, 자료 및 서비스를 회사
                  홈페이지의 회원으로서 이용하는 조건, 절차에 관한 사항 및
                  개인정보 보호정책을 규정함을 목적으로 하며, 회원들은 회사
                  홈페이지를 이용하는 것에 관하여 다음과 같이 협약합니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제2조. 회원가입
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회사 홈페이지 회원은 본인이 실명으로 가입함을 원칙으로 하며
                  법인 혹은 단체회원으로 가입신청을 하실 수는 없습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. "회원"이란 본 약관을 승인하고 회사 홈페이지의
                  회원신청양식에 의거, 본인의 신상정보를 사실 그대로
                  입력함으로써 회사 홈페이지로부터 ID와 Password를 발급 받으신
                  분을 의미합니다. 회원의 ID는 이메일을 적용합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 회원이 입력하신 신상정보는 제7조의 [개인정보보호정책]에
                  따라 철저히 관리, 보호됩니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4. 회사는 다음 사항에 해당하는 경우 회원의 가입 승인을
                  유보하거나 거절할 수 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1) 한의사가 아닌 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2) 가명 및 가입신청 항목에 허위로 기재한 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3) 다른 사람의 명의를 빌리거나 도용하여 신청하였을 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4) 타인에게 혐오감 및 불쾌감을 줄 수 있는 ID로 회원가입을 할
                  경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  5) 기타 회원 가입이 관계법령에 위배되거나 미풍양속을 저해할
                  우려가 있다고 판단되는 경우
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제3조. 회원의 권리
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회원은 언제든지 회사 홈페이지 회원에서 탈퇴할 것을 요청할
                  수 있으며, 이러한 요청에 대하여 회사는 회원의 개인정보 삭제 등
                  회원탈퇴에 필요한 모든 조치를 즉각 취할 것입니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 회원은 언제든지 본인의 개인정보를 열람하고, 개인정보를 정정
                  또는 일부 삭제할 수 있습니다. 다만, 회사가 회원에 대하여
                  필요로 하는 최소한의 신상정보에 대하여는 회원탈퇴의 경우가
                  아닌 이상 삭제가 불가능합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 회원은 회사 홈페이지 내에 게재되어 있는 각종 정보 및 서비스
                  이용에 관련된 불만사항이나 의견을 언제든지 회사에 제안하여
                  시정 또는 개선을 요구할 수 있습니다. 회사는 회원 개개인의
                  요구를 최대한 반영하기 위하여 다각도로 합리적인 노력을
                  기울이나, 회원의 모든 시정 요구를 수용하지 못하는 경우가 있을
                  수 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4. 회원으로 가입되어 있는 분들은 누구나 동등한 자격, 동일한
                  조건으로 회사 홈페이지에서 제공하는 정보, 서비스를 이용할 수
                  있습니다
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제4조. 회원의 의무
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. ID와 Password는 회원 본인이 직접 사용하여야 하며, 타인에게
                  양도 또는 대여할 수 없습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 본인의 과실, 부주의로 ID 또는 Password가 타인에게 유출되어
                  발생할 수 있는 각종 손실 및 손해에 대한 책임은 모두 회원
                  본인에게 귀속됩니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 회원에게 신상정보의 변경사항이 발생하였으나 이를 수정하지
                  않음으로 인하여 문제가 생기는 경우 책임은 모두 회원에게
                  귀속됩니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제5조. 회사의 의무
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회사는 특별한 사정이 없는 한 회원이 신청한 서비스 제공
                  개시일부터 서비스를 이용할 수 있도록 조치하여야 합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 회사는 회원의 개인정보가 제7조에서 규정하는
                  [개인정보보호정책]에 의거하여 철저히 보호, 관리될 수 있도록
                  필요한 모든 기술적, 인적 조치를 취하여야 합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 회사는 회원으로부터 제기되는 제안, 의견이나 불만이
                  합당하다고 인정할 경우에는 회원의 요구를 최대한 반영할 수
                  있도록 신속히 처리하여야 합니다. 만일, 어떠한 사정으로 인하여
                  신속한 처리가 곤란한 경우에는 회원에게 그 사유와 예상되는
                  일정을 통보하여야 합니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제6조. 회원자격의 박탈
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회사는 다음 사항 발생시 별도 통보절차 없이 회원의 자격을
                  박탈할 수 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1) 회원 가입 시 입력사항을 허위로 기재하였을 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2) 회사 홈페이지를 통하여 음란물을 거래 혹은 유포하였을 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3) 타인 비방, 모욕, 명예훼손, 허위정보의 유포, 욕설, 저속한
                  문구 사용 등으로 인하여, 타인에게 불쾌감을 주거나 심각한
                  폐해를 끼친다고 판단되는 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4) 회사 홈페이지를 통하여 형사처벌의 대상이 되거나 기타
                  실정법에 위반하는 행위를 하였을 경우
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 회사 홈페이지를 이용한 부당광고 및 기타 다른 회원들에게
                  피해를 주는 행위를 하였다고 판단되는 경우, 회사는 회원에 대한
                  1차 통보로써 시정을 요구할 수 있으며, 회사가 통고한 기간
                  이내에 회원이 시정하지 않는 경우 통보절차 없이 회원의 자격을
                  박탈할 수 있습니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제7조. 개인정보보호정책
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회사는 홈페이지를 방문하는 개개인의 프라이버시(Privacy)를
                  존중합니다. 이 개인정보 보호규정은 회사가 수집하는 개인정보의
                  수집절차, 수집목적, 이용범위 등에 관하여 규정하고 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 회사는 이용자가 자발적으로 제공하지 않는 한 회사 홈페이지를
                  통하여 이용자의 이름, 주소, 전화번호 등 개인의 신상 정보를
                  수집하지 않습니다. 그러므로, 이용자가 본 회원약관 및 회사의
                  개인정보보호정책의 내용에 대해 동의하지 않는 경우 개인정보를
                  제출하지 마시기 바랍니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 회사가 수집하는 개인정보는 다음과 같습니다. -
                  ID(전자우편주소), 비밀번호, 이름, 생년월일, 전화번호 및
                  이동전화번호, 면허번호, 진료기관명, 진료기관주소, 우편번호
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4. 회사는 다음과 같은 목적을 위하여 개인정보를 수집하고 있으며
                  수집된 개인정보는 그 수집목적의 범위 내에서만 사용됩니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1) 회원가입을 위한 본인의 식별 및 회원관리
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2) 이용자의 수요를 파악하고 회사의 제품 및 서비스의 향상
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3) 특정 물품(경품이벤트 당첨 등) 발송 또는 기타 필요한 경우
                  회원에 대한 연락의 목적
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  5. 회사는 본 조 제4항에서 명시한 용도 외의 다른 용도로
                  개인정보를 사용하지 않으며, 또한 합리적이고 정당한
                  이유(예컨대, 개인정보처리의 위탁, 판촉, 리서치 등의 목적으로
                  회사를 대행하거나 회사와 제휴한 제3자에게 이
                  [개인정보보호정책]에 따른 개인정보의 보호, 외부유출 금지를
                  전제하여 제공하는 경우 등) 없이 함부로 타인 또는 외부로
                  유출하지 않습니다. 만일, 회사가 보다 나은 서비스 제공을 위하여
                  개인정보를 대행사 또는 제휴사에 제공하거나 공유하고자 하는
                  경우 회사는 사전에 개인정보를 제공받는 자, 제공되는 개인정보의
                  구체 항목, 제공 목적을 사전에 고지할 것이며, 회원이 이에
                  동의하지 않는 경우에는 해당 회원에 대하여는 정보를 제공하거나
                  공유하지 않습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  6. 회사는 어떤 경우에도 회원의 신상정보를 이윤 추구의 목적으로
                  양도하거나 매매하지 않습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  7. 회사의 잘못, 부주의로 인하여 개인정보가 외부로
                  유출되었거나, 분실, 도난, 변조 등으로 인하여 회원에게 손해를
                  초래한 경우, 회사가 상응하는 법적, 도의적 책임을 집니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  8. 만약 정부기관, 사법기관, 검찰/경찰의 공익을 위한 목적 또는
                  수사 목적으로 참고 자료 요청 시 법적인 범위 내에 회원정보를
                  해당 기관에 제공할 수 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  9. 회원은 언제든지 본인의 개인정보를 열람할 수 있으며,
                  개인정보를 언제라도 정정하거나 일부 삭제할 수 있습니다.
                  개인정보의 정정, 일부삭제는 해당란을 클릭하여 본인이 직접
                  하거나 또는 개인정보관리책임자에게 요청하시면 지체없이 필요한
                  조치를 취해 드립니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  10. 회원가입 등을 통해 개인정보의 수집, 이용에 대하여 회원이
                  동의하신 내용을 회원은 언제든지 철회할 수 있습니다. 이러한
                  개인정보 수집, 이용에 관한 동의철회는 회원탈퇴를 의미하는
                  것이므로 회사 홈페이지 상의 회원탈퇴 절차를 통하여 본인이 직접
                  수행할 수 있으며, 기타 개인정보관리책임자에게 연락하여 필요한
                  조치를 요구할 수 있습니다. 회원의 동의철회 요청에 대하여
                  회사는 지체없이 필요한 조치를 취할 것입니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  11. 개인정보는 회원가입을 탈퇴하거나 회원자격이 박탈됨으로써
                  개인정보의 수집목적이 달성되었거나 불필요하게 되었을 때에
                  파기됩니다. 다만, 대금지급, 경품등 물품의 배송을 위하여 필요한
                  경우에는 회원탈퇴, 자격박탈 후에도 해당 목적 범위 내에서만
                  이용될 수 있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  만약 회원의 부주의로 인한 회원탈퇴가 되었을시에는 관리자
                  연락처(modernlab037@gmail.com 등)로 문의하여 주십시오.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  12. 회사는 보다 나은 서비스 제공을 위하여 부분적으로
                  쿠키(Cookie)를 운영하고 있습니다. 쿠키는 서비스 제공자의
                  웹사이트 서버가 이용자의 컴퓨터 브라우저로 전송하는 소량의
                  정보로서, 여기에는 이용자가 방문한 웹사이트의 정보 및 이용자의
                  개인정보 등이 담겨 있습니다. 쿠키는 이용자의 컴퓨터 브라우저는
                  식별하지만 이용자를 개인적으로 식별하지는 않으며, 각 이용자는
                  웹브라우저의 옵션을 조정함으로써 모든 쿠키를 다 받아 들이거나,
                  쿠키가 설치될 때 통지를 보내도록 하거나, 아니면 모든 쿠키를
                  거부할 수 있는 선택권을 갖습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  13. 게시판 등 회사 홈페이지를 통해 다른 회원들의
                  전자우편(E-mail) 주소를 취득하여 스팸메일을 발송하여 메일
                  수신자에게 피해를 주었을 경우, 회사가 법적 대응을 할 수
                  있습니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  14. 회사는 개인정보에 대한 의견수렴 및 불만처리를 담당하는
                  개인정보관리책임자를 다음과 같이 지정하고 있습니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  개인정보관리책임자
                </Text>
                <Text textAlign={`left`}>- 이름: 김형규</Text>
                <Text textAlign={`left`}>
                  - 소속: 미올한방병원 원내탕전실(구 모던랩원외탕전원)
                </Text>
                <Text textAlign={`left`}>- 직위: 관리자</Text>
                <Text textAlign={`left`}>- 전화번호: 010-5014-5005</Text>
                <Text textAlign={`left`}>- 카카오톡채널: 모던랩원외탕전원</Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  - 전자우편: modernlab037@gmail.com
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  15. 개인정보와 관련하여 불만이나 제안이 있는 경우 회사가
                  지정하는 개인정보관리책임자에게 의견을 주시면 접수 후 조속히
                  조치하여 처리결과를 통보해 드립니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제8조. 홈페이지 운용
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 회사 홈페이지는 회사의 업무상 또는 기술상 특별한 지장이
                  없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 전 1항의 회사 홈페이지 운영시간은 정기 점검 등의 필요로
                  인하여 회사가 정한 날과 시간에는 예외로 합니다. 단, 부득이한
                  경우로 서비스를 중지 하고자 할 경우에는 이를 사전에 고지해야
                  하며, 천재지변 및 사이버 공격 등 불가항력의 사유로 서비스가
                  사전 예고 없이 중지된 경우에는 사후에라도 그 사유를 상세히
                  공지하여야 합니다.
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  제9조. 기타사항
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  1. 본 약관에 규정하지 않은 사항이나 약관의 해석에 관하여서는
                  전기통신사업법령, 정보통신망 이용촉진 및 정보보호 등에 관한
                  법령 등 관계법령 또는 상관례에 따릅니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  2. 본 약관은 필요에 따라 수시로 수정될 수 있으며, 이 경우 회사
                  홈페이지를 통해 그 수정 취지와 내용을 사전 공지합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3. 본 약관을 위반함으로써 발생하는 모든 책임은 위반한
                  당사자에게 귀속하며, 이로 인하여 타인에게 손해를 입힌 경우에는
                  관계 법령에 의거하여 법적책임을 져야 합니다.
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  4. 회사와 회원 간의 모든 분쟁은 민사소송법상의 관할을 가지는
                  대한민국 법원에 제기합니다.
                </Text>
              </Wrapper>
            </TermsModal>
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

export default Question;
