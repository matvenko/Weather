import React from "react";
import { useTranslation } from "react-i18next";
import {
  FacebookFilled,
  TwitterSquareFilled,
  InstagramFilled,
  LinkedinFilled,
  SendOutlined,
} from "@ant-design/icons";
import "./footer.css";

const FooterTemplate = () => {
  const { t } = useTranslation();

  return (
      <footer className="footer-wrapper">
        <div className="footer-container">
          {/* Column 1 - Logo & Address */}
          <div className="footer-col">
            <h2 className="footer-logo">
              Meteo<span>hub</span>
            </h2>
            <p className="footer-address">
              <strong>10009 Agrofam st, 5th Avenue, 436 Honey London.</strong>
            </p>
            <p className="footer-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            </p>
          </div>

          {/* Column 2 - Contact */}
          <div className="footer-col">
            <p><strong>Phone</strong><br />
              <a href="tel:+1211127368">+(995) 597 333109</a>
            </p>
            <p><strong>E-mail</strong><br />
              <a href="mailto:Meteohub@gmail.com">Meteohub@gmail.com</a>
            </p>
          </div>

          {/* Column 3 - Social + Subscribe */}
          <div className="footer-col">
            <p><strong>Follows On :</strong></p>
            <div className="footer-socials">
              <a href="#"><FacebookFilled /></a>
              <a href="#"><TwitterSquareFilled /></a>
              <a href="#"><InstagramFilled /></a>
              <a href="#"><LinkedinFilled /></a>
            </div>

            <p><strong>Subscribe here</strong></p>
            <div className="footer-subscribe">
              <input type="email" placeholder="Email Address" />
              <button><SendOutlined /></button>
            </div>
            <p className="footer-sub-text">
              Subscribe to our mailing list and get updates to your email inbox.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© Powered By WebMania</p>
        </div>
      </footer>
  );
};

export default FooterTemplate;
