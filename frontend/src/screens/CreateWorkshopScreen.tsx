import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';

export default function CreateWorkshopScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description || !date || !time || !capacity) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);

        try {
            const dateTime = `${date}T${time}:00`;

            await api.createWorkshop({
                title,
                description,
                dateTime,
                capacity: parseInt(capacity),
                organizerId: 'org1', // Mock ID for now, should come from auth
                organizerName: 'Organizador Demo', // Mock Name for now
            });

            Alert.alert('Sucesso', 'Workshop criado com sucesso!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível criar o workshop.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header title="Criar Workshop" showBack />

            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                <View className="bg-white rounded-2xl p-5 shadow-sm mb-8">
                    <Input
                        label="Título do Workshop"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Introdução ao React Native"
                    />

                    <Input
                        label="Descrição"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Descreva o conteúdo do workshop..."
                        className="h-32"
                    />

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Input
                                label="Data (AAAA-MM-DD)"
                                value={date}
                                onChangeText={setDate}
                                placeholder="2025-12-25"
                            />
                        </View>
                        <View className="flex-1">
                            <Input
                                label="Hora (HH:MM)"
                                value={time}
                                onChangeText={setTime}
                                placeholder="14:00"
                            />
                        </View>
                    </View>

                    <Input
                        label="Capacidade Máxima"
                        value={capacity}
                        onChangeText={setCapacity}
                        placeholder="Ex: 30"
                        keyboardType="numeric"
                    />

                    <View className="mt-4">
                        <Button
                            title="Criar Workshop"
                            onPress={handleSubmit}
                            loading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
