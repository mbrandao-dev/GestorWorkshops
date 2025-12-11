import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';
import { Workshop } from '../utils/mockData';
import { useUser } from '../utils/UserContext';

export default function RegistrationScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { selectedUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [fetchingWorkshop, setFetchingWorkshop] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationData, setRegistrationData] = useState<any>(null);
    const [checkingRegistration, setCheckingRegistration] = useState(true);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                if (typeof id === 'string') {
                    const response = await api.getWorkshop(id);
                    setWorkshop(response.data);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Erro', 'Não foi possível carregar os detalhes do workshop.');
                router.back();
            } finally {
                setFetchingWorkshop(false);
            }
        };

        fetchWorkshop();
    }, [id]);

    // Check if user is already registered
    useEffect(() => {
        const checkRegistration = async () => {
            if (!selectedUser || !id || typeof id !== 'string') {
                setCheckingRegistration(false);
                return;
            }

            try {
                const response = await api.checkRegistration(id, selectedUser.email);
                setIsRegistered(response.data.isRegistered);
                setRegistrationData(response.data.registration);
            } catch (error) {
                console.error('Error checking registration:', error);
            } finally {
                setCheckingRegistration(false);
            }
        };

        if (!fetchingWorkshop) {
            checkRegistration();
        }
    }, [fetchingWorkshop, selectedUser, id]);

    // Redirect if no user is selected (must be before any conditional returns)
    useEffect(() => {
        if (!fetchingWorkshop && !selectedUser) {
            Alert.alert('Erro', 'Nenhum utilizador selecionado. Por favor, selecione um utilizador primeiro.');
            router.back();
        }
    }, [fetchingWorkshop, selectedUser, router]);

    if (fetchingWorkshop || checkingRegistration) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50 items-center justify-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </SafeAreaView>
        );
    }

    if (!workshop) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50">
                <Header title="Inscrição" showBack />
                <View className="flex-1 items-center justify-center">
                    <Text className="text-dark-400 text-lg">Workshop não encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!selectedUser) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50 items-center justify-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </SafeAreaView>
        );
    }

    const availableSpots = workshop.capacity - workshop.enrolled;
    const isFull = availableSpots <= 0;

    const handleRegister = async () => {
        if (!selectedUser) return;

        setLoading(true);

        try {
            if (typeof id === 'string') {
                await api.register({
                    workshopId: id,
                    name: selectedUser.name,
                    email: selectedUser.email
                });

                Alert.alert(
                    'Sucesso!',
                    isFull
                        ? `${selectedUser.name}, foi adicionado à lista de espera para "${workshop.title}".`
                        : `${selectedUser.name}, a sua inscrição para "${workshop.title}" foi confirmada!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.message || 'Ocorreu um erro ao realizar a inscrição. Tente novamente.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!selectedUser) return;

        Alert.alert(
            'Cancelar Inscrição',
            `Tem a certeza que deseja cancelar a sua inscrição em "${workshop.title}"?`,
            [
                {
                    text: 'Não',
                    style: 'cancel',
                },
                {
                    text: 'Sim, Cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            if (typeof id === 'string') {
                                await api.cancelRegistration(id, selectedUser.email);
                                Alert.alert(
                                    'Inscrição Cancelada',
                                    `A sua inscrição em "${workshop.title}" foi cancelada com sucesso.`,
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => router.back(),
                                        },
                                    ]
                                );
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Ocorreu um erro ao cancelar a inscrição. Tente novamente.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header title="Inscrição" showBack />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    {/* Workshop Info */}
                    <View className="bg-primary-600 rounded-2xl p-5 mb-6">
                        <Text className="text-white text-xl font-bold mb-1">
                            {workshop.title}
                        </Text>
                        <Text className="text-primary-100 text-sm">
                            {isRegistered
                                ? registrationData?.status === 'enrolled'
                                    ? '✓ Inscrito'
                                    : '⏳ Na lista de espera'
                                : isFull
                                    ? '⚠️ Lotado - Entrará na lista de espera'
                                    : `✓ ${availableSpots} vagas disponíveis`}
                        </Text>
                    </View>

                    {/* User Info */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm">
                        <Text className="text-dark-900 text-lg font-bold mb-4">
                            {isRegistered ? 'Detalhes da Inscrição' : 'Dados de Inscrição'}
                        </Text>

                        <View className="bg-primary-50 rounded-xl p-4 mb-4">
                            <View className="flex-row items-center mb-3">
                                <View className="bg-primary-200 rounded-full w-12 h-12 items-center justify-center mr-3">
                                    <Text className="text-primary-700 text-xl font-bold">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-dark-900 text-base font-bold">
                                        {selectedUser.name}
                                    </Text>
                                    <Text className="text-dark-600 text-sm">
                                        {selectedUser.email}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {isRegistered ? (
                            <>
                                <View className="bg-success-50 rounded-xl p-4 mb-4">
                                    <Text className="text-success-700 text-sm leading-5">
                                        ✓ Está inscrito neste workshop.
                                        {registrationData?.status === 'waitlist' &&
                                            ' Está na lista de espera e será notificado caso uma vaga fique disponível.'}
                                    </Text>
                                </View>

                                <Button
                                    title="Cancelar Inscrição"
                                    onPress={handleCancelRegistration}
                                    loading={loading}
                                    variant="primary"
                                />
                            </>
                        ) : (
                            <>
                                <View className="bg-dark-50 rounded-xl p-4 mb-4">
                                    <Text className="text-dark-600 text-sm leading-5">
                                        ℹ️ Receberá um email de confirmação após a inscrição.
                                        {isFull &&
                                            ' Como o workshop está lotado, será notificado caso uma vaga fique disponível.'}
                                    </Text>
                                </View>

                                <Button
                                    title={isFull ? 'Entrar na Lista de Espera' : 'Confirmar Inscrição'}
                                    onPress={handleRegister}
                                    loading={loading}
                                    variant="primary"
                                />
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
