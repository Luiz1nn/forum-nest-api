import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { ValueObject } from '~/core/entities/value-object'

import { Attachment } from '../attachment'
import { Slug } from './slug'

export interface QuestionDetailsProps {
	questionId: UniqueEntityID
	authorId: UniqueEntityID
	author: string
	title: string
	content: string
	slug: Slug
	attachments: Attachment[]
	bestAnswerId?: UniqueEntityID | null
	createdAt: Date
	updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
	get author() {
		return this.props.author
	}

	get title() {
		return this.props.title
	}

	get attachments() {
		return this.props.attachments
	}

	static create(props: QuestionDetailsProps) {
		return new QuestionDetails(props)
	}
}
