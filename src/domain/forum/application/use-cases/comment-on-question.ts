import { Either, left, right } from '~/core/either'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { QuestionComment } from '~/domain/forum/enterprise/entities/question-comment'

import { Injectable } from '@nestjs/common'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CommentOnQuestionUseCaseRequest {
	authorId: string
	questionId: string
	content: string
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComment: QuestionComment
	}
>

@Injectable()
export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
			content,
		})

		await this.questionCommentsRepository.create(questionComment)

		return right({
			questionComment,
		})
	}
}
