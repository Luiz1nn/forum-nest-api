import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/authenticate-student'
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/create-question'
import { EditQuestionUseCase } from '~/domain/forum/application/use-cases/edit-question'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/register-student'

import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { EditQuestionController } from './controllers/edit-question.controller'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		EditQuestionController,
	],
	providers: [
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		CreateQuestionUseCase,
		EditQuestionUseCase,
	],
})
export class HttpModule {}
