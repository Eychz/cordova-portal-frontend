import { useCallback, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useReCaptcha() {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const hasSiteKey = !!siteKey;

    let recaptchaContext;

    // Safely check if we are within the GoogleReCaptchaProvider context tree
    try {
        recaptchaContext = useGoogleReCaptcha();
    } catch (error) {
        if (hasSiteKey) {
            console.warn("useGoogleReCaptcha hook was called outside of a GoogleReCaptchaProvider.");
        }
    }

    const executeRecaptcha = recaptchaContext?.executeRecaptcha;
    const [isVerifying, setIsVerifying] = useState(false);

    const getReCaptchaToken = useCallback(async (actionName: string): Promise<string | null> => {
        if (!hasSiteKey) {
            console.warn('reCAPTCHA site key is missing. Bypassing check locally.');
            return 'bypass-token';
        }

        if (!executeRecaptcha) {
            console.warn('reCAPTCHA v3 script is not loaded, or site key is missing.');
            return null;
        }

        try {
            setIsVerifying(true);
            const token = await executeRecaptcha(actionName);
            return token;
        } catch (error) {
            console.error('reCAPTCHA execution error:', error);
            return null;
        } finally {
            setIsVerifying(false);
        }
    }, [executeRecaptcha, hasSiteKey]);

    return { 
        getReCaptchaToken, 
        isVerifying, 
        isReady: !hasSiteKey || !!executeRecaptcha 
    };
}
