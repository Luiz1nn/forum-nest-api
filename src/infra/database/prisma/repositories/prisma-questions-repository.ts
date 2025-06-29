import { DomainEvents } from '~/core/events/domain-events'
import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '~/domain/forum/application/repositories/questions-repository'
import { Question } from '~/domain/forum/enterprise/entities/question'

import { Injectable } from '@nestjs/common'

import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(
		private prisma: PrismaService,
		private questionAttachmentsRepository: QuestionAttachmentsRepository
	) {}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPrisma(question)

		await this.prisma.question.create({
			data,
		})

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems()
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}
}
