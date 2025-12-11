import { getApiBaseUrl } from '../config/api.config';

export const BASE_URL = getApiBaseUrl();

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            // If response is not JSON, try to get text
            try {
                const text = await response.text();
                errorMessage = text || errorMessage;
            } catch (textError) {
                // If all else fails, use status text
                errorMessage = response.statusText || errorMessage;
            }
        }
        throw new Error(errorMessage);
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        throw new Error('Invalid JSON response from server');
    }

    // Backend returns { message: "success", data: [...] }
    // Return the full response so callers can access .data
    return data;
};

export const api = {
    // Users
    getUsers: async () => {
        try {
            console.log(`Fetching users from: ${BASE_URL}/users`);
            const response = await fetch(`${BASE_URL}/users`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUser: async (id: string) => {
        try {
            console.log(`Fetching user ${id} from: ${BASE_URL}/users/${id}`);
            const response = await fetch(`${BASE_URL}/users/${id}`);
            return handleResponse(response);
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            throw error;
        }
    },

    createUser: async (data: { name: string; email: string }) => {
        try {
            console.log(`Creating user at: ${BASE_URL}/users`);
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error: any) {
            console.error('Error creating user:', error);
            // If it's already an Error with message, re-throw it
            if (error instanceof Error) {
                throw error;
            }
            // Otherwise, wrap it
            throw new Error(error?.message || 'Erro ao criar utilizador. Verifique a ligação ao servidor.');
        }
    },

    updateUser: async (id: string, data: { name: string; email: string }) => {
        try {
            console.log(`Updating user ${id} at: ${BASE_URL}/users/${id}`);
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error: any) {
            console.error(`Error updating user ${id}:`, error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(error?.message || 'Erro ao atualizar utilizador.');
        }
    },

    deleteUser: async (id: string) => {
        try {
            console.log(`Deleting user ${id} at: ${BASE_URL}/users/${id}`);
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'DELETE',
            });
            return handleResponse(response);
        } catch (error: any) {
            console.error(`Error deleting user ${id}:`, error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(error?.message || 'Erro ao remover utilizador.');
        }
    },

    // Workshops
    getWorkshops: async () => {
        try {
            console.log(`Fetching workshops from: ${BASE_URL}/workshops`);
            const response = await fetch(`${BASE_URL}/workshops`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching workshops:', error);
            throw error;
        }
    },

    getWorkshop: async (id: string) => {
        try {
            console.log(`Fetching workshop ${id} from: ${BASE_URL}/workshops/${id}`);
            const response = await fetch(`${BASE_URL}/workshops/${id}`);
            return handleResponse(response);
        } catch (error) {
            console.error(`Error fetching workshop ${id}:`, error);
            throw error;
        }
    },

    createWorkshop: async (data: any) => {
        try {
            console.log(`Creating workshop at: ${BASE_URL}/workshops`);
            const response = await fetch(`${BASE_URL}/workshops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error creating workshop:', error);
            throw error;
        }
    },

    updateWorkshop: async (id: string, data: any) => {
        try {
            console.log(`Updating workshop ${id} at: ${BASE_URL}/workshops/${id}`);
            const response = await fetch(`${BASE_URL}/workshops/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error updating workshop ${id}:`, error);
            throw error;
        }
    },

    deleteWorkshop: async (id: string) => {
        try {
            console.log(`Deleting workshop ${id} at: ${BASE_URL}/workshops/${id}`);
            const response = await fetch(`${BASE_URL}/workshops/${id}`, {
                method: 'DELETE',
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error deleting workshop ${id}:`, error);
            throw error;
        }
    },

    // Registrations
    getRegistrations: async (workshopId: string) => {
        try {
            console.log(`Fetching registrations for workshop ${workshopId}`);
            const response = await fetch(`${BASE_URL}/registrations/${workshopId}`);
            return handleResponse(response);
        } catch (error) {
            console.error(`Error fetching registrations for workshop ${workshopId}:`, error);
            throw error;
        }
    },

    register: async (data: { workshopId: string; name: string; email: string }) => {
        try {
            console.log(`Registering for workshop ${data.workshopId}`);
            const response = await fetch(`${BASE_URL}/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error registering for workshop:', error);
            throw error;
        }
    },

    checkRegistration: async (workshopId: string, email: string) => {
        try {
            console.log(`Checking registration for workshop ${workshopId} and email ${email}`);
            const response = await fetch(`${BASE_URL}/registrations/check/${workshopId}/${email}`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error checking registration:', error);
            throw error;
        }
    },

    cancelRegistration: async (workshopId: string, email: string) => {
        try {
            console.log(`Canceling registration for workshop ${workshopId} and email ${email}`);
            const response = await fetch(`${BASE_URL}/registrations/${workshopId}/${email}`, {
                method: 'DELETE',
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error canceling registration:', error);
            throw error;
        }
    },
};
