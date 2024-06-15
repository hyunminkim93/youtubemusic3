import React, { useEffect } from 'react';

const Notification = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); // 3초 후에 알림 닫기

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }, [onClose]);

    return (
        <div className="notification">
            {message}
        </div>
    );
};

export default Notification;
