import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Logo({ showText = true, size = 'md', className }: LogoProps) {
    const logoSizes = {
        sm: { svgSize: 'h-4 w-4', outerSize: 'p-1', textSize: 'text-sm' },
        md: { svgSize: 'h-5 w-5', outerSize: 'p-1.5', textSize: 'text-base' },
        lg: { svgSize: 'h-6 w-6', outerSize: 'p-2', textSize: 'text-lg' }
    };

    const { svgSize, outerSize, textSize } = logoSizes[size];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn("rounded-md bg-primary shadow-sm flex items-center justify-center", outerSize)}>
                <svg className={svgSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Book/document shape */}
                    <rect x="4" y="4" width="56" height="56" rx="8" fill="#c4b5fd" />

                    {/* Page lines suggesting content */}
                    <rect x="12" y="16" width="40" height="5" rx="2.5" fill="#6366f1" />
                    <rect x="12" y="29" width="40" height="5" rx="2.5" fill="#6366f1" />
                    <rect x="12" y="42" width="30" height="5" rx="2.5" fill="#6366f1" />
                </svg>
            </div>
            {showText && <span className={cn("font-bold", textSize)}>CPDD</span>}
        </div>
    );
}

interface LogoLinkProps extends LogoProps {
    to?: string;
}

export function LogoLink({ to = "/", showText = true, size = 'md', className }: LogoLinkProps) {
    return (
        <Link to={to} className={cn("flex items-center gap-2 transition-transform hover:scale-105", className)}>
            <Logo showText={showText} size={size} />
        </Link>
    );
}

export default LogoLink;