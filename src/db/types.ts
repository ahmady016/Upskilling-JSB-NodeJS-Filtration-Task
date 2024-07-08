
export class Team {
    id: string = ''
    name: string = ''
    description: string = ''
    createdAt: string = ''
    updatedAt: string = ''
}
export type Gender = 'MALE' | 'FEMALE'
export type TeamMember = {
    id: string
    name: string
    email: string
    birthDate: string
    gender: Gender
    teamId: string
    createdAt: string
    updatedAt: string
}

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE'
export type Task = {
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
