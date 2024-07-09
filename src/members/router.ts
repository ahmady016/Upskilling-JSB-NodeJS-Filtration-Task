import { Router } from 'express'

import findAllMembersEndpointHandler from './findAllMembers.endpoint'
import findOneMemberEndpointHandler from './findOneMember.endpoint'
import createMemberEndpointHandler from './createMember.endpoint'
import updateMemberEndpoint from './updateMember.endpoint'
import deleteMemberEndpointHandler from './deleteMember.endpoint'

const membersRouter = Router()

membersRouter.get('/list', findAllMembersEndpointHandler)
membersRouter.get('/:id', findOneMemberEndpointHandler)
membersRouter.post('/create', createMemberEndpointHandler)
membersRouter.put('/:id', updateMemberEndpoint)
membersRouter.delete('/:id', deleteMemberEndpointHandler)

export default membersRouter
