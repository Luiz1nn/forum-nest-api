import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { ValueObject } from '~/core/entities/value-object'

export interface CommentWithAuthorProps {
	commentId: UniqueEntityID
	content: string
	authorId: UniqueEntityID
	author: string
	createdAt: Date
	updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
	get commentId() {
		return this.props.commentId
	}

	get author() {
		return this.props.author
	}

	static create(props: CommentWithAuthorProps) {
		return new CommentWithAuthor(props)
	}
}
