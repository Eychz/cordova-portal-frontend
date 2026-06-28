// app/api/verify-captcha/route.ts
import { NextResponse } from 'next/server';

interface GoogleVerificationResponse {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    score: number;
    action: string;
    'error-codes'?: string[];
}

// Recommended security threshold: Scores <= 0.5 are flagged as bots/suspicious
const RECAPTCHA_MIN_SCORE = 0.5;

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        console.log("Token received by server:", token);

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Verification token is missing.' },
                { status: 400 }
            );
        }

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            console.error('reCAPTCHA Secret Key is missing in environment variables.');
            return NextResponse.json(
                { success: false, message: 'Internal server configuration error.' },
                { status: 500 }
            );
        }

        // Google expects verification payloads as application/x-www-form-urlencoded
        const params = new URLSearchParams({
            secret: secretKey,
            response: token,
        });

        const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!verifyResponse.ok) {
            return NextResponse.json(
                { success: false, message: 'Failed to contact Google verification servers.' },
                { status: 502 }
            );
        }

        const verificationResult: GoogleVerificationResponse = await verifyResponse.json();

        console.log("reCAPTCHA Verification Result:", verificationResult);

        // 1. Check if the token was successfully verified by Google
        if (!verificationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Security validation failed.',
                    errors: verificationResult['error-codes']
                },
                { status: 400 }
            );
        }

        // 2. Perform score threshold validation (v3 specific feature)
        if (verificationResult.score < RECAPTCHA_MIN_SCORE) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Suspicious activity detected. Access denied.',
                    score: verificationResult.score
                },
                { status: 403 }
            );
        }

        // 3. Captcha verified successfully
        return NextResponse.json({
            success: true,
            score: verificationResult.score,
            action: verificationResult.action
        });

    } catch (error) {
        console.error('Error in captcha verification API:', error);
        return NextResponse.json(
            { success: false, message: 'An unexpected verification error occurred.' },
            { status: 500 }
        );
    }
}
