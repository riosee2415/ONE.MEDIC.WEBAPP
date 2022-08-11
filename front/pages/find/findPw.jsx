import { Form } from "antd";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  CommonButton,
  TextInput,
  Text,
} from "../../components/commonComponents";
import { MODIFYPASS_REQUEST } from "../../reducers/user";

const CustomForm = styled(Form)`
  width: 100%;
`;

const FindPw = () => {
  ////// HOOKS //////
  const dispatch = useDispatch();

  ////// HANDLER //////
  const secretSendHandler = useCallback((data) => {
    dispatch({
      type: MODIFYPASS_REQUEST,
      data: {
        email: data.email,
      },
    });
  }, []);

  return (
    <ClientLayout>
      <WholeWrapper>
        <RsWrapper minHeight={`calc(100vh - 170px - 64px)`}>
          <Wrapper padding={`100px 0`}>
            <CustomForm>
              <Wrapper dr={`row`}>
                <Form.Item
                  style={{
                    width: `calc(100% - 120px)`,
                  }}
                  rules={[
                    { required: true, message: "이메일을 입력해주세요." },
                  ]}
                  name="email"
                >
                  <TextInput
                    type="email"
                    width={`100%`}
                    height={`50px`}
                    placeholder={`이메일`}
                  />
                </Form.Item>

                <CommonButton
                  width={`120px`}
                  height={`50px`}
                  padding={`0`}
                  margin={`0 0 20px`}
                  htmlType="submit"
                  onClick={() => secretSendHandler()}
                >
                  인증번호 보내기
                </CommonButton>
              </Wrapper>
            </CustomForm>
            <CustomForm>
              <Form.Item
                rules={[
                  { required: true, message: "인증번호를 입력해주세요." },
                ]}
                name="secretCode"
              >
                <TextInput
                  type="text"
                  width={`100%`}
                  height={`50px`}
                  placeholder={`인증번호`}
                />
              </Form.Item>

              <CommonButton
                width={`100%`}
                height={`50px`}
                margin={`15px 0`}
                htmlType="submit"
              >
                인증번호 인증
              </CommonButton>
            </CustomForm>
          </Wrapper>
        </RsWrapper>
      </WholeWrapper>
    </ClientLayout>
  );
};

export default FindPw;
