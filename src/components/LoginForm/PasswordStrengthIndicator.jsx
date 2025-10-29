import React, { useEffect, useState } from 'react';
import { CheckCircleFilled, CloseCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import s from './PasswordStrength.module.css';

const PasswordStrengthIndicator = ({ password }) => {
    const { t } = useTranslation();
    const [shouldHide, setShouldHide] = useState(false);

    const checks = [
        {
            label: t('auth.password_requirements.min_length'),
            test: (pwd) => pwd.length >= 8,
        },
        {
            label: t('auth.password_requirements.uppercase'),
            test: (pwd) => /[A-Z]/.test(pwd),
        },
        {
            label: t('auth.password_requirements.lowercase'),
            test: (pwd) => /[a-z]/.test(pwd),
        },
        {
            label: t('auth.password_requirements.number'),
            test: (pwd) => /[0-9]/.test(pwd),
        },
    ];

    const getStatus = (check) => {
        if (!password) return 'inactive';
        return check.test(password) ? 'success' : 'error';
    };

    const getIcon = (status) => {
        if (status === 'inactive') return <MinusCircleFilled className={s.iconInactive} />;
        if (status === 'success') return <CheckCircleFilled className={s.iconSuccess} />;
        return <CloseCircleFilled className={s.iconError} />;
    };

    useEffect(() => {
        const allPassed = checks.every(check => check.test(password));
        if (allPassed) {
            const timer = setTimeout(() => setShouldHide(true), 500);
            return () => clearTimeout(timer);
        } else {
            setShouldHide(false);
        }
    }, [password]);

    return (
        <div className={`${s.container} ${shouldHide ? s.hidden : ''}`}>
            {checks.map((check, index) => {
                const status = getStatus(check);
                return (
                    <div key={index} className={`${s.requirement} ${s[status]}`}>
                        {getIcon(status)}
                        <span className={s.label}>{check.label}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default PasswordStrengthIndicator;
