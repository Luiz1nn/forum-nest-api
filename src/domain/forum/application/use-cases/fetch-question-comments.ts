import { Either, right } from '~/core/either'
import { CommentWithAuthor } from '~/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { Injectable } from '@nestjs/common'

import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[]
	}
>

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments =
			await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
				questionId,
				{
					page,
				}
			)

		return right({
			comments,
		})
	}
}
