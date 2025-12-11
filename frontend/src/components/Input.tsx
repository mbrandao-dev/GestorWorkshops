import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
    className?: string;
}

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    error,
    className = '',
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
        ? 'border-error'
        : isFocused
            ? 'border-primary-500'
            : 'border-dark-300';

    return (
        <View className={`mb-4 ${className}`}>
            <Text className="text-dark-700 font-medium mb-2 text-sm">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`border-2 ${borderColor} rounded-xl px-4 py-3 text-base bg-white`}
                placeholderTextColor="#94a3b8"
            />
            {error && <Text className="text-error text-xs mt-1">{error}</Text>}
        </View>
    );
}
