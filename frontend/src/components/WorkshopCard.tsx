import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Workshop } from '../utils/mockData';

interface WorkshopCardProps {
    workshop: Workshop;
    onPress: () => void;
}

export default function WorkshopCard({ workshop, onPress }: WorkshopCardProps) {
    const availableSpots = workshop.capacity - workshop.enrolled;
    const isFull = availableSpots <= 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-2xl p-5 mb-4 shadow-lg border border-dark-100"
            activeOpacity={0.7}
        >
            {/* Header with title */}
            <View className="mb-3">
                <Text className="text-xl font-bold text-dark-900 mb-1">
                    {workshop.title}
                </Text>
                <Text className="text-sm text-dark-500">
                    por {workshop.organizerName}
                </Text>
            </View>

            {/* Description */}
            <Text className="text-dark-600 mb-4 leading-5" numberOfLines={2}>
                {workshop.description}
            </Text>

            {/* Date and Time */}
            <View className="flex-row items-center mb-3">
                <Text className="text-primary-600 font-medium">
                    📅 {formatDate(workshop.dateTime)}
                </Text>
            </View>

            {/* Capacity Info */}
            <View className="flex-row items-center justify-between pt-3 border-t border-dark-100">
                <View className="flex-row items-center">
                    <Text className="text-dark-700 font-medium">
                        {workshop.enrolled}/{workshop.capacity} inscritos
                    </Text>
                </View>

                {isFull ? (
                    <View className="bg-error/10 px-3 py-1 rounded-full">
                        <Text className="text-error font-bold text-xs">
                            LOTADO ({workshop.waitlist} em espera)
                        </Text>
                    </View>
                ) : (
                    <View className="bg-success/10 px-3 py-1 rounded-full">
                        <Text className="text-success font-bold text-xs">
                            {availableSpots} vagas
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}
