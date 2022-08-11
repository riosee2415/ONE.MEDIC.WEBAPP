import { Form, message } from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  MODIFYPASS_REQUEST,
  MODIFYPASS_UPDATE_REQUEST,
} from "../../reducers/user";

const CustomForm = styled(Form)`
  width: 100%;
`;

const FindPw = () => {
  ////// HOOKS //////
  const dispatch = useDispatch();

  const {
    secretCode,
    st_userModifyPassDone,
    st_userModifyPassError,
    st_userModifyPassUpdateDone,
    st_userModifyPassUpdateError,
  } = useSelector((state) => state.user);

  const router = useRouter();

  const [cuurentTab, setCurrentTab] = useState(0);
  const [emailInput, setEmailInput] = useState(null);

  ////// USEEFFECT //////

  useEffect(() => {
    if (st_userModifyPassDone) {
      return message.success("인증번호를 보냈습니다.");
    }
  }, [st_userModifyPassDone]);

  useEffect(() => {
    if (st_userModifyPassError) {
      return message.error(st_userModifyPassError);
    }
  }, [st_userModifyPassError]);

  useEffect(() => {
    if (st_userModifyPassUpdateDone) {
      router.push("/login");

      return message.success("비밀번호가 변경되었습니다.");
    }
  }, [st_userModifyPassUpdateDone]);
  useEffect(() => {
    if (st_userModifyPassUpdateError) {
      return message.error(st_userModifyPassUpdateError);
    }
  }, [st_userModifyPassUpdateError]);

  ////// HANDLER //////
  const secretSendHandler = useCallback(
    (data) => {
      dispatch({
        type: MODIFYPASS_REQUEST,
        data: {
          email: data.email,
        },
      });

      setEmailInput(data.email);
    },
    [emailInput]
  );

  const secretCheckHandler = useCallback(
    (data) => {
      if (secretCode !== data.secretCode) {
        return message.error("인증번호가 틀렸습니다.");
      }

      setCurrentTab(1);
      return message.success("인증되었습니다.");
    },
    [cuurentTab, secretCode]
  );

  const passwordUpdateHandler = useCallback(
    (data) => {
      if (data.password !== data.rePassword) {
        return message.error("비밀번호가 다릅니다.");
      }

      dispatch({
        type: MODIFYPASS_UPDATE_REQUEST,
        data: {
          email: emailInput,
          password: data.password,
        },
      });
    },
    [emailInput]
  );

  return (
    <ClientLayout>
      <WholeWrapper>
        <RsWrapper minHeight={`calc(100vh - 170px - 64px)`}>
          <Wrapper padding={`100px 0`}>
            {cuurentTab === 0 ? (
              <>
                <CustomForm onFinish={secretSendHandler}>
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
                    >
                      인증번호 보내기
                    </CommonButton>
                  </Wrapper>
                </CustomForm>
                <CustomForm onFinish={secretCheckHandler}>
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
              </>
            ) : (
              <>
                <CustomForm onFinish={passwordUpdateHandler}>
                  <Form.Item
                    rules={[
                      { required: true, message: "인증번호를 입력해주세요." },
                    ]}
                    name="password"
                  >
                    <TextInput
                      type="password"
                      width={`100%`}
                      height={`50px`}
                      placeholder={`비밀번호`}
                    />
                  </Form.Item>

                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "비밀번호를 재입력해주세요.",
                      },
                    ]}
                    name="rePassword"
                  >
                    <TextInput
                      type="password"
                      width={`100%`}
                      height={`50px`}
                      placeholder={`비밀번호 재입력`}
                    />
                  </Form.Item>

                  <CommonButton
                    width={`100%`}
                    height={`50px`}
                    margin={`15px 0`}
                    htmlType="submit"
                  >
                    비밀번호 변경
                  </CommonButton>
                </CustomForm>
              </>
            )}
          </Wrapper>
        </RsWrapper>
      </WholeWrapper>
    </ClientLayout>
  );
};

export default FindPw;
