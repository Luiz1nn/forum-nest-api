import { MockInstance } from 'vitest'
import { makeAnswer } from '~/tests/factories/make-answer'
import { makeQuestion } from '~/tests/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from '~/tests/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '~/tests/repositories/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from '~/tests/repositories/in-memory-attachments-repository'
import { InMemoryNotificationsRepository } from '~/tests/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from '~/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '~/tests/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'
import { waitFor } from '~/tests/utils/wait-for'

import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance

describe('On Answer Created', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		)
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		)
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository
		)

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
	})

	it('should  send a notification when an answer is created', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({ questionId: question.id })

		inMemoryQuestionsRepository.create(question)
		inMemoryAnswersRepository.create(answer)

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})
	})
})
