import chance from 'chance'

import { Team, TeamMember, Task, Gender, TaskStatus } from './../types'

const ch = new chance.Chance()

type FakeDB = {
    teams: Team[],
    teamMembers: TeamMember[],
    tasks: Task[]
}
export default function generateFakeData() {
    // empty fake data object to be filled
    const db: FakeDB = {
		teams: [],
		teamMembers: [],
		tasks: []
	}

    // generate and fill 10 teams
    for (let i = 0; i < 10; i++) {
        db.teams.push({
            id: ch.guid(),
            name: ch.name(),
            description: ch.sentence(),
            createdAt: ch.date().toISOString(),
            updatedAt: ch.date().toISOString()
        })
    }

    // generate and fill 100 team members
    const GENDER = ['MALE', 'FEMALE']
    const teamsIds = db.teams.map(team => team.id)
    for (let i = 0; i < 100; i++) {
        db.teamMembers.push({
            id: ch.guid(),
            name: ch.name(),
            email: ch.email(),
            birthDate: ch.date().toISOString(),
            gender: ch.pickone(GENDER) as Gender,
            teamId: ch.pickone(teamsIds),
            createdAt: ch.date().toISOString(),
            updatedAt: ch.date().toISOString()
        })
    }

    // generate and fill 5000 tasks
    const TASK_STATUS = ['OPEN', 'IN_PROGRESS', 'DONE']
    const teamMembersIds = db.teamMembers.map(teamMember => teamMember.id)
    for (let i = 0; i < 5000; i++) {
        db.tasks.push({
            id: ch.guid(),
            title: ch.sentence(),
            description: ch.paragraph(),
            status: ch.pickone(TASK_STATUS) as TaskStatus,
            assignedTo: ch.pickone(teamMembersIds),
            dueDate: ch.date().toISOString(),
            startDate: ch.date().toISOString(),
            endDate: ch.date().toISOString(),
            createdAt: ch.date().toISOString(),
            updatedAt: ch.date().toISOString()
        })
    }

    return db
}
