import { QuestionCommentsRepository } from '~/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '~/domain/forum/enterprise/entities/question-comment'

import { Injectable } from '@nestjs/common'

import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private prisma: PrismaService) {}

	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

		await this.prisma.comment.create({
			data,
		})
	}
}
