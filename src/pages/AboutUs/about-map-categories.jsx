import React from "react";
import { Row, Col } from "antd";
import {
    LuRadar, LuCloudRain, LuThermometer, LuWind, LuCloud,
    LuZap, LuGauge, LuWaves
} from "react-icons/lu";
import "./about.css";

const items = [
    { key: "radar",       title: "ცოცხალი რადარი",          icon: <LuRadar />,        href: "/maps?layer=radar",        featured: true },
    { key: "satellite",   title: "სატელიტი (IR/Visible)",   icon: <LuCloud />,         href: "/maps?layer=satellite"     },
    { key: "precip",      title: "ნალექი (ახლა/გაბ.)",      icon: <LuCloudRain />,     href: "/maps?layer=precip"        },
    { key: "lightning",   title: "ელვა და შტორმები",        icon: <LuZap />,           href: "/maps?layer=lightning"     },
    { key: "temp",        title: "ტემპერატურა",             icon: <LuThermometer />,   href: "/maps?layer=temperature"   },
    { key: "wind",        title: "ქარი და რაფტები",         icon: <LuWind />,          href: "/maps?layer=wind"          },
    { key: "pressure",    title: "იზობარები / წნევა",       icon: <LuGauge />,         href: "/maps?layer=pressure"      },
    { key: "waves",       title: "ტალღები / ზღვა",          icon: <LuWaves />,         href: "/maps?layer=waves"         },
];

export default function AboutMapCategories() {
    return (
        <section className="container MapsIncluded">
            <div className="mi-head">
                <span className="mi-kicker">ჩვენი სერვისით სარგებლობის შემთცვევაში თვენ მიიღებთ</span>
                <h2 className="mi-title">შემდეგი ტიპის რუკებს</h2>
            </div>

            <Row gutter={[24, 24]}>
                {items.map((it) => (
                    <Col key={it.key} xs={24} sm={12} lg={6}>
                        <a className={`mi-card ${it.featured ? "is-featured" : ""}`} href={it.href} aria-label={it.title}>
                            <div className="mi-icon">{it.icon}</div>
                            <h3 className="mi-card-title">{it.title}</h3>
                        </a>
                    </Col>
                ))}
            </Row>
        </section>
    );
}
