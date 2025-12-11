import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';
import { useUser } from '../utils/UserContext';
import { Workshop } from '../utils/mockData';

export default function WorkshopDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { role, selectedUser } = useUser();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                if (typeof id === 'string') {
                    const response = await api.getWorkshop(id);
                    setWorkshop(response.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshop();
    }, [id]);

    // Check if user is already registered
    useEffect(() => {
        const checkRegistration = async () => {
            if (!selectedUser || !id || typeof id !== 'string' || role !== 'user') {
                return;
            }

            try {
                const response = await api.checkRegistration(id, selectedUser.email);
                setIsRegistered(response.data.isRegistered);
            } catch (error) {
                console.error('Error checking registration:', error);
            }
        };

        if (!loading) {
            checkRegistration();
        }
    }, [loading, selectedUser, id, role]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50 items-center justify-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </SafeAreaView>
        );
    }

    if (!workshop) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50">
                <Header title="Workshop" showBack />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-dark-400 text-lg">Workshop não encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    const availableSpots = workshop.capacity - workshop.enrolled;
    const isFull = availableSpots <= 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header title="Detalhes" showBack />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    {/* Title Section */}
                    <View className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-5">
                        <Text className="text-white text-3xl font-bold mb-2">
                            {workshop.title}
                        </Text>
                        <Text className="text-primary-100 text-base">
                            Organizado por {workshop.organizerName}
                        </Text>
                    </View>

                    {/* Date and Time Card */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <Text className="text-dark-500 text-sm font-medium mb-2">
                            📅 DATA E HORA
                        </Text>
                        <Text className="text-dark-900 text-lg font-bold capitalize">
                            {formatDate(workshop.dateTime)}
                        </Text>
                        <Text className="text-primary-600 text-xl font-bold mt-1">
                            {formatTime(workshop.dateTime)}
                        </Text>
                    </View>

                    {/* Description Card */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <Text className="text-dark-500 text-sm font-medium mb-3">
                            📝 DESCRIÇÃO
                        </Text>
                        <Text className="text-dark-700 text-base leading-6">
                            {workshop.description}
                        </Text>
                    </View>

                    {/* Capacity Card */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <Text className="text-dark-500 text-sm font-medium mb-3">
                            👥 CAPACIDADE
                        </Text>

                        <View className="flex-row justify-between mb-3">
                            <View>
                                <Text className="text-dark-400 text-sm">Inscritos</Text>
                                <Text className="text-dark-900 text-2xl font-bold">
                                    {workshop.enrolled}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-dark-400 text-sm">Capacidade</Text>
                                <Text className="text-dark-900 text-2xl font-bold">
                                    {workshop.capacity}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-dark-400 text-sm">Em espera</Text>
                                <Text className="text-dark-900 text-2xl font-bold">
                                    {workshop.waitlist}
                                </Text>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View className="bg-dark-100 rounded-full h-3 overflow-hidden">
                            <View
                                className={`h-full ${isFull ? 'bg-error' : 'bg-success'}`}
                                style={{ width: `${(workshop.enrolled / workshop.capacity) * 100}%` }}
                            />
                        </View>

                        {isFull ? (
                            <Text className="text-error text-center mt-3 font-medium">
                                ⚠️ Workshop lotado - Será adicionado à lista de espera
                            </Text>
                        ) : (
                            <Text className="text-success text-center mt-3 font-medium">
                                ✓ {availableSpots} vagas disponíveis
                            </Text>
                        )}
                    </View>

                    {/* Organizer Info - Only visible for organizers */}
                    {role === 'organizer' && (
                        <View className="bg-primary-50 border border-primary-200 rounded-2xl p-5 mb-4">
                            <Text className="text-primary-900 font-bold text-base mb-2">
                                👨‍💼 Modo Organizador
                            </Text>
                            <Text className="text-primary-700 text-sm">
                                Como organizador, pode gerir este workshop através do Dashboard.
                                Utilizadores normais podem inscrever-se neste evento.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Action Button - Only for Users */}
            {role === 'user' && (
                <View className="p-5 bg-white border-t border-dark-100" style={{ paddingBottom: 25 }}>
                    <Button
                        title={isRegistered ? 'Ver Inscrição' : isFull ? 'Entrar na Lista de Espera' : 'Inscrever-me'}
                        onPress={() => router.push(`/registration/${workshop.id}`)}
                        variant="primary"
                    />
                </View>
            )}
        </SafeAreaView>
    );
}
