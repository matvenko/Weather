import { Typography, Card, Tag, Space, Divider, Row, Col, Timeline, Alert } from "antd";
import {
    CloudOutlined,
    UserOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    DashboardOutlined,
    LoginOutlined,
    GlobalOutlined,
    BellOutlined,
    SafetyCertificateOutlined,
    ThunderboltOutlined,
    KeyOutlined,
    TeamOutlined,
    SettingOutlined,
    BarChartOutlined,
    CreditCardOutlined,
    CompassOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ROLES = {
    guest: { label: "სტუმარი", color: "#6B7280", bg: "#f9fafb" },
    user: { label: "მომხმარებელი", color: "#1677ff", bg: "#e6f4ff" },
    admin: { label: "ადმინისტრატორი", color: "#7C3AED", bg: "#f3f0ff" },
};

const RoleBadge = ({ role }) => (
    <Tag
        style={{
            background: ROLES[role].bg,
            color: ROLES[role].color,
            border: `1px solid ${ROLES[role].color}30`,
            fontWeight: 600,
            fontSize: 12,
        }}
    >
        {ROLES[role].label}
    </Tag>
);

const steps = [
    {
        title: "აპლიკაციაში შესვლა",
        icon: <LoginOutlined />,
        color: "#1677ff",
        role: "guest",
        description: "მომხმარებელი ახდენს ავთენტიფიკაციას — ტოკენით ან Google OIDC-ით.",
        details: [
            "სტანდარტული შესვლა: მომხმარებელი შეჰყავს ელ-ფოსტა და პაროლი /login გვერდზე",
            "Google-ით შესვლა: OIDC ფლოუ — /social-login callback, oidc-client-ts ბიბლიოთეკა",
            "ტოკენი ინახება localStorage-ში, userConfig — sessionStorage-ში",
            "RequireAuth wrapper იცავს პროტეგირებულ მარშრუტებს",
            "401 შეცდომაზე privateAxios ავტომატურად გადამისამართებს /login-ზე",
        ],
    },
    {
        title: "მდებარეობის არჩევა",
        icon: <EnvironmentOutlined />,
        color: "#10B981",
        role: "user",
        description: "მომხმარებელი ირჩევს ან ეძებს ქალაქს ამინდის საპროგნოზოდ.",
        details: [
            "ნაგულისხმევი მდებარეობა: თბილისი, საქართველო (41.6914, 44.8341)",
            "useSearchLocation.ts hook — ქალაქის ძიება API-ის მეშვეობით",
            "კოორდინატები (lat/lon) გამოიყენება ამინდის მოთხოვნებში",
            "მდებარეობის ცვლილება ავტომატურად განაახლებს პროგნოზს",
        ],
    },
    {
        title: "ყოველდღიური პროგნოზი",
        icon: <CloudOutlined />,
        color: "#1677ff",
        role: "user",
        description: "სისტემა იტვირთება დღიური ამინდის პროგნოზი React Query-ის მეშვეობით.",
        details: [
            "Endpoint: GET /api/v1/weather/day",
            "TanStack React Query — კეშირება და ფონური განახლება",
            "მონაცემები ნაჩვენებია: ტემპერატურა, ნალექი, ქარი, ტენიანობა",
            "დღიური ფლობს ყოველდღიურ ტემპერატურის Min/Max დიაპაზონს",
            "ენობრივი ლოკალიზაცია: Georgian (ka) და English (en)",
        ],
    },
    {
        title: "საათობრივი პროგნოზი",
        icon: <ThunderboltOutlined />,
        color: "#F59E0B",
        role: "user",
        description: "მომხმარებელი ნახულობს საათობრივ ამინდის პროგნოზს.",
        details: [
            "Endpoint: GET /api/v1/weather/hour",
            "გამოჩნდება მომდევნო საათების ამინდი",
            "ვიზუალი: ჰორიზონტალური სქროლი საათობრივი ბარათებისთვის",
            "ყოველი ბარათი: დრო, ტემპერატურა, ამინდის იკონი",
            "სათაური და დიაპაზონის toggle ვერტიკალურად დალაგებულია",
        ],
    },
    {
        title: "ამინდის რუკები",
        icon: <CompassOutlined />,
        color: "#7C3AED",
        role: "user",
        description: "ინტერაქტიური ამინდის რუკები — /maps და /sferic-map მარშრუტები.",
        details: [
            "/maps — ამინდის ინტერაქტიული ფენიანი რუკა (WeatherMaps გვერდი)",
            "/sferic-map — ელვისცემის და ჭექა-ქუხილის რუკა (SfericMap გვერდი)",
            "ორივე გვერდი მუშაობს Standalone layout-ში (WeatherLayout-ის გარეშე)",
            "ხელმისაწვდომია ავტორიზაციის გარეშეც",
        ],
    },
    {
        title: "ენის გადართვა",
        icon: <GlobalOutlined />,
        color: "#10B981",
        role: "user",
        description: "მომხმარებელი ცვლის ინტერფეისის ენას ქართულსა და ინგლისურს შორის.",
        details: [
            "i18n კონფიგურაცია: src/services/i18n/i18n.js",
            "ნაგულისხმევი ენა: ქართული (ka)",
            "მხარდაჭერილი ენები: ka, en",
            "ენის არჩევანი ინახება cookies-ში სესიებს შორის",
            "changeLanguage() utility: src/configs/config.js",
        ],
    },
    {
        title: "ადმინ პანელი",
        icon: <DashboardOutlined />,
        color: "#7C3AED",
        role: "admin",
        description: "ადმინისტრატორი მართავს მომხმარებლებს, გამოწერებს და ტრანზაქციებს.",
        details: [
            "/admin — Dashboard: სტატისტიკა ApexCharts გრაფიკებით",
            "/users — მომხმარებლების სია Ant Design ცხრილით",
            "/transactions — ტრანზაქციების ისტორია",
            "/subscriptions — გამოწერის გეგმების მართვა",
            "ყველა ადმინ-მარშრუტი RequireAuth-ით დაცულია",
            "AdminLayout — ცალკე sidebar-ით",
        ],
    },
    {
        title: "გამოწერა",
        icon: <CreditCardOutlined />,
        color: "#1677ff",
        role: "user",
        description: "მომხმარებელი ირჩევს გამოწერის გეგმას დამატებითი ფუნქციებისთვის.",
        details: [
            "გეგმების ბარათები glass-morphism სტილით",
            "ამჟამინდელი გეგმა გამოყოფილია სქელი ჩარჩოთი",
            "RTK Query (apiSlice.js) — გამოწერის API ენდფოინთები",
            "გამოწერის სტატუსი ნახულობს /account გვერდზე",
        ],
    },
];

export default function FlowViewPage() {
    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ marginBottom: 4 }}>
                    აპლიკაციის პროცესის აღწერა
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                    ნაბიჯ-ნაბიჯ გზამკვლევი — ამინდის აპლიკაციის ფუნქციონალი ({steps.length} ნაბიჯი)
                </Text>
                <Divider style={{ marginTop: 16 }} />

                <Space wrap style={{ marginBottom: 8 }}>
                    {Object.keys(ROLES).map((k) => (
                        <RoleBadge key={k} role={k} />
                    ))}
                </Space>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {steps.map((step, index) => (
                    <Card
                        key={index}
                        styles={{ body: { padding: "20px 24px" } }}
                        style={{
                            borderLeft: `4px solid ${step.color}`,
                            borderRadius: 10,
                        }}
                    >
                        <Row gutter={[16, 12]} align="top">
                            <Col xs={24} md={7}>
                                <Space align="start">
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: step.color + "18",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            color: step.color,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {step.icon}
                                    </div>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                            <Text style={{ fontSize: 11, color: "#999" }}>ნაბიჯი {index + 1}</Text>
                                        </div>
                                        <Text strong style={{ fontSize: 15, display: "block", lineHeight: 1.4 }}>
                                            {step.title}
                                        </Text>
                                        <div style={{ marginTop: 6 }}>
                                            <RoleBadge role={step.role} />
                                        </div>
                                    </div>
                                </Space>
                            </Col>
                            <Col xs={24} md={17}>
                                <Paragraph style={{ marginBottom: 10, color: "#555" }}>
                                    {step.description}
                                </Paragraph>
                                <Timeline
                                    style={{ marginBottom: 0 }}
                                    items={step.details.map((d) => ({
                                        dot: <div style={{ width: 6, height: 6, borderRadius: "50%", background: step.color, marginTop: 6 }} />,
                                        children: <Text style={{ fontSize: 13 }}>{d}</Text>,
                                    }))}
                                />
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>

            <Divider style={{ marginTop: 40 }} />

            <Card
                styles={{ body: { padding: "20px 24px" } }}
                style={{ borderRadius: 10, background: "#fafafa" }}
            >
                <Title level={5} style={{ marginBottom: 16 }}>
                    <CloudOutlined style={{ color: "#1677ff", marginRight: 8 }} />
                    API Endpoints — მოკლე მიმოხილვა
                </Title>
                <Row gutter={[12, 12]}>
                    {[
                        { method: "GET",  url: "/api/v1/weather/day",   desc: "დღიური ამინდის პროგნოზი (lat, lon პარამეტრებით)", role: "user" },
                        { method: "GET",  url: "/api/v1/weather/hour",  desc: "საათობრივი ამინდის პროგნოზი (lat, lon პარამეტრებით)", role: "user" },
                        { method: "POST", url: "/api/v1/auth/login",    desc: "მომხმარებლის ავთენტიფიკაცია — ტოკენის მიღება", role: "guest" },
                        { method: "POST", url: "/api/v1/auth/register", desc: "ახალი მომხმარებლის რეგისტრაცია", role: "guest" },
                        { method: "GET",  url: "/api/v1/user/profile",  desc: "მომხმარებლის მონაცემების მიღება", role: "user" },
                    ].map((ep, i) => (
                        <Col xs={24} key={i}>
                            <Space wrap>
                                <Tag color={ep.method === "GET" ? "blue" : "green"} style={{ fontFamily: "monospace", fontWeight: 700 }}>
                                    {ep.method}
                                </Tag>
                                <Text code style={{ fontSize: 12 }}>{ep.url}</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>— {ep.desc}</Text>
                                <RoleBadge role={ep.role} />
                            </Space>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Divider style={{ marginTop: 32 }} />

            <Card styles={{ body: { padding: "20px 24px" } }} style={{ borderRadius: 10, background: "#fafafa", marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <ThunderboltOutlined style={{ color: "#7C3AED", marginRight: 8 }} />
                    ტექნიკური არქიტექტურა
                </Title>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <Space align="start">
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e6f4ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <BarChartOutlined style={{ color: "#1677ff", fontSize: 16 }} />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 14 }}>ჰიბრიდული State Management</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    <b>Redux Toolkit</b> — ავთენტიფიკაციის სთეიტი და viewport განზომილებები. <b>React Query (TanStack)</b> — ამინდის სერვერ-სთეიტი კეშირებით. <b>Context API</b> — OIDC auth და გლობალური შეტყობინებები.
                                </Text>
                            </div>
                        </Space>
                    </div>
                    <Divider style={{ margin: "4px 0" }} />
                    <div>
                        <Space align="start">
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <SafetyCertificateOutlined style={{ color: "#10B981", fontSize: 16 }} />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 14 }}>ავთენტიფიკაციის ორი მეთოდი</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    <b>ტოკენ-ბეისდ:</b> Bearer ტოკენი localStorage-ში, privateAxios ავტომატურად ანიჭებს. <b>OIDC/OAuth2:</b> Google login oidc-client-ts ბიბლიოთეკით, callback — /social-login მარშრუტი.
                                </Text>
                            </div>
                        </Space>
                    </div>
                    <Divider style={{ margin: "4px 0" }} />
                    <div>
                        <Space align="start">
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <GlobalOutlined style={{ color: "#7C3AED", fontSize: 16 }} />
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 14 }}>Provider იერარქია</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    <Text code>Redux Provider</Text> → <Text code>BrowserRouter</Text> → <Text code>QueryProvider</Text> → <Text code>GlobalProvider</Text>. ყველა პროვაიდერი შეკრებილია <Text code>PublicProviders.jsx</Text>-ში.
                                </Text>
                            </div>
                        </Space>
                    </div>
                </div>
            </Card>

            <Divider style={{ marginTop: 32 }} />

            <Card styles={{ body: { padding: "20px 24px" } }} style={{ borderRadius: 10, background: "#fafafa", marginBottom: 24 }}>
                <Title level={5} style={{ marginBottom: 16 }}>
                    <KeyOutlined style={{ color: "#7C3AED", marginRight: 8 }} />
                    მარშრუტები და Responsive Breakpoints
                </Title>
                <Row gutter={[12, 10]}>
                    {[
                        { path: "/",             label: "Homepage",          desc: "ამინდის მთავარი გვერდი — დღიური და საათობრივი პროგნოზი", auth: false },
                        { path: "/about",        label: "About",             desc: "პროექტის შესახებ", auth: false },
                        { path: "/account",      label: "Account",           desc: "მომხმარებლის ანგარიში და გამოწერა", auth: false },
                        { path: "/maps",         label: "Weather Maps",      desc: "ინტერაქტიური ამინდის რუკა (Standalone layout)", auth: false },
                        { path: "/sferic-map",   label: "Sferic Map",        desc: "ელვისცემის რუკა (Standalone layout)", auth: false },
                        { path: "/login",        label: "Login",             desc: "ავტორიზაციის გვერდი", auth: false },
                        { path: "/register",     label: "Register",          desc: "რეგისტრაციის გვერდი", auth: false },
                        { path: "/admin",        label: "Admin Dashboard",   desc: "ადმინ პანელი — სტატისტიკა", auth: true },
                        { path: "/users",        label: "Users",             desc: "მომხმარებლების მართვა", auth: true },
                        { path: "/transactions", label: "Transactions",      desc: "ტრანზაქციების ისტორია", auth: true },
                        { path: "/subscriptions",label: "Subscriptions",     desc: "გამოწერის გეგმების მართვა", auth: true },
                        { path: "/view",         label: "Flow View",         desc: "აპლიკაციის ფლოუს დოკუმენტაცია (ეს გვერდი)", auth: false },
                    ].map((r, i) => (
                        <Col xs={24} sm={12} key={i}>
                            <Space size={8} align="start">
                                <Text code style={{ fontSize: 12, minWidth: 120 }}>{r.path}</Text>
                                <div>
                                    <Space size={4}>
                                        <Text strong style={{ fontSize: 13 }}>{r.label}</Text>
                                        {r.auth && <Tag color="purple" style={{ fontSize: 10, padding: "0 4px", margin: 0 }}>protected</Tag>}
                                    </Space>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{r.desc}</Text>
                                </div>
                            </Space>
                        </Col>
                    ))}
                </Row>

                <Divider style={{ margin: "16px 0" }} />

                <Text strong style={{ fontSize: 13, display: "block", marginBottom: 10 }}>Responsive Breakpoints (Redux-ში ინახება)</Text>
                <Row gutter={[8, 8]}>
                    {[
                        { label: "XS", range: "< 480px" },
                        { label: "SM", range: "480–576px" },
                        { label: "MD", range: "576–768px" },
                        { label: "LG", range: "768–992px" },
                        { label: "XL", range: "1200–1536px" },
                        { label: "XXL", range: "> 1536px" },
                    ].map((bp) => (
                        <Col key={bp.label}>
                            <Tag style={{ fontFamily: "monospace" }}><b>{bp.label}</b>: {bp.range}</Tag>
                        </Col>
                    ))}
                </Row>
            </Card>

            <Divider style={{ marginTop: 32 }} />

            <div style={{ marginBottom: 8 }}>
                <Space style={{ marginBottom: 12 }}>
                    <WarningOutlined style={{ color: "#F59E0B", fontSize: 16 }} />
                    <Text strong style={{ fontSize: 15 }}>მნიშვნელოვანი შენიშვნები</Text>
                </Space>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Alert
                        type="info"
                        showIcon
                        message={
                            <span>
                                <b>privateAxios</b> და <b>RTK Query baseQuery</b> — ორივე იყენებს <Text code>VITE_API_URL</Text> env ცვლადს. Default: <Text code>https://weather-api.webmania.ge</Text>
                            </span>
                        }
                    />
                    <Alert
                        type="warning"
                        showIcon
                        message={
                            <span>
                                <b>Token Auth</b> და <b>OIDC Auth</b> დამოუკიდებლად მუშაობს. ტოკენი ინახება <Text code>localStorage</Text>-ში, OIDC userConfig — <Text code>sessionStorage</Text>-ში.
                            </span>
                        }
                    />
                    <Alert
                        type="info"
                        showIcon
                        message={
                            <span>
                                Path alias: <Text code>@src</Text> → <Text code>./src</Text>. გამოიყენეთ ეს ყველა import-ში Vite კონფიგურაციის მიხედვით.
                            </span>
                        }
                    />
                    <Alert
                        type="info"
                        showIcon
                        message={
                            <span>
                                კოდბეისი <b>ბილინგვალურია</b> — UI და კოდის კომენტარები ქართულ და ინგლისურ ენებზე. TypeScript-ზე თანდათანობითი მიგრაცია: .jsx, .tsx, .js ფაილები თანაარსებობს.
                            </span>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
