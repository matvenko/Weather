import React from 'react';
import { Card, Button, List, Tag, Space } from 'antd';
import { CheckOutlined, CloseOutlined, CrownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './SubscriptionCard.css';

const SubscriptionCard = ({ plan, isCurrentPlan, onSelect, onCancel, hasActiveSubscription }) => {
  const { i18n } = useTranslation();
  const {t} = useTranslation()
  const isGeorgian = i18n.language === 'ka';

  const planName = isGeorgian ? plan.nameGe : plan.name;
  const planDescription = isGeorgian ? plan.descriptionGe : plan.description;
  const planPrice = isGeorgian ? plan.priceGe : plan.priceEn;
  const planPeriod = isGeorgian ? plan.periodGe : plan.periodEn;

  return (
    <Card
      className={`subscription-card ${plan.recommended ? 'recommended' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}
      hoverable={!isCurrentPlan}
    >
      {plan.recommended && !hasActiveSubscription && (
        <Tag color="gold" className="recommended-tag">
          <CrownOutlined /> {t("recommended")}
        </Tag>
      )}

      <div className="plan-header">
        <h2 className="plan-name">{planName}</h2>
        <div className="plan-price">
          <span className="price">{planPrice}</span>
          {plan.price > 0 && <span className="period">/ {planPeriod}</span>}
        </div>
        <p className="plan-description">{planDescription}</p>
      </div>

      <List
        className="features-list"
        dataSource={plan.features}
        renderItem={(feature) => {
          const featureText = isGeorgian ? feature.textGe : feature.text;
          return (
            <List.Item className={`feature-item ${feature.included ? 'included' : 'excluded'}`}>
              <Space>
                {feature.included ? (
                  <CheckOutlined className="feature-check-icon" />
                ) : (
                  <CloseOutlined className="feature-close-icon" />
                )}
                <span>{featureText}</span>
              </Space>
            </List.Item>
          );
        }}
      />

      <div className="card-actions">
        {!isCurrentPlan && plan.price > 0 && (
          <Button
            type="primary"
            size="large"
            block
            onClick={() => onSelect && onSelect(plan)}
            className="buy-plan-btn"
          >
            {t("buy_plan")}
          </Button>
        )}
        {isCurrentPlan && (
          <Tag color="green" className="active-package-tag">
            <CheckOutlined /> {t("active_package")}
          </Tag>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionCard;
