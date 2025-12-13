import React, { useState } from 'react';
import { Row, Col, Alert, Typography, Divider, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import SubscriptionCard from './SubscriptionCard';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { useSubscribePlan } from '../hooks/useSubscribePlan';
import { useRenewSubscription } from '../hooks/useRenewSubscription';
import { getUserEmail } from '@src/utils/auth';
import './SubscriptionPlans.css';

const { Title, Paragraph } = Typography;

const SubscriptionPlans = () => {
  const { i18n } = useTranslation();
  const isGeorgian = i18n.language === 'ka';
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('subscribe'); // 'subscribe' or 'renew'

  // Get current user's email
  const userEmail = getUserEmail() || '';

  // Mutations
  const subscribeMutation = useSubscribePlan();
  const renewMutation = useRenewSubscription();

  // TODO: Get current plan from different backend endpoint
  const currentPlanId = 'free'; // Default to free for now

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      // Free plan - no payment needed
      subscribeMutation.mutate({
        email: userEmail,
        packageId: plan.id,
        packageName: plan.name,
      });
    } else {
      // Paid plan - show confirmation modal
      setSelectedPlan(plan);
      setModalType('subscribe');
      setIsModalVisible(true);
    }
  };

  const handleRenewPlan = (plan) => {
    setSelectedPlan(plan);
    setModalType('renew');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (!selectedPlan) return;

    if (modalType === 'subscribe') {
      subscribeMutation.mutate({
        email: userEmail,
        packageId: selectedPlan.id,
        packageName: selectedPlan.name,
        price: selectedPlan.price,
        period: selectedPlan.period,
      });
    } else if (modalType === 'renew') {
      renewMutation.mutate({
        email: userEmail,
        packageId: selectedPlan.id,
        packageName: selectedPlan.name,
      });
    }

    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  return (
    <div className="subscription-plans-container">
      <div className="subscription-header">
        <Title level={2}>
          {isGeorgian ? 'გამოწერის პაკეტები' : 'Subscription Plans'}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: '16px' }}>
          {isGeorgian
            ? 'აირჩიეთ თქვენთვის შესაფერისი პაკეტი და მიიღეთ წვდომა მოწინავე ფუნქციებზე'
            : 'Choose the plan that fits your needs and get access to advanced features'}
        </Paragraph>
      </div>

      <Divider />

      <Row gutter={[24, 24]} className="subscription-cards-row">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;

          return (
            <Col key={plan.id} xs={24} sm={24} md={12} lg={12} xl={12}>
              <SubscriptionCard
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                onSelect={handleSelectPlan}
                onRenew={handleRenewPlan}
              />
            </Col>
          );
        })}
      </Row>

      <div className="subscription-footer">
        <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 32 }}>
          {isGeorgian
            ? 'ყველა პაკეტი მოიცავს 24/7 მომხმარებელთა მხარდაჭერას'
            : 'All plans include 24/7 customer support'}
        </Paragraph>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={
          modalType === 'subscribe'
            ? isGeorgian
              ? 'პაკეტის არჩევის დადასტურება'
              : 'Confirm Plan Selection'
            : isGeorgian
            ? 'პაკეტის განახლების დადასტურება'
            : 'Confirm Plan Renewal'
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={isGeorgian ? 'დადასტურება' : 'Confirm'}
        cancelText={isGeorgian ? 'გაუქმება' : 'Cancel'}
        confirmLoading={subscribeMutation.isLoading || renewMutation.isLoading}
      >
        {selectedPlan && (
          <div>
            <p>
              <strong>{isGeorgian ? 'პაკეტი:' : 'Plan:'}</strong>{' '}
              {isGeorgian ? selectedPlan.nameGe : selectedPlan.name}
            </p>
            <p>
              <strong>{isGeorgian ? 'ფასი:' : 'Price:'}</strong>{' '}
              {isGeorgian ? selectedPlan.priceGe : selectedPlan.priceEn} /{' '}
              {isGeorgian ? selectedPlan.periodGe : selectedPlan.periodEn}
            </p>
            <p>
              {modalType === 'subscribe'
                ? isGeorgian
                  ? 'ნამდვილად გსურთ ამ პაკეტზე გამოწერა?'
                  : 'Are you sure you want to subscribe to this plan?'
                : isGeorgian
                ? 'ნამდვილად გსურთ პაკეტის განახლება?'
                : 'Are you sure you want to renew this plan?'}
            </p>
            <Alert
              message={isGeorgian ? 'შენიშვნა' : 'Note'}
              description={
                isGeorgian
                  ? 'გადახდის სისტემა მალე დაემატება. ამჯერად, ეს არის დემო ვერსია.'
                  : 'Payment integration will be added soon. This is a demo version for now.'
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;
