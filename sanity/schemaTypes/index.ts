import { type SchemaTypeDefinition } from 'sanity'
import { userType } from './userType'
import { voteType } from './voteType'
import { subreaditType } from './subreaditType'
import { PostType } from './postType'
import { commentType } from './commentType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, voteType, subreaditType, PostType, commentType],
}
