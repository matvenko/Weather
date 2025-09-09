// src/components/header/HeaderContainer.jsx
import React from "react";
import { Layout, Menu, Button } from "antd";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./languageSelector/LanguageSelector.jsx";
import "../../css/header.css";

const HeaderContainer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "/about",   label: <NavLink to="/about">{t("nav.about")}</NavLink> },
    { key: "/maps",    label: <NavLink to="/maps">{t("nav.maps")}</NavLink> },
    { key: "/service", label: <NavLink to="/service">{t("nav.service")}</NavLink> },
    { key: "/contact", label: <NavLink to="/contact">{t("nav.contact")}</NavLink> },
  ];

  const root = `/${(location.pathname.split("/")[1] || "")}`;
  const selected = root === "/" ? [] : [root];

  return (
      <Layout.Header className="header-container" role="banner">
        <div className="header-inner">
          <div className="header-logo" onClick={() => navigate("/")} aria-label="GeoWeather home">
            <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///9duYRXt4BUtn7Z695vvo1RtXzT6dpNtHr4+/lnvIteuYTx+PNtwJBZt4HY7eDi8OWb0rGv2L3r9e6SzKem17rH5dP0+vaIyqO94cuBx5633MPk8ejq9e+i1bd1wpXM59fD5NCYz6uLy6ZzmEWDAAANiklEQVR4nO1d69aqKhTdQuE1KrurpdX7v+NJEcVSZCnod8Zw/s2UKbDuLP/9W7BgwYIFCxYsWLBgwYIFCxYsWLBgwYK/AzfZZs843pc4xfE5293nHpUeJHZ8TBHBORAHLuFFj+f2f0z0bp8iz0IYUasLH67I37xv22DuwYIRbE+pRxDq5CaCErS5xnd37kGr43I+egR3z1wrS4zTx/Z/QdI9HzGQXUWSeI/d3OPvw3aPyCB6JZCzCf+w6HFvn603gh6bSYSj7dxM2pGcPInUhJFMn5e56fwg2fujp0/giNPb35I69wfF+vgVHMnm+Xc4Xk6Kig/KMZubWYmbpXn+Ko5O+hdkztYzxC8Hwu+5Rc59P0y7q3P0n7MSPG8MTmAJfE1m43d5GZ5ABuTfZiK49QxI0FaQ6yyKI3Qm4mfl0zi9UA0i8ztQBA4nJrjdTLVCOdBxUr3xpFOImCZwOqFbFU+4BWtQfzL3eD8LwdzjyKYhOLGMEUGmMHCmFqJfFE/GCV7SqYVoE9g0xcvkWuIbxKxinHsGczixSYbXOfcgh2PQEP8TBE1K1D2IIDLnWtHMDMEQtAfpK3ybomjIujnDZjAXeQ9Tcgl5BszwBDjaPCN4MGbeoUg7QdcDLrncKw/MGbD6jRuwGDXM0HLOegmGBDoC0wwtX2sIbguXisYZokhjeModYKwZZ6jVCIepegbzDC2kLQC3HTLQCRhSTxdDf8jjJ2CobZ2eBtnbUzC0HC3ydDfM9JqEoR7T5tqqKSjuIa7AUIP3ocORaje4URTv5RQVGD7i0SEDuhltgrubtvdMj5+fVtLxX3oYUmv1uSIaO4vj7dOwdQqJnf+2komgHoaliwdzyVoxUthcvNa7Ymb22lbnFKD8HZw7rVnuw95GM0THcQw7fFiasoJQ2++k6K0OWfvrEQgmnVcAMGoSL12SAHGK3Q/G3UVSnOBBRxZ53CTGnSOoKA4YI/VX+gh+hMJhBEOJpENrJqfhRiulWgla+DGcoFQO0DIa1CJRKUKEEIcQ3FLkrXWJFnAG60Q3lWoruuZ7sXEZJTh9hWd7l+zsc/hKSdP6qYTMWlsgbniOP+sJXVR7sXY+KPbfz4PofLuH27shczhBfcFUuhnq7fdGdDlFbhZQtA7btv3hVBW/YZZ0OEBDd1I42TCC9/5BlBS3bLKRH3e9zEtYLmWUMIJaY8X0Ooxhu8H2RbGQqCzeT46yxRK8C6GLcmcg0F1NRQcpjB45w+/t7Q63fB9SP6v+uru9Uuw4Dkr3t9riOBdylWYHW3u52DBZs1U88EILOYJS/hqT0KNcSVCErXprMvGJfE0F7+Ig0iGyBpRWwby2Lnn5X4ubIn9fcgwiU6kaOiTsBjGKaRlNcE+txijmIsgYRTTATVRcpOz+5SI5rLuEE4nYNAYa1aAIuoEzPKkzpF6p+SVxl8oYNVX1Ds+ZAhYpLjz+fze5DV6q5W6veBQwuEID8K7LuOy5b9IJm8Wjka1IwXHFpzJDui424ao/Mu4XezEYFELvBYbqi55YoQCS5de7CiKkzIfFRrZiuVXUobwNaVpc/1IZNqvYUnkZcCCgWaMejydF2C1Ru54mxiYRGuB/Kks8VFx/VVvULGoUdEfoRgDBGCrnm5gglYe/RRST+DIhTglMIyrOyWfdrUBDZi/ENqETMaigryPU3QLPBV1u+cXtTaxSWLr0ovqS2f6WzsnHg0LMX6IIYaeY89EJmbahgBx95WXEZHS3o4UISR/nFYtNucHufDrL/zACoHiUsjxn6r7DJ6KE7u3Wx/aYsMNAIGHTNosGkyaKSwqTPli38sNR51nl4JoHUb/u2JdV7oMDEaYtcUR0spso3Kui9OrQJmhwJDWjdkdEw687jly7GFDp5v5KAvSbHMgHVHiGya8trXC41f6V7q9RAghit11+U9to9XPVipQMdz+7Ch8HNZzpC7LLAcnQHH4npUWf5g4Wm8Ov90HxzwR+xOju0CsJYHXW36CAROK95UnUdpsokqPe4feFUK+x5S92GNGyfVK6Pzdjt+5FuON5nJaE2N5J22qhXhPFcPxfWcqTGQz20UN1fPSj/f3oKf5+svj9fB/jUccaKaAcc6u8H1hRhiiYUFovRvec/qoAir1Q4LgnlGLspe/HB8do3VuK1M0wVVeI6jUgbHsKhjcVZnAVdXTjwZ6wq184infVn4JdHH3HlFUZbtTFmzpD+sqvr71J6tV5ir1kNpyo3o8/UvrQHlfuhRGGVlHiWQfm6mhJ0BkdLkBRJhmAGw/qlqKegQKEGVgklruTpIpabnuFhlxBB0e46eqrH4UG6CU2zlJV1/LaVpCKPSkxeLmUGYbWOv+Dy/RFVdmyUorEEHmcWlJwNSlDZtEXsqayXVWz9KTatW5gx2EYZ40iByhFAENIbqG0lYoYKNdHyjk0n0m/IExz5wlh7KxPgkEEpaguaUA1kaTQDx8zqNpX6oIKrXe5UCGC1YNJVHPMQOLGM6ItqvjIDfMHQE6sUeStvxUDIo9qrUKq6CH1wrBoX+l57l/lv4+gpdV2Ma6KAv4BMgAQhq2WdzcKB+MjLNifdxqCoXXdg62+ICCWd5v3JBtPI46nJaBd2+/qmX+I99TiAUsheteBnlAoevNJVGYI8YCDDXA8QqMDXYklwt0P5Z2I9uoM1cqhGuOpzBPljEcfMPSVgTKIkGHiwknisxjoqE1n9y1f2k71D6DzM+o5buqHz/x98HryrbbsZ5lc7jjT0gICqYtSNkxZUfpHfHKDRmN+l9vxqguKQCKYmeI42dGePHLKo43qs98LfsvYJ0qdpT1IZuaumJYva7Y/Vh53EzQWrgmyMXkeUV+LYlgiXy3lKZ584QzBUlhy+7c4JDe7yjm25B1kUElh1lX3dAKG//LYnWzzwLLcKilMavFzEzkpEwx/7cynpLrYgZWY9hd9fR3tcfQz5P6xiEO3YCWwsq/eCqBSinKCmPdwgLlOcuBXy8geHSPj6lMZfQQbR3soqoy2YQe/uyimt+ftbDeP33VkyMEn1+WnSWopWlhsQgBbb0UXZR/+8I+ZsATbHwHJALM3JR1paTOyoz34ITxe5ZAGHAivhR7tj7ZngOoUcsg9dVYMW0pR0aQ3U3doFX3oq/yG22JWDCj0lj6vcFTYHmwcpj6YKAXiHOoYefIbZRxQrC8PRqA4yQqCYgTDvjpGW/I5lRkX/6ywAX1OeqIHyCkeUpZA59ilZvl9QCqKP5thQJsTVylWQ6vNMSwfBkRVkf9dtQGJYFR4K4wYVzfW6DXJ4PM3+uUaDGrGoxLk8rkinKq5d3XooOmjD2uPcekPuFUOCyy/MAZcsScNnThokap0hyKlPWXoCEUbKvOzsUyBFdAcSR/DSlMoHUXQBFSSEf27wY14+iISXLIlZjm1P1TMjwGd3xp9iVJe0KnVn+gDXzgrUSMObTnQF63hUWmdXm8/fPZQIbcyom2E/Awi3/Qt5aUm4bCnuvXrd4Y33L9IlQDP9Rg5PdENJ/hiOPQ0foFWT4yDKyEzZ9E68cNwoKpguMumZy6GlyZD+NnKBmQHPmdiSNhTq/L5kf0hZaqOMxzfzQoCLt92pXwbOYVSn4FqT6ipgNvCPHk0usWnxOScR1vwr3iUzgX6Dv3D8RswqB9W+vdTanxaKvzqoWPaYDFIcvrcaptS1PBkvcueqeUjSd3HPPjT9DYMkoOXlrHT/8P7JzXQqTEqX20607sK1DC/hx2dG42gc/y4XKaXqSaxcgRZXRrsUKUEnQqvCh6on3QeR7Cqr2TrCmv7fkCnK1z1RX9OQZF6VZV1MYW/x6sG4961CuuujLH5TyGiDSfI5PvYvp4NdKaE61MTmcnvkVp52uJVyc0iwQU5IqOALuON1pXHhyM1FxVGKK3e5T+7WC4I2upDjk69j4Tk8u6IMNJOk1KEaCTkP1nmSfsHEb9PUVbA4m642OExWutFdAwzUWYeirJ3rEtR1OgsR8Y6N3w/WAN1fS31BXTmr9FV65aX41muJSNf0O1MRqH09xi0GQRlpFt68G042tLnpTBAj0k+Enouu7rCG3spouUQe7UZvdg4x3NaHkk1+IXAQPJtQIxf7T0w9MB+WPzILRmWSlNDSxGEsB0xSfe3s73SjCzei82IiVnZLaVYnEYnmGpGs6G0ceWUTPYx7nbg8ZGnPuwmDFm0EJzCvLjP+ClSbFLI1Likc33K0jH/rdwS72nzaRxE88fkZDjNQJFaeh3CHty6v05iCCg1Ymx3YzuxvMHHSSxfEZN+n5v2NCcwhNiZaqVivV9zVEcyjdqgE2nBNrgn/Q3kf4A32WwEP9ia3o0U7ScXMU24scEoaT6B2r5TORz3d0c3KA38rFlE6C+2kZEadrE/xuwwwBGR/YRBSgXYkdbkE7KOM6lACbKrLplDsff4e/xy7F6WBv344Rf/rfUp4h574zrJUoyjbG4WPdg9fGfgTCLspLe/O30C7McG3BQ474kdxcOLfaeGm8RXjyDFuaSI4M3r+b+YPRH3bRhtfIKk3fc+U4e99HVLZjY+B+OSZOF14312WB64FoHyLhC+l+7j1d9UDCC4yTZ7nl7XaMNxvT7Cc7b9/2y7BQsWLFiwYMGCBQsWLFiwYMHs+A9jHOhC9FyIbwAAAABJRU5ErkJggg=="} alt="GeoWeather" />
            <span>GeoWeather</span>
          </div>

          <nav aria-label="Main navigation">
            <Menu
                className="header-menu"
                mode="horizontal"
                selectedKeys={selected}
                items={menuItems}
            />
          </nav>

          <div className="header-right">
            <LanguageSelector />
            <Button onClick={() => navigate("/login")}>{t("auth.login")}</Button>
            <Button type="primary" shape="round" className="btn-cta" onClick={() => navigate("/register")}>
              {t("auth.register")}
            </Button>
          </div>
        </div>
      </Layout.Header>
  );
};

export default HeaderContainer;
