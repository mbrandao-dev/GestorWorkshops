export interface Workshop {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    capacity: number;
    enrolled: number;
    waitlist: number;
    organizerId: string;
    organizerName: string;
}

export interface Registration {
    id: string;
    workshopId: string;
    name: string;
    email: string;
    status: 'enrolled' | 'waitlist';
    registeredAt: string;
}

export const mockWorkshops: Workshop[] = [
    {
        id: '1',
        title: 'Introdução ao React Native',
        description: 'Aprenda os fundamentos do desenvolvimento mobile com React Native e Expo. Ideal para iniciantes.',
        dateTime: '2025-12-15T14:00:00',
        capacity: 30,
        enrolled: 25,
        waitlist: 3,
        organizerId: 'org1',
        organizerName: 'João Silva',
    },
    {
        id: '2',
        title: 'Node.js Avançado',
        description: 'Técnicas avançadas de desenvolvimento backend com Node.js, incluindo APIs REST e bases de dados.',
        dateTime: '2025-12-18T10:00:00',
        capacity: 20,
        enrolled: 20,
        waitlist: 5,
        organizerId: 'org1',
        organizerName: 'João Silva',
    },
    {
        id: '3',
        title: 'Design de UI/UX para Mobile',
        description: 'Princípios de design para aplicações mobile. Crie interfaces bonitas e funcionais.',
        dateTime: '2025-12-20T16:00:00',
        capacity: 25,
        enrolled: 15,
        waitlist: 0,
        organizerId: 'org2',
        organizerName: 'Maria Santos',
    },
    {
        id: '4',
        title: 'TypeScript na Prática',
        description: 'Domine TypeScript e melhore a qualidade do seu código JavaScript.',
        dateTime: '2025-12-22T14:00:00',
        capacity: 35,
        enrolled: 10,
        waitlist: 0,
        organizerId: 'org2',
        organizerName: 'Maria Santos',
    },
    {
        id: '5',
        title: 'Introdução ao Vue.js (Passado)',
        description: 'Workshop introdutório sobre o framework Vue.js.',
        dateTime: '2023-01-15T10:00:00',
        capacity: 20,
        enrolled: 20,
        waitlist: 0,
        organizerId: 'org1',
        organizerName: 'João Silva',
    },
    {
        id: '6',
        title: 'CSS Grid & Flexbox (Passado)',
        description: 'Domine layouts modernos com CSS.',
        dateTime: '2023-02-20T14:00:00',
        capacity: 25,
        enrolled: 25,
        waitlist: 5,
        organizerId: 'org2',
        organizerName: 'Maria Santos',
    },
];

export const mockRegistrations: Registration[] = [
    {
        id: 'r1',
        workshopId: '1',
        name: 'Pedro Costa',
        email: 'pedro@example.com',
        status: 'enrolled',
        registeredAt: '2025-12-01T10:00:00',
    },
    {
        id: 'r2',
        workshopId: '1',
        name: 'Ana Rodrigues',
        email: 'ana@example.com',
        status: 'enrolled',
        registeredAt: '2025-12-01T11:30:00',
    },
    {
        id: 'r3',
        workshopId: '1',
        name: 'Carlos Mendes',
        email: 'carlos@example.com',
        status: 'waitlist',
        registeredAt: '2025-12-02T09:00:00',
    },
];

export const addWorkshop = (workshop: Omit<Workshop, 'id' | 'enrolled' | 'waitlist'>) => {
    const newWorkshop: Workshop = {
        ...workshop,
        id: Math.random().toString(36).substr(2, 9),
        enrolled: 0,
        waitlist: 0,
    };
    mockWorkshops.push(newWorkshop);
    return newWorkshop;
};
