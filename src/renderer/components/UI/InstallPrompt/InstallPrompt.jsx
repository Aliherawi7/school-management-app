import { t } from 'i18next';
import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Check if the app is already installed by looking at display mode or localStorage
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInstalled = localStorage.getItem('isAppInstalled');

        if (isStandalone || isInstalled) {
            setShowInstallPrompt(false);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e); // Save the event
            setShowInstallPrompt(true); // Show the install prompt
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleCloseClick = async () => {
        setDeferredPrompt(null); // Clear the prompt
        setShowInstallPrompt(false); // Hide the prompt after interaction
    };

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                localStorage.setItem('isAppInstalled', 'true'); // Set the installed flag
            } else {
                console.log('User dismissed the install prompt');
            }

            setDeferredPrompt(null); // Clear the prompt
            setShowInstallPrompt(false); // Hide the prompt after interaction
        }
    };

    if (!showInstallPrompt) return null;

    return (

        <div style={styles.prompt}>
            <p className='margin_10'>{t('installMessage')}</p>
            <button onClick={handleInstallClick} style={styles.button}>{t('install')}</button>
            <button onClick={handleCloseClick} style={{ ...styles.button, backgroundColor: 'red' }}>{t('cancel')}</button>
        </div>
    );
};

const styles = {
    prompt: {
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        textAlign: 'center',
    },
    button: {
        padding: '5px 10px',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '2px 4px',
        width: '80px'
    },
};

export default InstallPrompt;
