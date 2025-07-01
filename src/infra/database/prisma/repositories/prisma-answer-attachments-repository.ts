import { AnswerAttachmentsRepository } from '~/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '~/domain/forum/enterprise/entities/answer-attachment'

import { Injectable } from '@nestjs/common'

import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	constructor(private prisma: PrismaService) {}

	async createMany(attachments: AnswerAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return
		}

		const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

		await this.prisma.attachment.updateMany(data)
	}
}
