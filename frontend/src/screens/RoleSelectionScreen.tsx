import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../utils/UserContext';

export default function RoleSelectionScreen() {
    const router = useRouter();
    const { setRole } = useUser();

    const handleRoleSelection = (role: 'organizer' | 'user') => {
        if (role === 'organizer') {
            setRole(role);
            router.push('/home');
        } else {
            // For users, navigate to user selection screen
            router.push('/user/select');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-500 to-primary-700">
            <View className="flex-1 justify-center items-center px-8">
                {/* Title */}
                <View className="mb-12">
                    <Text className="text-black text-4xl font-bold text-center mb-3">
                        Workshop Manager
                    </Text>
                    <Text className="text-dark-900 text-lg text-center">
                        Escolha o tipo de utilizador
                    </Text>
                </View>

                {/* Role Cards */}
                <View className="w-full gap-5">
                    {/* Organizer Card */}
                    <TouchableOpacity
                        onPress={() => handleRoleSelection('organizer')}
                        className="bg-white rounded-3xl p-8 shadow-2xl active:scale-95"
                        activeOpacity={0.9}
                    >
                        <View className="items-center">
                            <Text className="text-6xl mb-4">👨‍💼</Text>
                            <Text className="text-dark-900 text-2xl font-bold mb-2">
                                Organizador
                            </Text>
                            <Text className="text-dark-500 text-center text-base">
                                Criar e gerir workshops, ver inscritos e listas de espera
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* User Card */}
                    <TouchableOpacity
                        onPress={() => handleRoleSelection('user')}
                        className="bg-white rounded-3xl p-8 shadow-2xl active:scale-95"
                        activeOpacity={0.9}
                    >
                        <View className="items-center">
                            <Text className="text-6xl mb-4">👤</Text>
                            <Text className="text-dark-900 text-2xl font-bold mb-2">
                                Utilizador
                            </Text>
                            <Text className="text-dark-500 text-center text-base">
                                Explorar workshops disponíveis e fazer inscrições
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="mt-12">
                    <Text className="text-black text-sm text-center">
                        Modo de demonstração - sem autenticação
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
