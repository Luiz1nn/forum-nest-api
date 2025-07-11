import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { makeAnswer } from '~/tests/factories/make-answer'
import { makeAnswerAttachment } from '~/tests/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from '~/tests/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '~/tests/repositories/in-memory-answers-repository'

import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository
		)

		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository
		)
	})

	it('should be able to edit a answer', async () => {
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
			answerId: newAnswer.id.toValue(),
			authorId: 'author-1',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: 'Conteúdo teste',
		})

		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems
		).toHaveLength(2)
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
			]
		)
	})

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('answer-1')
		)

		await inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'author-2',
			content: 'Conteúdo teste',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should sync new and removed attachment when editing an answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1')
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

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'author-1',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityID('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityID('3'),
				}),
			])
		)
	})

	it('should not be able to edit a non-existent answer', async () => {
		const result = await sut.execute({
			answerId: 'non-existent-answer-id',
			authorId: 'author-1',
			content: 'Conteúdo teste',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
