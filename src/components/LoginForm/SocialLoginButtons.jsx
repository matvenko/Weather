import React from 'react';
import {Button, Divider, Tooltip} from 'antd';
import {AppleOutlined, FacebookOutlined, GoogleOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {handleAppleLogin, handleFacebookLogin, handleGoogleLogin} from '@src/utils/socialAuth.js';
import s from './Login.module.css';

export default function SocialLoginButtons() {
    const {t} = useTranslation();

    const buttons = [
        {
            icon: <GoogleOutlined/>,
            className: s.googleBtn,
            onClick: handleGoogleLogin,
            tooltip: t("auth.google_sign_in"),
        },
        {
            icon: <FacebookOutlined/>,
            className: s.facebookBtn,
            onClick: handleFacebookLogin,
            tooltip: t("auth.facebook_sign_in"),
        },
        {
            icon: <AppleOutlined/>,
            className: s.appleBtn,
            onClick: handleAppleLogin,
            tooltip: t("auth.apple_sign_in"),
        },
    ];

    return (
        <>
            <Divider className={s.divider}>or continue with</Divider>

            <div className={s.socialButtons}>
                {buttons.map((btn, index) => {
                    const button = (
                        <Button
                            key={index}
                            shape="circle"
                            size="large"
                            icon={btn.icon}
                            className={btn.className}
                            onClick={btn.onClick}
                        />
                    );

                    return (
                        <Tooltip key={index} title={btn.tooltip}>
                            {button}
                        </Tooltip>
                    );
                })}
            </div>
        </>
    );
}
