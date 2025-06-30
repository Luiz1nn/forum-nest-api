import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { Slug } from '~/domain/forum/enterprise/entities/value-objects/slug'
import { makeAttachment } from '~/tests/factories/make-attachment'
import { makeQuestion } from '~/tests/factories/make-question'
import { makeQuestionAttachment } from '~/tests/factories/make-question-attachments'
import { makeStudent } from '~/tests/factories/make-student'
import { InMemoryAttachmentsRepository } from '~/tests/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '~/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '~/tests/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'

import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' })

		await inMemoryStudentsRepository.create(student)

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const attachment = makeAttachment({
			title: 'Some attachment',
		})

		inMemoryAttachmentsRepository.items.push(attachment)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			})
		)

		const result = await sut.execute({
			slug: 'example-question',
		})

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: attachment.title,
					}),
				],
			}),
		})
	})

	it('should return ResourceNotFoundError if question does not exist', async () => {
		const result = await sut.execute({
			slug: 'non-existent-slug',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(Error)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
		if (result.value instanceof ResourceNotFoundError) {
			expect(result.value.message).toBe('Resource not found')
		}
	})
})
