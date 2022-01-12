import React, { useEffect, useCallback } from "react";
import { Image, RowWrapper, Wrapper } from "../commonComponents";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../Theme";
import { Carousel } from "antd";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";

const MainSliderWrapper = styled(RowWrapper)`
  & .ant-carousel {
    width: 100%;
  }

  .ant-carousel .slick-dots-bottom {
    bottom: -30px;
  }

  .ant-carousel .slick-dots li,
  .ant-carousel .slick-dots li.slick-active {
    width: 10px !important;
    height: 10px;
    border-radius: 100%;
    background: ${(props) => props.theme.lightGrey_C};
    margin: 0 7px;
  }

  .ant-carousel .slick-dots li button {
    height: 10px;
    border-radius: 100%;
  }

  .ant-carousel .slick-dots li.slick-active button {
    background: ${(props) => props.theme.basicTheme_C};
  }
`;

const ProductSlider = () => {
  const width = useWidth();

  const dispatch = useDispatch();

  const router = useRouter();

  return (
    <MainSliderWrapper>
      <Carousel autoplay={false} speed={3000}>
        <Wrapper position={`relative`} display={`flex !important`}>
          <Image
            height={`210px`}
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/thumbnail/detail_thumb.png`}
          />
        </Wrapper>
        <Wrapper position={`relative`} display={`flex !important`}>
          <Image
            height={`210px`}
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/thumbnail/detail_thumb.png`}
          />
        </Wrapper>
        <Wrapper position={`relative`} display={`flex !important`}>
          <Image
            height={`210px`}
            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/thumbnail/detail_thumb.png`}
          />
        </Wrapper>
      </Carousel>
    </MainSliderWrapper>
  );
};

export default ProductSlider;
