import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../services/api';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { useUser, User } from '../utils/UserContext';

export default function UserSelectionScreen() {
    const router = useRouter();
    const { role, setRole, setSelectedUser } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const isOrganizer = role === 'organizer';

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.getUsers();
            // Backend returns { message: "success", data: [...] }
            if (response && response.data) {
                setUsers(response.data);
            } else {
                console.warn('Unexpected response format:', response);
                setUsers([]);
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            const errorMessage = error?.message || 'Não foi possível carregar os utilizadores. Verifique se o servidor está em execução.';
            console.error('Error details:', errorMessage);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );

    const handleUserSelection = (user: User) => {
        setSelectedUser(user);
        setRole('user');
        router.push('/home');
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleCreateUser = async () => {
        // Reset errors
        setNameError('');
        setEmailError('');

        // Validation
        let hasError = false;

        if (!name.trim()) {
            setNameError('Por favor, insira o nome');
            hasError = true;
        }

        if (!email.trim()) {
            setEmailError('Por favor, insira o email');
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError('Por favor, insira um email válido');
            hasError = true;
        }

        if (hasError) return;

        setCreating(true);

        try {
            const response = await api.createUser({ name: name.trim(), email: email.trim() });
            
            if (response && response.data) {
                // Add new user to list
                setUsers([...users, response.data].sort((a, b) => a.name.localeCompare(b.name)));
                
                // Close modal and reset form
                setShowModal(false);
                setName('');
                setEmail('');
                
                Alert.alert('Sucesso', 'Utilizador criado com sucesso!');
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error: any) {
            console.error('Error creating user:', error);
            const errorMessage = error?.message || 'Não foi possível criar o utilizador.';
            
            // Check if it's an email duplicate error
            if (errorMessage.toLowerCase().includes('email already exists') || 
                errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
                setEmailError('Este email já está em uso');
            } else if (errorMessage.toLowerCase().includes('invalid email')) {
                setEmailError('Formato de email inválido');
            } else if (errorMessage.toLowerCase().includes('required')) {
                if (errorMessage.toLowerCase().includes('name')) {
                    setNameError('Nome é obrigatório');
                } else {
                    setEmailError('Email é obrigatório');
                }
            } else if (errorMessage.toLowerCase().includes('network') || 
                       errorMessage.toLowerCase().includes('fetch') ||
                       errorMessage.toLowerCase().includes('connection')) {
                Alert.alert('Erro de Ligação', 'Não foi possível conectar ao servidor. Verifique se o servidor está em execução.');
            } else {
                Alert.alert('Erro', errorMessage);
            }
        } finally {
            setCreating(false);
        }
    };

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setName(user.name);
            setEmail(user.email);
        } else {
            setEditingUser(null);
            setName('');
            setEmail('');
        }
        setNameError('');
        setEmailError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setName('');
        setEmail('');
        setNameError('');
        setEmailError('');
    };

    const handleEditUser = async () => {
        if (!editingUser) return;

        // Reset errors
        setNameError('');
        setEmailError('');

        // Validation
        let hasError = false;

        if (!name.trim()) {
            setNameError('Por favor, insira o nome');
            hasError = true;
        }

        if (!email.trim()) {
            setEmailError('Por favor, insira o email');
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError('Por favor, insira um email válido');
            hasError = true;
        }

        if (hasError) return;

        setSaving(true);

        try {
            const response = await api.updateUser(editingUser.id, { 
                name: name.trim(), 
                email: email.trim() 
            });
            
            if (response && response.data) {
                // Update user in list
                setUsers(users.map(u => u.id === editingUser.id ? response.data : u).sort((a, b) => a.name.localeCompare(b.name)));
                
                // Close modal and reset form
                handleCloseModal();
                
                Alert.alert('Sucesso', 'Utilizador atualizado com sucesso!');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            const errorMessage = error?.message || 'Não foi possível atualizar o utilizador.';
            
            if (errorMessage.toLowerCase().includes('email already exists') || 
                errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
                setEmailError('Este email já está em uso');
            } else if (errorMessage.toLowerCase().includes('invalid email')) {
                setEmailError('Formato de email inválido');
            } else {
                Alert.alert('Erro', errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = (user: User) => {
        Alert.alert(
            'Confirmar Remoção',
            `Tem certeza que deseja remover o utilizador "${user.name}"? Esta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.deleteUser(user.id);
                            setUsers(users.filter(u => u.id !== user.id));
                            Alert.alert('Sucesso', 'Utilizador removido com sucesso!');
                        } catch (error: any) {
                            console.error('Error deleting user:', error);
                            Alert.alert('Erro', error?.message || 'Não foi possível remover o utilizador.');
                        }
                    }
                }
            ]
        );
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
            <TouchableOpacity
                onPress={() => !isOrganizer && handleUserSelection(item)}
                activeOpacity={0.8}
                disabled={isOrganizer}
            >
                <View className="flex-row items-center">
                    <View className="bg-primary-100 rounded-full w-12 h-12 items-center justify-center mr-4">
                        <Text className="text-primary-600 text-xl font-bold">
                            {item.name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-dark-900 text-lg font-bold mb-1">
                            {item.name}
                        </Text>
                        <Text className="text-dark-500 text-sm">
                            {item.email}
                        </Text>
                    </View>
                    {!isOrganizer && (
                        <View className="ml-2">
                            <Text className="text-primary-600 text-2xl">→</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
            {isOrganizer && (
                <View className="flex-row gap-2 mt-3 pt-3 border-t border-dark-100">
                    <View className="flex-1">
                        <Button
                            title="Editar"
                            onPress={() => handleOpenModal(item)}
                            variant="outline"
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => handleDeleteUser(item)}
                        className="flex-1 bg-error rounded-xl py-3 items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-sm">Remover</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-dark-50">
            <Header 
                title={isOrganizer ? "Gerir Utilizadores" : "Selecionar Utilizador"} 
                showBack 
                rightAction={
                    <TouchableOpacity
                        onPress={() => handleOpenModal()}
                        className="bg-white/20 px-3 py-1 rounded-lg"
                        activeOpacity={0.7}
                    >
                        <Text className="text-white text-sm font-medium">
                            {isOrganizer ? "Novo" : "Registar"}
                        </Text>
                    </TouchableOpacity>
                }
            />

            <View className="flex-1 px-5 pt-5">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#0ea5e9" />
                        <Text className="text-dark-400 mt-4">A carregar utilizadores...</Text>
                    </View>
                ) : (
                    <>
                        {!isOrganizer && (
                            <View className="mb-4">
                                <Text className="text-dark-700 text-base">
                                    Escolha um utilizador para continuar:
                                </Text>
                            </View>
                        )}
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id}
                            renderItem={renderUserItem}
                            ListEmptyComponent={
                                <View className="items-center justify-center py-20">
                                    <Text className="text-dark-400 text-lg">
                                        Nenhum utilizador disponível
                                    </Text>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </>
                )}
            </View>

            {/* Create User Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-dark-900 text-2xl font-bold">
                                {editingUser ? 'Editar Utilizador' : 'Criar Novo Utilizador'}
                            </Text>
                            <TouchableOpacity
                                onPress={handleCloseModal}
                                className="bg-dark-100 rounded-full w-8 h-8 items-center justify-center"
                            >
                                <Text className="text-dark-600 text-lg">×</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Input
                                label="Nome Completo"
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    setNameError('');
                                }}
                                placeholder="Ex: João Silva"
                                error={nameError}
                            />

                            <Input
                                label="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setEmailError('');
                                }}
                                placeholder="joao.silva@example.com"
                                keyboardType="email-address"
                                error={emailError}
                            />

                            <View className="flex-row gap-3 mt-2">
                                <View className="flex-1">
                                    <Button
                                        title="Cancelar"
                                        onPress={handleCloseModal}
                                        variant="outline"
                                        disabled={creating || saving}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Button
                                        title={editingUser ? "Atualizar" : "Criar"}
                                        onPress={editingUser ? handleEditUser : handleCreateUser}
                                        variant="primary"
                                        loading={creating || saving}
                                        disabled={creating || saving}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

