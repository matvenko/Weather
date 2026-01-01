/**
 * Subscription plan definitions for Meteo360
 */

export const PLAN_TYPES = {
  FREE: 'FREE',
  PRO: 'PRO'
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    nameGe: 'უფასო პაკეტი',
    type: PLAN_TYPES.FREE,
    price: 0,
    priceGe: '0 ₾',
    priceEn: '0 ₾',
    period: 'lifetime',
    periodGe: 'უვადო',
    periodEn: 'Lifetime',
    description: 'For general users and basic weather monitoring',
    descriptionGe: 'ზოგადი მომხმარებლებისთვის და ბაზისური ამინდის მონიტორინგისთვის',
    features: [
      { text: 'Default forecast', textGe: 'ნაგულისხმევი პროგნოზი', included: true },
      { text: 'Current weather summary', textGe: 'მიმდინარე ამინდის სტატუსი', included: true },
      { text: '3-hour forecast steps', textGe: '3-საათიანი პროგნოზი', included: true },
      { text: '7-day forecast view', textGe: '7-დღიანი პროგნოზი', included: true },
      { text: '1-hour forecast', textGe: '1-საათიანი პროგნოზი', included: false },
      { text: '14-day forecast', textGe: '14-დღიანი პროგნოზი', included: false },
      { text: 'Saved locations', textGe: 'შენახული ლოკაციები', included: false },
      { text: 'Weather alerts', textGe: 'ამინდის გაფრთხილებები', included: false },
      { text: 'Weather maps', textGe: 'ამინდის რუკები', included: false },
      { text: 'Sferic/Lightning maps', textGe: 'სფერიქ/ელვის რუკები', included: false },
      { text: 'Data export (CSV/PDF)', textGe: 'მონაცემთა ექსპორტი', included: false },
      { text: 'High-resolution maps', textGe: 'მაღალი რეზოლუციის რუკები', included: false },
      { text: 'Ad-free mode', textGe: 'რეკლამის გარეშე რეჟიმი', included: false }
    ],
    recommended: false,
    color: '#1890ff'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    nameGe: 'Pro პაკეტი',
    type: PLAN_TYPES.PRO,
    price: 29.99,
    priceGe: '29.99 ₾',
    priceEn: '29.99 ₾',
    period: 'monthly',
    periodGe: 'თვეში',
    periodEn: 'per month',
    description: 'For professional users and advanced forecasting needs',
    descriptionGe: 'პროფესიონალი მომხმარებლებისთვის და მოწინავე პროგნოზირებისთვის',
    features: [
      { text: 'Default forecast', textGe: 'ნაგულისხმევი პროგნოზი', included: true },
      { text: 'Current weather summary', textGe: 'მიმდინარე ამინდის სტატუსი', included: true },
      { text: '1-hour forecast steps', textGe: '1-საათიანი პროგნოზი', included: true },
      { text: '3-hour forecast steps', textGe: '3-საათიანი პროგნოზი', included: true },
      { text: '7-day forecast view', textGe: '7-დღიანი პროგნოზი', included: true },
      { text: '14-day forecast view', textGe: '14-დღიანი პროგნოზი', included: true },
      { text: 'Weather maps', textGe: 'ამინდის რუკები', included: true },
      { text: 'Sferic/Lightning maps', textGe: 'შტერიქ/ელვის რუკები', included: true },
      { text: 'Saved locations', textGe: 'შენახული ლოკაციები', included: true },
      { text: 'Weather alerts', textGe: 'ამინდის გაფრთხილებები', included: true },
      { text: 'Data export (CSV/PDF)', textGe: 'მონაცემთა ექსპორტი', included: true },
      { text: 'High-resolution maps', textGe: 'მაღალი რეზოლუციის რუკები', included: true },
      { text: 'Ad-free mode', textGe: 'რეკლამის გარეშე რეჟიმი', included: true }
    ],
    recommended: true,
    color: '#52c41a'
  }
];
