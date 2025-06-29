import { AggregateRoot } from '~/core/entities/aggregate-root'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { Optional } from '~/core/types/optional'

import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

export interface QuestionProps {
	authorId: UniqueEntityID
	bestAnswerId?: UniqueEntityID | null
	title: string
	content: string
	slug: Slug
	attachments: QuestionAttachmentList
	createdAt: Date
	updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
	get attachments() {
		return this.props.attachments
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	set attachments(attachments: QuestionAttachmentList) {
		this.props.attachments = attachments
		this.touch()
	}

	static create(
		props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
		id?: UniqueEntityID
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				attachments: props.attachments ?? new QuestionAttachmentList(),
				createdAt: props.createdAt ?? new Date(),
			},
			id
		)

		return question
	}
}
