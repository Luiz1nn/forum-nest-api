import { Either, right } from '~/core/either'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { Answer } from '~/domain/forum/enterprise/entities/answer'
import { AnswerAttachment } from '~/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '~/domain/forum/enterprise/entities/answer-attachment-list'

import { Injectable } from '@nestjs/common'

import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
	authorId: string
	questionId: string
	attachmentsIds: string[]
	content: string
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer
	}
>

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		authorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
		})

		const answerAttachments = attachmentsIds.map(attachmentId => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			})
		})

		answer.attachments = new AnswerAttachmentList(answerAttachments)

		await this.answersRepository.create(answer)

		return right({
			answer,
		})
	}
}
