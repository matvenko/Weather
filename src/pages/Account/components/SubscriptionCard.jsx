import React from 'react';
import { Card, Button, List, Tag, Space } from 'antd';
import { CheckOutlined, CloseOutlined, CrownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './SubscriptionCard.css';

const SubscriptionCard = ({ plan, isCurrentPlan, onSelect, onRenew }) => {
  const { i18n } = useTranslation();
  const isGeorgian = i18n.language === 'ka';

  const planName = isGeorgian ? plan.nameGe : plan.name;
  const planDescription = isGeorgian ? plan.descriptionGe : plan.description;
  const planPrice = isGeorgian ? plan.priceGe : plan.priceEn;
  const planPeriod = isGeorgian ? plan.periodGe : plan.periodEn;

  return (
    <Card
      className={`subscription-card ${plan.recommended ? 'recommended' : ''} ${isCurrentPlan ? 'current-plan' : ''}`}
      hoverable={!isCurrentPlan}
      style={{ borderColor: plan.color }}
    >
      {plan.recommended && (
        <Tag color="gold" className="recommended-tag">
          <CrownOutlined /> {isGeorgian ? 'რეკომენდირებული' : 'Recommended'}
        </Tag>
      )}

      {isCurrentPlan && (
        <Tag color="green" className="current-tag">
          <CheckOutlined /> {isGeorgian ? 'თქვენი პაკეტი' : 'Current Plan'}
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
                  <CheckOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                ) : (
                  <CloseOutlined style={{ color: '#d9d9d9', fontSize: '16px' }} />
                )}
                <span style={{ color: feature.included ? '#262626' : '#8c8c8c' }}>
                  {featureText}
                </span>
              </Space>
            </List.Item>
          );
        }}
      />

      <div className="card-actions">
        {isCurrentPlan ? (
          <Button
            type="default"
            size="large"
            block
            onClick={() => onRenew && onRenew(plan)}
          >
            {isGeorgian ? 'პაკეტის განახლება' : 'Renew Plan'}
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            block
            onClick={() => onSelect && onSelect(plan)}
            style={{ backgroundColor: plan.color, borderColor: plan.color }}
          >
            {isGeorgian ? 'არჩევა' : 'Select Plan'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionCard;
