import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/register-student'

import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { CreateAccountController } from './controllers/create-account.controller'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [CreateAccountController],
	providers: [RegisterStudentUseCase],
})
export class HttpModule {}
