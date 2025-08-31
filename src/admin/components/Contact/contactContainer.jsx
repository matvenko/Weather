import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import { AiOutlineHome } from "react-icons/ai";
import { FaStar } from "react-icons/fa";

const ContactContainer = () => {
  return (
    <div className="container">
      <div className="row">
        <div className={"contact-content"}>
          <div className={"breadcrumbsContainer"}>
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <AiOutlineHome />,
                },
                {
                  title: "Contact us",
                },
              ]}
            />
          </div>
          <Row className={"contact-row"}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <h2>Daytona</h2>
              <p>
                For any inquiries please do not hesitate to contact us for more
                information. It’s our honor to be able to reach the customer
                with our product knowledge.
              </p>

              <ul className={"contact-ul"}>
                <li>
                  {" "}
                  <FaStar className={"contact-star"} /> Complete Service
                  overhauled{" "}
                </li>
                <li>
                  {" "}
                  <FaStar className={"contact-star"} /> Polishing{" "}
                </li>
                <li>
                  {" "}
                  <FaStar className={"contact-star"} /> Change battery{" "}
                </li>
                <li>
                  {" "}
                  <FaStar className={"contact-star"} /> Extension of watch Rolex
                  links{" "}
                </li>
                <li>
                  {" "}
                  <FaStar className={"contact-star"} /> Original parts
                  replacement for Rolex watches{" "}
                </li>
              </ul>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <div className={"contact-wrapper"}>
                <div className={"contact-header"}>
                  <h2>REACH US AT</h2>
                </div>
                <div className={"whatsap-contacts"}>
                  <ul>
                    <li>
                      Farhan– 018 948 4620 <a href="#">click to Whatsapp</a>
                    </li>
                    <li>
                      Farhan– 018 948 4620 <a href="#">click to Whatsapp</a>
                    </li>
                  </ul>
                </div>

                <Row>
                  <Col span={12} className={"contact-left-col"}>
                    <h3>SHOWROOM ADDRESS</h3>
                    <p></p>
                    <p>DAYTONA WATCH SHOP</p>
                    <p>(000619967D)</p>
                    <p>Chavchavadze ave. 34(Pixel) II Floor</p>
                    <p>Subang Jaya, Selangor,</p>
                    <p>Dahrul Ehsan.</p>
                  </Col>
                  <Col span={12} className={"contact-right-col"}>
                    <h3> BUSINESS HOUR</h3>
                    <p></p>
                    <p>Monday – Sunday (Everyday)</p>
                    <p>Business Hours : 11.00am to 6.00pm</p>
                    <p>General Line : +995 595 648 648 </p>
                    <p>International Sales : zazatbilisi@gmail.com</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className={"google-map"}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.0582009676614!2d44.76838608042989!3d41.70964113571893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40447332c4da073f%3A0xb2c87b6fda26df6f!2z4YOe4YOY4YOl4YOh4YOU4YOa4YOYIDM0!5e0!3m2!1ska!2sge!4v1714214803545!5m2!1ska!2sge"
              width="1600"
              height="450"
              allowFullScreen="true"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContainer;
