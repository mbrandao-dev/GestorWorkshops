import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';
import WorkshopCard from '../components/WorkshopCard';
import Header from '../components/Header';
import Button from '../components/Button';
import { useUser } from '../utils/UserContext';
import { Workshop } from '../utils/mockData';

export default function HomeScreen() {
    const router = useRouter();
    const { role, setRole, selectedUser, setSelectedUser } = useUser();
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkshops = async () => {
        try {
            setLoading(true);
            const response = await api.getWorkshops();
            // Backend returns { message: "success", data: [...] }
            if (response && response.data) {
                setWorkshops(response.data);
            } else {
                console.warn('Unexpected response format:', response);
                setWorkshops([]);
            }
        } catch (error: any) {
            console.error('Error fetching workshops:', error);
            // Show user-friendly error message
            const errorMessage = error?.message || 'Não foi possível carregar os workshops. Verifique se o servidor está em execução.';
            console.error('Error details:', errorMessage);
            setWorkshops([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWorkshops();
        }, [])
    );

    const handleLogout = () => {
        setRole(null);
        setSelectedUser(null);
        router.replace('/');
    };

    const activeWorkshops = workshops.filter(w => new Date(w.dateTime) > new Date());

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header
                title={role === 'user' && selectedUser ? `Olá, ${selectedUser.name.split(' ')[0]}` : "Workshops Disponíveis"}
                rightAction={
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-white/20 px-3 py-1 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white text-xs font-medium">
                            Logout
                        </Text>
                    </TouchableOpacity>
                }
            />

            <View className="flex-1 px-5 pt-5">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#0ea5e9" />
                    </View>
                ) : (
                    <FlatList
                        data={activeWorkshops}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <WorkshopCard
                                workshop={item}
                                onPress={() => router.push(`/workshop/${item.id}`)}
                            />
                        )}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20">
                                <Text className="text-dark-400 text-lg">
                                    Nenhum workshop disponível
                                </Text>
                            </View>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}

                {/* Floating Action Button - Only for Organizers */}
                {role === 'organizer' && (
                    <View className="absolute bottom-5 right-5 left-5" style={{ paddingBottom: 20 }}>
                        <Button
                            title="Dashboard Organizador"
                            onPress={() => router.push('/organizer/dashboard')}
                            variant="primary"
                            className="shadow-xl"
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
