import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import { AiOutlineHome } from "react-icons/ai";

import icnCrown from "../../../images/icn-crown.png";
import icnServ from "../../../images/icn-serv.png";
import icnGear from "../../../images/icn-gear.png";
import about1 from "../../../images/about1.jpeg";
import about2 from "../../../images/about2.jpeg";

const AboutContainer = () => {
  return (
    <div className="container">
      <div className="row">
        <div className={"about-content"}>
          <div className={"breadcrumbsContainer"}>
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <AiOutlineHome />,
                },
                {
                  title: "About us",
                },
              ]}
            />
          </div>

          <h2>Why Buy from us</h2>

          <Row gutter={30} className={"about-row"}>
            <Col span={8}>
              <div className={"about-card"}>
                <img className={"img-crown"} src={icnCrown} alt={"icn-crown"} />
                <div className="ult_expheader" align="center">
                  Cost Less
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={"about-card"}>
                <img className={"img-crown"} src={icnServ} alt={"icn-crown"} />
                <div className="ult_expheader" align="center">
                  Less Depreciation
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={"about-card"}>
                <img className={"img-crown"} src={icnCrown} alt={"icn-crown"} />
                <div className="ult_expheader" align="center">
                  Investing
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={30}>
            <Col span={12}>
              <div className={"about-card"}>
                <img className={"img-crown"} src={icnGear} alt={"icn-crown"} />
                <div className="ult_expheader" align="center">
                  Less Depreciation
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={"about-card"}>
                <img className={"img-crown"} src={icnGear} alt={"icn-crown"} />
                <div className="ult_expheader" align="center">
                  Condition
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={30} className={"about-col"}>
            <Col span={16}>
              <h2>Welcome to Daytona</h2>
              <p>
                At Daytona, we believe that time is not just a measure, but a
                statement. Nestled in the heart of Tbilisi, Georgia, we curate a
                collection of timepieces that embody elegance, precision, and
                heritage. Our passion for watches transcends mere functionality;
                it's about the stories they tell, the craftsmanship they
                showcase, and the journeys they accompany.
              </p>

              <p>
                Discover a world where artistry meets functionality. From
                classic designs that evoke timeless sophistication to modern
                innovations that redefine luxury, our curated collections cater
                to every style and occasion. Whether you're seeking a statement
                piece for a special event or a reliable companion for your
                everyday adventures, we have a watch for you.
              </p>

              <p>
                We take pride in offering timepieces from renowned watchmakers
                around the globe. From the Swiss Alps to the artisan workshops
                of Japan, each watch in our collection is a testament to the
                dedication and expertise of master craftsmen. Impeccable
                movements, exquisite detailing, and superior materials ensure
                that every Daytona watch is a masterpiece that stands the test
                of time.
              </p>

              <p>
                At Daytona, we understand that choosing the perfect timepiece is
                a deeply personal journey. That's why our knowledgeable staff is
                here to guide you every step of the way. Whether you're a
                seasoned collector or a first-time buyer, we'll help you find a
                watch that not only suits your style but also speaks to your
                individuality.
              </p>

              <p>
                Embark on a horological adventure at Daytona. Located
                Chavchavadze ave. 34(Pixel) II Floor, our boutique invites you
                to immerse yourself in the world of luxury timepieces. From
                iconic brands to hidden gems, each watch in our collection has
                been carefully selected to inspire and delight. Visit us today
                and let us help you find the perfect watch to mark your moments
                in time.
              </p>

              <p>
                At Daytona, we don't just sell watches; we offer an
                experience—an invitation to celebrate the artistry, heritage,
                and precision of timekeeping. Whether you're browsing our
                collection online or visiting our boutique in person, we invite
                you to experience time, elevated.
              </p>
            </Col>
            <Col span={8}>
              <div className={"about-image"}>
                <img src={about1} alt={"pixel"} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AboutContainer;
