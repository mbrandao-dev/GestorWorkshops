import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
}: ButtonProps) {
    const baseClasses = 'py-4 px-6 rounded-xl items-center justify-center';

    const variantClasses = {
        primary: 'bg-primary-600 active:bg-primary-700',
        secondary: 'bg-secondary-600 active:bg-secondary-700',
        outline: 'border-2 border-primary-600 bg-transparent',
    };

    const textClasses = {
        primary: 'text-white font-bold text-base',
        secondary: 'text-white font-bold text-base',
        outline: 'text-primary-600 font-bold text-base',
    };

    const disabledClasses = disabled || loading ? 'opacity-50' : '';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#0284c7' : '#ffffff'} />
            ) : (
                <Text className={textClasses[variant]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
