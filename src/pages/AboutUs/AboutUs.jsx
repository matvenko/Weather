import React from "react";
import "./about.css";
import {useTranslation} from "react-i18next";
import {FiPhone} from "react-icons/fi";
import {Button, Col, Row} from "antd";
import FooterTemplate from "../../components/footer/FooterTemplate.jsx";
import AboutMapCategories from "./about-map-categories.jsx";

export default function About() {

    const {t} = useTranslation();

    return (<>
            <div className="w3l-breadcrumb py-5">
                <div className="container py-xl-5 py-md-4 mt-5 AboutPageBanner">
                    <h4 className="inner-text-title font-weight-bold mb-sm-2">
                        {t('nav.about')}</h4>

                    <ul className="breadcrumbs-custom-path AllBreadcrumbs">
                        <a href="https://wp.w3layouts.com/cafephile"
                           rel="nofollow">{t('nav.home')}</a>
                        <span className="secondary-breadcrumbs-name">
                           &nbsp;&nbsp;»&nbsp;&nbsp; {t('nav.about')}
                        </span>
                    </ul>
                </div>
            </div>

            <div className="white-wrapper">
                <section className="container AboutPageAbout">

                    <Row className="row about-row">
                        <Col>
                            <div className="about-panel">
                                <h3 className="title-w3l">
                                    <span>MeteoHub </span> — ზუსტი პროგნოზები<br/> და ინტერაქტიული რუკები
                                </h3>
                                <p className="about-lead">
                                    MeteoHub აერთიანებს სატელიტურ მონაცემებს, რადარსა და
                                    მაღალი გარჩევადობის მოდელებს, რომ მიიღოთ ჰიპერლოკალური პროგნოზი
                                    თქვენი მისამართისთვის…
                                </p>
                                <div className="w3banner-content-btns">
                                    <a href="/contact" className="btn about-btn btn-primary me-2">
                                        დაგვიკავშირდით <span className="arrow">→</span>
                                    </a>
                                </div>
                            </div>
                        </Col>

                        <Col className="col-lg-6 text-left ps-lg-5 mt-lg-0 mt-md-5 mt-4">
                            <h3 className="title-w3l">
                                <br/>
                                <span>{t("nav.about")} </span>
                            </h3>
                            <p className="about-text">
                                პლატფორმა შექმნილია აგროსექტორისთვის, ენერგეტიკისთვის და
                                ყოველდღიური მომხმარებლებისთვის. მიიღეთ წერტილოვანი გაფრთხილებები
                                სეტყვის, ძლიერი ქარისა და წყალდიდობის რისკებზე, შექმენით გაზიარებადი
                                რუკები ნალექის ინტენსივობითა და მოღრუბლულობით. ბიზნესისთვის — მარტივი
                                API და ისტორიული არქივი…
                            </p>
                        </Col>
                    </Row>
                </section>
            </div>

            <div className={"grey-wrapper"}>
                <section className="container AboutWhy">
                    <div className="AboutWhy-grid">
                        {/* Left */}
                        <div className="why-left">
                            <span className="why-kicker">რატომ ჩვენ</span>
                            <h2 className="why-title">
                                სანდო პროგნოზები და გადაწყვეტილებები
                            </h2>
                            <p className="why-text">
                                MeteoHub გაძლევს ჰიპერლოკალურ პროგნოზებს, რადარის/სატელიტის ფენებსა და
                                ჭკვიან შეტყობინებებს — რომ სამუშაოები დაგეგმარო მონაცემებით, არა ინტუიციით.
                            </p>
                            <a className="btn why-call-btn" href="tel:+99512345678">
                                <FiPhone size={18}/> &nbsp;+995 123 456 78
                            </a>
                        </div>

                        {/* Card 1 */}
                        <article className="why-card">
                            <img
                                src="https://images.stockcake.com/public/3/1/4/314277f1-d11f-41dc-bc7b-1714255f75f2_large/tech-savvy-farmer-stockcake.jpg"
                                alt="ამინდის სადგური და ანემომეტრი"
                                className="why-img"
                            />
                            <h3 className="why-card-title">ჩვენი მისია</h3>
                            <p className="why-card-text">
                                მივაწოდოთ ბიზნესებსა და ფერმერებს ზუსტი, დროული პროგნოზები — ნალექის
                                წუთობრივ დინამიკამდე და ქარის რაფტებამდე, რათა შემცირდეს რისკები და
                                გაიზარდოს ეფექტიანობა.
                            </p>
                        </article>

                        {/* Card 2 */}
                        <article className="why-card">
                            <img
                                src="https://images.stockcake.com/public/0/f/b/0fbda7b6-a13b-41cb-ba3c-4455ae92c2c4_large/artistic-landscape-spectrum-stockcake.jpg"
                                alt="კუმულონიმბუს ღრუბელი ჰორიზონტზე"
                                className="why-img"
                            />
                            <h3 className="why-card-title">ჩვენი ხედვა</h3>
                            <p className="why-card-text">
                                შევქმნათ ერთიანი ამინდის ეკოსისტემა — ინტერაქტიული რუკებით, API-ებით და
                                ისტორიული არქივით, რომ მონაცემები მარტივად ინტეგრირდეს ნებისმიერ პროცესში.
                            </p>
                        </article>
                    </div>
                </section>
            </div>

            <div className="transparent-container hero-band">
                <div className="container ServicesPageCover">
                    <Row gutter={[24, 24]} align="middle" wrap>
                        {/* Left column */}
                        <Col xs={24} md={12}>
                            <div className="title-content">
                                <span className="title-subw3hny hero-kicker">ბუნებასთან ერთად</span>
                                <h1 className="hero-title">
                                    ძლიერი ეკონომიკისთვის,<br/> ჯანმრთელი მომავლით
                                </h1>
                                <Button type={"text"} className={"btn-style"}>
                                    შემოგვიერთდით
                                </Button>
                            </div>
                        </Col>

                        {/* Right column */}
                        <Col xs={24} md={12}>
                            <p className="vhny-para hero-copy">
                                MeteoHub აერთიანებს რადარს, სატელიტსა და მეტეოსადგურებს —
                                ზუსტი, ჰიპერლოკალური პროგნოზებისთვის. იხილე ნალექის წუთობრივი დინამიკა,
                                ქარის რაფტები და ღრუბლოვანება რუკებზე, ხოლო ჭკვიანი შეტყობინებები
                                დაგეხმარება სწორი გადაწყვეტილებების მიღებაში.
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className={"white-wrapper"}>
                <AboutMapCategories/>
            </div>

            <FooterTemplate/>

        </>
    );
}
