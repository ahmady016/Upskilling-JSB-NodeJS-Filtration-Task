import chance from 'chance'
import { PrismaClient } from '@prisma/client'

type TeamInput = {
	name: string
	description: string
}
type TeamMemberInput = {
    name: string
    email: string
    birthDate: string
    gender: string
    teamId: string
}
type TaskInput = {
    title: string
    description: string
    status: string
    assignedTo: string
    dueDate: string
    startDate: string
    endDate: string
}
type FakeDB = {
    teams: TeamInput[],
    teamMembers: TeamMemberInput[],
    tasks: TaskInput[],
}
const db: FakeDB = {
    teams: [],
    teamMembers: [],
    tasks: [],
}

const ch = new chance.Chance()
const currentYear = new Date().getFullYear()
const yearsChoicesForBirthDate = Array(40).fill(0).map(() => ch.integer({ min: (currentYear - 59), max: currentYear - 20 }))
const yearsChoicesForStartDate = Array(5).fill(0).map(() => ch.integer({ min: (currentYear - 4), max: currentYear }))
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

const TEAMS_LENGTH = 50
const TEAM_MEMBERS_LENGTH = 500
const TASKS_LENGTH = 10000
const prisma = new PrismaClient()
async function main() {
    console.log(`Seed DB Started Successfully at ${new Date().toISOString()}`)

    // generate and fill teams
	for (let i = 0; i < TEAMS_LENGTH; i++) {
		db.teams.push({
			name: ch.name(),
			description: ch.sentence(),
		})
	}
    // save teams to db
    await prisma.team.createMany({ data: db.teams })

    // get all team ids
    const teamsIds = (await prisma.team.findMany({ select: { id: true } })).map((team) => team.id)
    // generate and fill team members
    for (let i = 0; i < TEAM_MEMBERS_LENGTH; i++) {
        db.teamMembers.push({
            name: ch.name(),
            email: ch.email(),
            birthDate: generateBirthDate(),
            gender: ch.pickone(['MALE', 'FEMALE']),
            teamId: ch.pickone(teamsIds),
        })
    }
    // save team members to db
    await prisma.teamMember.createMany({ data: db.teamMembers })

    // get all team member ids
    const teamMembersIds = (await prisma.teamMember.findMany({ select: { id: true } })).map((teamMember) => teamMember.id)
    // generate and fill tasks
    for (let i = 0; i < TASKS_LENGTH; i++) {
        db.tasks.push({
            title: ch.sentence(),
            description: ch.paragraph(),
            status: ch.pickone(['TODO', 'IN_PROGRESS', 'DONE']),
            assignedTo: ch.pickone(teamMembersIds),
            dueDate: generateStartDateAndEndDateAndDueDate().dueDate,
            startDate: generateStartDateAndEndDateAndDueDate().startDate,
            endDate: generateStartDateAndEndDateAndDueDate().endDate
        })
    }
    // save tasks to db
    await prisma.task.createMany({ data: db.tasks })

    console.log(`Seed DB Started Successfully at ${new Date().toISOString()}`)
}

main()
	.then(async () => await prisma.$disconnect())
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
