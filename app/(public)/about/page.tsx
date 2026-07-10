'use client';

import { redirect } from 'next/navigation';

export default function AboutPageRedirect() {
    redirect('/about/general');
    return null;
}
