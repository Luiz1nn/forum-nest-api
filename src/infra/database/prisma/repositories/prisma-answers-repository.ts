import { DomainEvents } from '~/core/events/domain-events'
import { AnswerAttachmentsRepository } from '~/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '~/domain/forum/application/repositories/answers-repository'
import { Answer } from '~/domain/forum/enterprise/entities/answer'

import { Injectable } from '@nestjs/common'

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(
		private prisma: PrismaService,
		private answerAttachmentsRepository: AnswerAttachmentsRepository
	) {}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer)

		await this.prisma.answer.create({
			data,
		})

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems()
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}
}
