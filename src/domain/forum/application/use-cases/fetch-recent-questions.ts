import { Either, right } from '~/core/either'
import { Question } from '~/domain/forum/enterprise/entities/question'

import { Injectable } from '@nestjs/common'

import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
	page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
	null,
	{
		questions: Question[]
	}
>

@Injectable()
export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({ page })

		return right({
			questions,
		})
	}
}
