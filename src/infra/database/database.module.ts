import { StudentsRepository } from '~/domain/forum/application/repositories/students-repository'

import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
	providers: [
		PrismaService,
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
	],
	exports: [StudentsRepository],
})
export class DatabaseModule {}
