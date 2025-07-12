import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { makeQuestion } from '~/tests/factories/make-question'
import { InMemoryAttachmentsRepository } from '~/tests/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from '~/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionCommentsRepository } from '~/tests/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '~/tests/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'

import { CommentOnQuestionUseCase } from './comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
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
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository
		)
	})

	it('should be able to comment on question', async () => {
		const question = makeQuestion()

		await inMemoryQuestionsRepository.create(question)

		await sut.execute({
			questionId: question.id.toString(),
			authorId: question.authorId.toString(),
			content: 'Comentário teste',
		})

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			'Comentário teste'
		)
	})

	it('should return ResourceNotFoundError if question does not exist', async () => {
		const result = await sut.execute({
			questionId: 'non-existent-question-id',
			authorId: 'any-author-id',
			content: 'Comentário teste',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
