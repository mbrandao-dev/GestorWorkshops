import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'organizer' | 'user' | null;

export interface User {
    id: string;
    name: string;
    email: string;
}

interface UserContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ role, setRole, selectedUser, setSelectedUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
