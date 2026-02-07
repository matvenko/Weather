import React, { useState, useMemo } from 'react';
import { Row, Col, Alert, Typography, Divider, Modal, Spin, Card, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import SubscriptionCard from './SubscriptionCard';
import { usePackages } from '../hooks/usePackages';
import { useCurrentSubscription } from '../hooks/useCurrentSubscription';
import { useBuyPackage } from '../hooks/useBuyPackage';
import { useCloseSubscription } from '../hooks/useCloseSubscription';
import { SUBSCRIPTION_PLANS } from '../constants/subscriptionPlans';
import { getUserEmail } from '@src/utils/auth';
import './SubscriptionPlans.css';

const { Title, Paragraph } = Typography;

const SubscriptionPlans = () => {
  const { i18n } = useTranslation();
  const isGeorgian = i18n.language === 'ka';
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('buy'); // 'buy' or 'cancel'

  // Get current user's email
  const userEmail = getUserEmail() || '';

  // Fetch data
  const { data: packagesData, isLoading: packagesLoading } = usePackages();
  const { data: currentSubData, isLoading: currentSubLoading } = useCurrentSubscription();

  // Mutations
  const buyMutation = useBuyPackage();
  const closeMutation = useCloseSubscription();

  // Get current and next packages
  const currentPackage = currentSubData?.current;
  const nextPackage = currentSubData?.next;

  // Determine if subscription will be cancelled
  const willBeCancelled = useMemo(() => {
    if (!currentPackage || !nextPackage) return false;
    return currentPackage.packageId !== nextPackage.packageId;
  }, [currentPackage, nextPackage]);

  // Get current plan ID (for active subscription)
  const currentPlanId = currentPackage?.packageId || null;

  // Check if user has any active paid subscription
  const hasActiveSubscription = currentPackage && parseFloat(currentPackage.package?.price || 0) > 0;

  const handleSelectPlan = (plan) => {
    // Buy package directly - redirect to payment
    buyMutation.mutate({
      packageId: plan.id,
    });
  };

  const handleCancelSubscription = (plan) => {
    setSelectedPlan(plan);
    setModalType('cancel');
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (!selectedPlan) return;

    // Cancel subscription
    if (currentPackage?.id) {
      closeMutation.mutate(currentPackage.id);
    }

    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedPlan(null);
  };

  // Show loading state
  if (packagesLoading || currentSubLoading) {
    return (
      <div className="subscription-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="subscription-plans-container">

      <Divider />

      {/* Current Subscription Status */}
      {currentPackage && parseFloat(currentPackage.package?.price || 0) > 0 && (
        <Card
            className={"current-plan-card"}
        >
          <Title level={4} className="current-plan-title">
            {isGeorgian ? 'მიმდინარე პაკეტი' : 'Current Subscription'}
          </Title>
          <Paragraph className={"white"}>
            <strong>{isGeorgian ? 'პაკეტი:' : 'Package:'}</strong>{' '}
            {currentPackage.package?.name}
          </Paragraph>
          <Paragraph className={"white"}>
            <strong>{isGeorgian ? 'მოქმედია:' : 'Active until:'}</strong>{' '}
            {new Date(currentPackage.endDate).toLocaleDateString(isGeorgian ? 'ka-GE' : 'en-US')}
          </Paragraph>

          {willBeCancelled && (
            <Alert
              message={isGeorgian ? 'გაუქმება დაგეგმილია' : 'Cancellation Scheduled'}
              description={
                isGeorgian
                  ? `თქვენი გამოწერა გაუქმდება ${new Date(currentPackage.endDate).toLocaleDateString('ka-GE')}-მდე და შემდეგ გადაერთვება "${nextPackage?.package?.name}" პაკეტზე`
                  : `Your subscription will be cancelled by ${new Date(currentPackage.endDate).toLocaleDateString('en-US')} and switch to "${nextPackage?.package?.name}" package`
              }
              type="warning"
              showIcon
              className="current-plan-alert"
            />
          )}

          {!willBeCancelled && (
            <Button
              danger
              onClick={() => handleCancelSubscription(currentPackage.package)}
              className="current-plan-cancel-btn"
            >
              {isGeorgian ? 'გამოწერის გაუქმება' : 'Cancel Subscription'}
            </Button>
          )}
        </Card>
      )}

      <Row gutter={[32, 32]} className="subscription-cards-row">
        {packagesData && packagesData.map((apiPackage) => {
          const isCurrentPlan = apiPackage.id === currentPlanId;

          // Find matching template from SUBSCRIPTION_PLANS based on price
          const priceValue = parseFloat(apiPackage.price);
          const templatePlan = priceValue === 0
            ? SUBSCRIPTION_PLANS.find(p => p.type === 'FREE')
            : SUBSCRIPTION_PLANS.find(p => p.type === 'PRO');

          // Merge API data with template data
          const formattedPlan = {
            ...templatePlan, // Get all features and descriptions from template
            id: apiPackage.id, // Override with API id
            name: apiPackage.name, // Override with API name
            nameGe: apiPackage.descriptionDictionaryKey || apiPackage.name,
            price: priceValue,
            priceGe: `${apiPackage.price} ₾`,
            priceEn: `${apiPackage.price} ₾`,
          };

          return (
            <Col key={apiPackage.id} xs={24} sm={24} md={12} lg={12} xl={12}>
              <SubscriptionCard
                plan={formattedPlan}
                isCurrentPlan={isCurrentPlan}
                onSelect={handleSelectPlan}
                onCancel={handleCancelSubscription}
                hasActiveSubscription={hasActiveSubscription}
              />
            </Col>
          );
        })}
      </Row>

      <div className="subscription-footer">
        <Paragraph type="secondary" className="subscription-footer-text">
          {isGeorgian
            ? 'ყველა პაკეტი მოიცავს 24/7 მომხმარებელთა მხარდაჭერას'
            : 'All plans include 24/7 customer support'}
        </Paragraph>
      </div>

      {/* Cancel Subscription Modal */}
      <Modal
        title={isGeorgian ? 'გამოწერის გაუქმება' : 'Cancel Subscription'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={isGeorgian ? 'გაუქმება' : 'Cancel Subscription'}
        cancelText={isGeorgian ? 'უკან' : 'Back'}
        confirmLoading={closeMutation.isPending}
        okButtonProps={{ danger: true }}
      >
        <div>
          <p>
            {isGeorgian
              ? 'ნამდვილად გსურთ გამოწერის გაუქმება?'
              : 'Are you sure you want to cancel your subscription?'}
          </p>
          <Alert
            message={isGeorgian ? 'გაფრთხილება' : 'Warning'}
            description={
              isGeorgian
                ? 'გამოწერის გაუქმების შემდეგ, თქვენ კვლავ ექნებათ წვდომა მიმდინარე პერიოდის დასრულებამდე.'
                : 'After cancellation, you will still have access until the end of your current billing period.'
            }
            type="warning"
            showIcon
            className="cancel-modal-alert"
          />
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionPlans;
