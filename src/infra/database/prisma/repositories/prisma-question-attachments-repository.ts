import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'

import { Injectable } from '@nestjs/common'

import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return
		}

		const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

		await this.prisma.attachment.updateMany(data)
	}
}
