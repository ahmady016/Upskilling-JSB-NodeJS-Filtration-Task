import fs from 'fs'
import chance from 'chance'

import { Team, TeamMember, Task, Gender, TaskStatus } from './../types'

const ch = new chance.Chance()

type FakeDB = {
	teams: Team[]
	teamMembers: TeamMember[]
	tasks: Task[]
}
const db: FakeDB = {
	teams: [],
	teamMembers: [],
	tasks: [],
}

const currentYear = new Date().getFullYear()
const yearsChoicesForCreatedAtDate = Array(8).fill(0).map(() => ch.integer({ min: (currentYear - 7), max: currentYear }))
const yearsChoicesForBirthDate = Array(40).fill(0).map(() => ch.integer({ min: (currentYear - 59), max: currentYear - 20 }))
const yearsChoicesForStartDate = Array(5).fill(0).map(() => ch.integer({ min: (currentYear - 4), max: currentYear }))
function generateCreatedAtAndUpdatedAt() {
	// generate createdAt date
    const createdAt = new Date(ch.date({ year: ch.pickone(yearsChoicesForCreatedAtDate) }))

    // generate updatedAt date
    const updatedAtDate = new Date(createdAt)
    updatedAtDate.setDate(createdAt.getDate() + ch.integer({ min: 1, max: 30 }))

    // decide if updatedAt should be empty
	const emptyUpdatedAt = ch.bool({ likelihood: 35 })
    // set updatedAt
	const updatedAt = !emptyUpdatedAt ? updatedAtDate.toISOString() : ''

    // finally return both date values
	return { createdAt: createdAt.toISOString(), updatedAt }
}
function generateBirthDate() {
    return new Date(ch.date({ year: ch.pickone(yearsChoicesForBirthDate) })).toISOString()
}
function generateStartDateAndEndDateAndDueDate() {
    // generate startDate and dueDate
    const startDate = new Date(ch.date({ year: ch.pickone(yearsChoicesForStartDate) }))
    const dueDate = new Date(startDate)
    // change dueDate by add 3 to 30 days
    dueDate.setDate(startDate.getDate() + ch.integer({ min: 3, max: 30 }))

    // set endDate equal to dueDate and decide if it should be changed or not
    const endDate = new Date(dueDate)
    const shouldEndDateChange = ch.bool({ likelihood: 30 })
    if (shouldEndDateChange) {
        dueDate.setDate(endDate.getDate() + ch.integer({ min: -2, max: 7 }))
    }

    // finally return all three date values
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString(), dueDate: dueDate.toISOString() }
}

const TEAMS_LENGTH = 5
const TEAM_MEMBERS_LENGTH = 25
const TASKS_LENGTH = 100
function generateFakeData() {
	// generate and fill teams
	for (let i = 0; i < TEAMS_LENGTH; i++) {
        const createdAtAndUpdatedAtValues = generateCreatedAtAndUpdatedAt()
		db.teams.push({
			id: ch.guid(),
			name: ch.name(),
			description: ch.sentence(),
			createdAt: createdAtAndUpdatedAtValues.createdAt,
			updatedAt: createdAtAndUpdatedAtValues.updatedAt,
		})
	}

	// generate and fill team members
	const GENDER = ['MALE', 'FEMALE']
	const teamsIds = db.teams.map((team) => team.id)
	for (let i = 0; i < TEAM_MEMBERS_LENGTH; i++) {
        const createdAtAndUpdatedAtValues = generateCreatedAtAndUpdatedAt()
		db.teamMembers.push({
			id: ch.guid(),
			name: ch.name(),
			email: ch.email(),
			birthDate: generateBirthDate(),
			gender: ch.pickone(GENDER) as Gender,
			teamId: ch.pickone(teamsIds),
			createdAt: createdAtAndUpdatedAtValues.createdAt,
			updatedAt: createdAtAndUpdatedAtValues.updatedAt,
		})
	}

	// generate and fill tasks
	const TASK_STATUS = ['OPEN', 'IN_PROGRESS', 'DONE']
	const teamMembersIds = db.teamMembers.map((teamMember) => teamMember.id)
	for (let i = 0; i < TASKS_LENGTH; i++) {
        const createdAtAndUpdatedAtValues = generateCreatedAtAndUpdatedAt()
        const startDateAndEndDateAndDueDateValues = generateStartDateAndEndDateAndDueDate()
		db.tasks.push({
			id: ch.guid(),
			title: ch.sentence(),
			description: ch.paragraph(),
			status: ch.pickone(TASK_STATUS) as TaskStatus,
			assignedTo: ch.pickone(teamMembersIds),
			startDate: startDateAndEndDateAndDueDateValues.startDate,
			dueDate: startDateAndEndDateAndDueDateValues.dueDate,
			endDate: startDateAndEndDateAndDueDateValues.endDate,
			createdAt: createdAtAndUpdatedAtValues.createdAt,
			updatedAt: createdAtAndUpdatedAtValues.updatedAt,
		})
	}

	return db
}

export function seedFakeDb() {
	if(process.env.SEED_DB === 'true' || !fs.existsSync('./src/db/fakeDB/db.json')) {
		console.log('Seeding Fake DB ...')
		fs.writeFileSync('./src/db/fakeDB/db.json', JSON.stringify(generateFakeData(), null, 2), { encoding:'utf8' })
	}
}
export function writeFakeDb(db: unknown) {
	fs.writeFileSync('./src/db/fakeDB/db.json', JSON.stringify(db, null, 2), { encoding:'utf8', flag:'w' })
}
