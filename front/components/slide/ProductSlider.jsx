import React, { useEffect, useCallback } from "react";
import { Image, RowWrapper, Wrapper } from "../commonComponents";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../Theme";
import { Carousel } from "antd";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";
import { ConsoleSqlOutlined } from "@ant-design/icons";

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

const ProductSlider = ({ topSlider }) => {
  console.log(topSlider);
  const width = useWidth();

  const dispatch = useDispatch();

  const router = useRouter();

  return (
    <MainSliderWrapper>
      <Carousel autoplay={false} speed={3000}>
        {topSlider &&
          topSlider.length > 0 &&
          topSlider.map((data) => {
            return (
              <Wrapper position={`relative`} display={`flex !important`}>
                <Image height={`210px`} src={data} />
              </Wrapper>
            );
          })}
      </Carousel>
    </MainSliderWrapper>
  );
};

export default ProductSlider;
