// src/pages/HomePage/components/DailyForecastList.jsx
import React from "react";
import {Card, List, Tag, Progress, Tooltip, Space} from "antd";
import {formatDateISO, degToCompass, pictocodeToMeta, round1} from "@src/utils/weatherUtils.js";

export default function DailyForecastList({days = []}) {
    if (!Array.isArray(days) || days.length === 0) return null;

    return (
        <List
            grid={{gutter: 16, xs: 1, sm: 2, lg: 3, xl: 4}}
            dataSource={days}
            renderItem={(d) => {
                const meta = pictocodeToMeta(d.pictocode);
                const title = (
                    <Space>
                        <span>{formatDateISO(d.time)}</span>
                        <span aria-label={meta.label} title={meta.label} style={{fontSize: 20}}>{meta.emoji}</span>
                    </Space>
                );

                return (
                    <List.Item key={d.time}>
                        <Card title={title} size="small" className="wx-forecast-card">
                            <div className="wx-row">
                                <div className="wx-col">
                                    <div className="wx-kv">
                                        <span className="wx-k">Max</span>
                                        <Tag color="red">{round1(d.temperature_max)}°</Tag>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">Min</span>
                                        <Tag color="blue">{round1(d.temperature_min)}°</Tag>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">Mean</span>
                                        <span className="wx-v">{round1(d.temperature_mean)}°</span>
                                    </div>
                                </div>

                                <div className="wx-col">
                                    <div className="wx-kv">
                                        <span className="wx-k">Precip</span>
                                        <span className="wx-v">{round1(d.precipitation)} mm</span>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">Prob</span>
                                        <span className="wx-v">{Math.round(d.precipitation_probability || 0)}%</span>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">UV</span>
                                        <span className="wx-v">{d.uvindex ?? "—"}</span>
                                    </div>
                                </div>

                                <div className="wx-col">
                                    <div className="wx-kv">
                                        <span className="wx-k">Wind</span>
                                        <span className="wx-v">
                      {round1(d.windspeed_mean)} m/s {degToCompass(d.winddirection)}
                    </span>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">Pressure</span>
                                        <span className="wx-v">{d.sealevelpressure_mean} hPa</span>
                                    </div>
                                    <div className="wx-kv">
                                        <span className="wx-k">RH</span>
                                        <span className="wx-v">{Math.round(d.relativehumidity_mean)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="wx-progress">
                                <Tooltip
                                    title={`Predictability: ${Math.round(d.predictability)}% (class ${d.predictability_class})`}>
                                    <Progress percent={Math.round(d.predictability)} size="small"/>
                                </Tooltip>
                            </div>
                        </Card>
                    </List.Item>
                );
            }}
        />
    );
}
