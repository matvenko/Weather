import React from "react";
import { useTranslation } from "react-i18next";
import { AiFillFacebook, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

const DaytonaFooter = ({ setBrandName }) => {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="footer-top footer-top-2">
        <div className="container">
          <div className="col-sm-2 footer-top-col head-col logo">
            <img
              className="img-responsive"
              src="https://wingwahwatch.com/wp-content/uploads/2016/08/ww-logo.png"
            />

            <div className="divider hidden-xs"></div>
          </div>

          <div className="col-sm-2 footer-top-col head-col menu1-col">
            <h3>Menu</h3>

            <div className="menu-footer1-container">
              <ul id="menu-footer1" className="">
                <li
                  id="menu-item-101781"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item current_page_item menu-item-101781 firstItem"
                >
                  <a href="/" aria-current="page">
                    Home
                  </a>
                </li>
                <li
                  id="menu-item-20120"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-20120"
                >
                  <a href="/about">About Us</a>
                </li>
                <li
                  id="menu-item-20121"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home current-menu-item current_page_item menu-item-20121"
                >
                  <a href="/" aria-current="page">
                    Watches
                  </a>
                </li>
                <li
                  id="menu-item-20124"
                  className="menu-item menu-item-type-post_type menu-item-object-page menu-item-20124 lastItem"
                >
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="divider hidden-xs"></div>
          </div>

          <div className="col-sm-8 footer-top-col head-col menu2-col">
            <h3>Watches</h3>

            <div className="menu-footer2-container">
              <ul id="menu-footer2" className="">
                <li
                  id="menu-item-87266"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87266 firstItem"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Audemars Piguet");
                    }}
                  >
                    Audemars Piguet
                  </a>
                </li>
                <li
                  id="menu-item-87246"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87246"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Bvlgari");
                    }}
                  >
                    Bvlgari
                  </a>
                </li>
                <li
                  id="menu-item-87247"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87247"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Cartier");
                    }}
                  >
                    Cartier
                  </a>
                </li>
                <li
                  id="menu-item-87248"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87248"
                >
                  <a href="#" type={"tel"}>
                    <AiOutlinePhone /> 595 648 648
                  </a>
                </li>
                <div className="clearfix"></div>
                <li
                  id="menu-item-87249"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87249"
                >
                  <a href="#">Cartier</a>
                </li>
                <li
                  id="menu-item-87250"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87250"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Montblanc");
                    }}
                  >
                    Montblanc
                  </a>
                </li>
                <li
                  id="menu-item-87251"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87251"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Omega");
                    }}
                  >
                    Omega
                  </a>
                </li>
                <li
                  id="menu-item-87252"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87252"
                >
                  <a href="#">
                    {" "}
                    <AiOutlineMail /> zazatbilisi@gmail.com
                  </a>
                </li>
                <div className="clearfix"></div>
                <li
                  id="menu-item-87253"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87253"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Panerai");
                    }}
                  >
                    Panerai
                  </a>
                </li>
                <li
                  id="menu-item-87254"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87254"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Rolex");
                    }}
                  >
                    Rolex
                  </a>
                </li>
                <li
                  id="menu-item-87256"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87256"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Zenith");
                    }}
                  >
                    Zenith
                  </a>
                </li>
                <li
                  id="menu-item-87257"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87257"
                >
                  <a href="#">
                    {" "}
                    <AiFillFacebook />{" "}
                    <a href={"facebook.com/saatebis.lombardi"}>
                      facebook.com/saatebis.lombardi
                    </a>
                  </a>
                </li>
                <div className="clearfix"></div>
                <li
                  id="menu-item-87258"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87258"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Breitling");
                    }}
                  >
                    Breitling
                  </a>
                </li>
                <li
                  id="menu-item-87259"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87259"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Hublot");
                    }}
                  >
                    Hublot
                  </a>
                </li>
                <li
                  id="menu-item-87260"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand menu-item-87260"
                >
                  <a
                    href="#"
                    onClick={() => {
                      setBrandName("Other");
                    }}
                  >
                    Other
                  </a>
                </li>
                <li
                  id="menu-item-87265"
                  className="menu-item menu-item-type-taxonomy menu-item-object-brand 87265"
                >
                  <a href="#">
                    <b>© Powered By WebMania</b>
                  </a>
                </li>

                <div className="clearfix"></div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={"clearer"}></div>
    </footer>
  );
};

export default DaytonaFooter;
