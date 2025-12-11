import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';
import { Workshop, Registration } from '../utils/mockData';

export default function OrganizerWorkshopDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (typeof id === 'string') {
                    const [workshopRes, registrationsRes] = await Promise.all([
                        api.getWorkshop(id),
                        api.getRegistrations(id)
                    ]);
                    setWorkshop(workshopRes.data);
                    setRegistrations(registrationsRes.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50 items-center justify-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </SafeAreaView>
        );
    }

    if (!workshop) {
        return (
            <SafeAreaView className="flex-1 bg-dark-50 items-center justify-center">
                <Text className="text-dark-400">Workshop não encontrado</Text>
            </SafeAreaView>
        );
    }

    const enrolledList = registrations.filter(r => r.status === 'enrolled');
    const waitlistList = registrations.filter(r => r.status === 'waitlist');

    const availableSpots = workshop.capacity - workshop.enrolled;

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Remoção',
            `Tem certeza que deseja remover o workshop "${workshop.title}"? Esta ação não pode ser desfeita e todas as inscrições serão removidas.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (typeof id === 'string') {
                                await api.deleteWorkshop(id);
                                Alert.alert('Sucesso', 'Workshop removido com sucesso!', [
                                    { text: 'OK', onPress: () => router.back() }
                                ]);
                            }
                        } catch (error) {
                            console.error(error);
                            Alert.alert('Erro', 'Não foi possível remover o workshop.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header
                title="Gestão do Workshop"
                showBack
            // rightAction={
            //     <TouchableOpacity
            //         onPress={() => router.push(`/organizer/workshop/${id}/edit` as any)}
            //         className="bg-white/20 px-3 py-1 rounded-lg mr-2"
            //         activeOpacity={0.7}
            //     >
            //         <Text className="text-white text-xs font-medium">
            //             Editar
            //         </Text>
            //     </TouchableOpacity>
            // }
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-5">
                    {/* Header Info */}
                    <View className="mb-6">
                        <Text className="text-dark-900 text-2xl font-bold mb-1">
                            {workshop.title}
                        </Text>
                        <Text className="text-dark-500">
                            {new Date(workshop.dateTime).toLocaleDateString('pt-PT', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>

                    {/* Statistics Cards */}
                    <View className="flex-row mb-6 gap-3">
                        <View className="flex-1 bg-primary-600 rounded-2xl p-4">
                            <Text className="text-primary-100 text-xs font-medium mb-1">
                                INSCRITOS
                            </Text>
                            <Text className="text-white text-3xl font-bold">
                                {workshop.enrolled}
                            </Text>
                            <Text className="text-primary-200 text-xs mt-1">
                                de {workshop.capacity}
                            </Text>
                        </View>

                        <View className="flex-1 bg-success rounded-2xl p-4">
                            <Text className="text-white/80 text-xs font-medium mb-1">
                                VAGAS
                            </Text>
                            <Text className="text-white text-3xl font-bold">
                                {availableSpots}
                            </Text>
                            <Text className="text-white/80 text-xs mt-1">disponíveis</Text>
                        </View>

                        <View className="flex-1 bg-warning rounded-2xl p-4">
                            <Text className="text-white/80 text-xs font-medium mb-1">
                                EM ESPERA
                            </Text>
                            <Text className="text-white text-3xl font-bold">
                                {workshop.waitlist}
                            </Text>
                            <Text className="text-white/80 text-xs mt-1">pessoas</Text>
                        </View>
                    </View>

                    {/* Enrolled List */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <Text className="text-dark-900 text-lg font-bold mb-4">
                            ✅ Inscritos ({enrolledList.length})
                        </Text>
                        {enrolledList.length > 0 ? (
                            enrolledList.map((registration, index) => (
                                <View
                                    key={registration.id}
                                    className={`py-3 ${index < enrolledList.length - 1 ? 'border-b border-dark-100' : ''
                                        }`}
                                >
                                    <Text className="text-dark-900 font-medium text-base">
                                        {registration.name}
                                    </Text>
                                    <Text className="text-dark-500 text-sm mt-1">
                                        {registration.email}
                                    </Text>
                                    <Text className="text-dark-400 text-xs mt-1">
                                        Inscrito em:{' '}
                                        {new Date(registration.registeredAt).toLocaleDateString('pt-PT')}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text className="text-dark-400 text-center py-4">
                                Nenhum inscrito ainda
                            </Text>
                        )}
                    </View>

                    {/* Waitlist */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <Text className="text-dark-900 text-lg font-bold mb-4">
                            ⏳ Lista de Espera ({waitlistList.length})
                        </Text>
                        {waitlistList.length > 0 ? (
                            waitlistList.map((registration, index) => (
                                <View
                                    key={registration.id}
                                    className={`py-3 ${index < waitlistList.length - 1 ? 'border-b border-dark-100' : ''
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text className="text-dark-900 font-medium text-base">
                                                {index + 1}. {registration.name}
                                            </Text>
                                            <Text className="text-dark-500 text-sm mt-1">
                                                {registration.email}
                                            </Text>
                                            <Text className="text-dark-400 text-xs mt-1">
                                                Adicionado em:{' '}
                                                {new Date(registration.registeredAt).toLocaleDateString('pt-PT')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text className="text-dark-400 text-center py-4">
                                Lista de espera vazia
                            </Text>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Button
                                    title="Editar Workshop"
                                    onPress={() => router.push(`/organizer/workshop/${id}/edit` as any)}
                                    variant="outline"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleDelete}
                                className="flex-1 bg-error rounded-xl py-4 items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-base">Remover</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
