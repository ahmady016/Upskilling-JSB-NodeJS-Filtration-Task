
export class Team {
    id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
}
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}
export class TeamMember {
    id: string
    name: string
    email: string
    birthDate: string
    gender: Gender
    teamId: string
    createdAt: string
    updatedAt: string
}

export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}
export class Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    assignedTo: string
    dueDate: string
    startDate: string
    endDate: string
    createdAt: string
    updatedAt: string
}
