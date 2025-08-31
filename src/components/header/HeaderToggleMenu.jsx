import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import SideBar from "../SideBar/SideBar.jsx";

const HeaderToggleMenu = ({
  brandName,
  setBrandName,
  setCategory,
  setShowBanner,
  setOnSale,
  setCurrentPage,
  setDisableSearch,
  setSearchText,
}) => {
  const { t } = useTranslation();
  const closeButtonRef = useRef(null);

  return (
    <div className="container-fluid">
      <div
        className="offcanvas offcanvas-start  overflow-auto"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            // onClose={handleClose}
            ref={closeButtonRef}
          ></button>
        </div>
        <div className="offcanvas-body overflow-auto">
          <SideBar
            brandName={brandName}
            setBrandName={setBrandName}
            handleNavItemClick={() => {
              setOnSale("N");
              setShowBanner(false);
              setCurrentPage(1);
              setCategory("A");
              setSearchText("");
              setDisableSearch(true);
              closeButtonRef.current.click();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderToggleMenu;
