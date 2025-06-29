import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '~/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '~/domain/forum/application/repositories/students-repository'

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
	providers: [
		PrismaService,
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: QuestionAttachmentsRepository,
			useClass: PrismaQuestionAttachmentsRepository,
		},
	],
	exports: [
		PrismaService,
		StudentsRepository,
		QuestionsRepository,
		QuestionAttachmentsRepository,
	],
})
export class DatabaseModule {}
