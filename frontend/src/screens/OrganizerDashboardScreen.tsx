import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Button from '../components/Button';
import { Workshop } from '../utils/mockData';

export default function OrganizerDashboardScreen() {
    const router = useRouter();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const response = await api.getWorkshops();
            setWorkshops(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWorkshops();
        }, [])
    );

    const totalWorkshops = workshops.length;
    const activeWorkshops = workshops.filter(w => new Date(w.dateTime) > new Date());
    const pastWorkshops = workshops.filter(w => new Date(w.dateTime) <= new Date());

    const totalEnrolled = workshops.reduce((acc, curr) => acc + curr.enrolled, 0);
    const activeEnrolled = activeWorkshops.reduce((acc, curr) => acc + curr.enrolled, 0);
    const pastEnrolled = pastWorkshops.reduce((acc, curr) => acc + curr.enrolled, 0);

    const nextWorkshop = activeWorkshops.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header title="Dashboard Organizador" showBack />

            <View className="flex-1 px-5 pt-5">
                {/* Global Stats Card */}
                <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-primary-100">
                    <Text className="text-dark-900 text-lg font-bold mb-4">Resumo Global</Text>

                    {/* Workshops Row */}
                    <View className="flex-row justify-between mb-4">
                        <View className="items-center flex-1">
                            <Text className="text-dark-500 text-[10px] font-bold mb-1">WORKSHOPS</Text>
                            <Text className="text-dark-900 text-xl font-bold">{totalWorkshops}</Text>
                            <Text className="text-dark-400 text-[10px]">Total</Text>
                        </View>
                        <View className="w-[1px] bg-dark-100" />
                        <View className="items-center flex-1">
                            <Text className="text-success text-[10px] font-bold mb-1">ATIVOS</Text>
                            <Text className="text-dark-900 text-xl font-bold">{activeWorkshops.length}</Text>
                            <Text className="text-dark-400 text-[10px]">{activeEnrolled} inscritos</Text>
                        </View>
                        <View className="w-[1px] bg-dark-100" />
                        <View className="items-center flex-1">
                            <Text className="text-dark-400 text-[10px] font-bold mb-1">TERMINADOS</Text>
                            <Text className="text-dark-900 text-xl font-bold">{pastWorkshops.length}</Text>
                            <Text className="text-dark-400 text-[10px]">{pastEnrolled} inscritos</Text>
                        </View>
                    </View>

                    <View className="h-[1px] bg-dark-100 mb-4" />

                    {/* Next Event & Total Stats */}
                    <View className="flex-row justify-between items-center">
                        <View>
                            <Text className="text-dark-500 text-xs font-bold mb-1">PRÓXIMO EVENTO</Text>
                            <Text className="text-primary-600 text-lg font-bold">
                                {nextWorkshop ? new Date(nextWorkshop.dateTime).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' }) : '-'}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-dark-500 text-xs font-bold mb-1">TOTAL INSCRITOS</Text>
                            <Text className="text-primary-600 text-2xl font-bold">{totalEnrolled}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row gap-3 mb-4">
                    <TouchableOpacity
                        onPress={() => router.push('/user/select')}
                        className="flex-1 bg-primary-100 rounded-xl p-4 items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-primary-700 text-2xl mb-2">👥</Text>
                        <Text className="text-primary-700 font-bold text-sm">
                            Gerir Utilizadores
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.push('/organizer/create')}
                        className="flex-1 bg-primary-100 rounded-xl p-4 items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-primary-700 text-2xl mb-2">➕</Text>
                        <Text className="text-primary-700 font-bold text-sm">
                            Novo Workshop
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-dark-900 text-lg font-bold">
                        Todos os Workshops
                    </Text>
                </View>

                <FlatList
                    data={workshops.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const isPast = new Date(item.dateTime) <= new Date();
                        return (
                            <TouchableOpacity
                                onPress={() => router.push(`/organizer/workshop/${item.id}` as any)}
                                className={`rounded-2xl p-4 mb-3 shadow-sm border flex-row justify-between items-center ${isPast
                                    ? 'bg-dark-50 border-dark-200 opacity-80'
                                    : 'bg-white border-dark-100'
                                    }`}
                                activeOpacity={0.7}
                            >
                                <View className="flex-1 mr-4">
                                    <Text className={`font-bold text-base mb-1 ${isPast ? 'text-dark-500' : 'text-dark-900'
                                        }`} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <Text className="text-dark-500 text-sm">
                                        {new Date(item.dateTime).toLocaleDateString('pt-PT')} • {new Date(item.dateTime).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    {isPast && (
                                        <Text className="text-dark-400 text-xs mt-1 font-medium bg-dark-100 self-start px-2 py-0.5 rounded">
                                            Terminado
                                        </Text>
                                    )}
                                </View>

                                <View className="items-end">
                                    <View className={`px-2 py-1 rounded-md mb-1 ${isPast
                                        ? 'bg-dark-200'
                                        : item.enrolled >= item.capacity ? 'bg-error/10' : 'bg-success/10'
                                        }`}>
                                        <Text className={`text-xs font-bold ${isPast
                                            ? 'text-dark-500'
                                            : item.enrolled >= item.capacity ? 'text-error' : 'text-success'
                                            }`}>
                                            {item.enrolled}/{item.capacity}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            {loading ? (
                                <ActivityIndicator size="large" color="#0ea5e9" />
                            ) : (
                                <Text className="text-dark-400 text-lg">
                                    Nenhum workshop criado
                                </Text>
                            )}
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}
