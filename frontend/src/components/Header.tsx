import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = false, rightAction }: HeaderProps) {
    const router = useRouter();

    return (
        <View className="bg-primary-600 pt-12 pb-4 px-5">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {showBack && (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mr-3 p-2"
                            activeOpacity={0.7}
                        >
                            <Text className="text-white text-2xl">←</Text>
                        </TouchableOpacity>
                    )}
                    <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>
                        {title}
                    </Text>
                </View>
                {rightAction && <View>{rightAction}</View>}
            </View>
        </View>
    );
}
