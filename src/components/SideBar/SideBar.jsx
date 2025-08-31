import React, { useEffect } from "react";
import s from "./SideBar.module.css";
import { Navbar } from "react-bootstrap";
import { useGetBrandsQuery } from "../../features/brands/brandsApi.js";
import { useDispatch } from "react-redux";
import { setBrandsData } from "../../features/brands/brandsState.js";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SideBar = ({ brandName, setBrandName, handleNavItemClick }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { responseBrands } = useGetBrandsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        responseBrands: data?.responseBrands,
      }),
    },
  );

  const dispatch = useDispatch();

  const setBrandsStateAc = () => {
    dispatch(setBrandsData({ responseBrands }));
  };

  useEffect(() => {
    setBrandsStateAc();
  }, [responseBrands]);

  const handleClick = (brand) => {
    setBrandName(brand);
    handleNavItemClick();
    navigate(brand ? `/brands/${brand}` : "/");
  };

  return (
    <div className={s.sidebar}>
      <h4 className={s.sidebarTitle}>
        <span>{t("text.brands")}</span>
      </h4>

      <Navbar
        key={-1}
        className={`${s.navbarItem} ${brandName === "" ? s.activeNavItem : ""}`}
        style={{
          borderTop: "0 solid #ccc",
        }}
        onClick={() => handleClick("")}
      >
        <Navbar.Brand
          className={"customNavbarItem"}
          style={{
            color: brandName === "" && "black",
          }}
        >
          All Brands
        </Navbar.Brand>
      </Navbar>

      {responseBrands?.map((brand, index) => (
        <Navbar
          key={index}
          className={`${s.navbarItem} ${
            brand.name === brandName ? s.activeNavItem : ""
          }`}
          onClick={() => handleClick(brand.name)}
        >
          <Navbar.Brand
            className={"customNavbarItem"}
            style={{
              color: brandName === brand.name && "black",
            }}
          >
            {brand.name}
          </Navbar.Brand>
        </Navbar>
      ))}
    </div>
  );
};

export default SideBar;
