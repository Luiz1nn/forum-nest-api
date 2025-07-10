import { AnswerQuestionUseCase } from '~/domain/forum/application/use-cases/answer-question'
import { AuthenticateStudentUseCase } from '~/domain/forum/application/use-cases/authenticate-student'
import { ChooseQuestionBestAnswerUseCase } from '~/domain/forum/application/use-cases/choose-question-best-answer'
import { CreateQuestionUseCase } from '~/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '~/domain/forum/application/use-cases/delete-answer'
import { DeleteQuestionUseCase } from '~/domain/forum/application/use-cases/delete-question'
import { EditQuestionUseCase } from '~/domain/forum/application/use-cases/edit-question'
import { FetchRecentQuestionsUseCase } from '~/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '~/domain/forum/application/use-cases/get-question-by-slug'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/register-student'

import { Module } from '@nestjs/common'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AnswerQuestionController } from './controllers/answer-question.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { DeleteAnswerController } from './controllers/delete-answer.controller'
import { DeleteQuestionController } from './controllers/delete-question.controller'
import { EditQuestionController } from './controllers/edit-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		EditQuestionController,
		DeleteQuestionController,
		FetchRecentQuestionsController,
		GetQuestionBySlugController,
		AnswerQuestionController,
		ChooseQuestionBestAnswerController,
		DeleteAnswerController,
	],
	providers: [
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		CreateQuestionUseCase,
		EditQuestionUseCase,
		DeleteQuestionUseCase,
		FetchRecentQuestionsUseCase,
		GetQuestionBySlugUseCase,
		AnswerQuestionUseCase,
		ChooseQuestionBestAnswerUseCase,
		DeleteAnswerUseCase,
	],
})
export class HttpModule {}
