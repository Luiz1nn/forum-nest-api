import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { makeAnswer } from '~/tests/factories/make-answer'
import { makeAnswerAttachment } from '~/tests/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from '~/tests/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '~/tests/repositories/in-memory-answers-repository'

import { DeleteAnswerUseCase } from './delete-answer'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		)

		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1')
		)

		await inMemoryAnswersRepository.create(newAnswer)

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID('2'),
			})
		)

		await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-1',
		})

		expect(inMemoryAnswersRepository.items).toHaveLength(0)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1')
		)

		await inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: 'answer-1',
			authorId: 'author-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should return ResourceNotFoundError if answer does not exist', async () => {
		const result = await sut.execute({
			answerId: 'non-existent-answer',
			authorId: 'any-author',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
