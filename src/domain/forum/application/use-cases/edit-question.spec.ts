import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { makeQuestion } from '~/tests/factories/make-question'
import { makeQuestionAttachment } from '~/tests/factories/make-question-attachments'
import { InMemoryQuestionAttachmentsRepository } from '~/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '~/tests/repositories/in-memory-questions-repository'

import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		)

		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository
		)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1')
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('2'),
			})
		)

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
		})

		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
		])
	})

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1')
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-2',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should sync new and removed attachment when editing a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID('author-1'),
			},
			new UniqueEntityID('question-1')
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID('2'),
			})
		)

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-1',
			title: 'Pergunta teste',
			content: 'Conteúdo teste',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
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

	it('should return ResourceNotFoundError if question does not exist', async () => {
		const result = await sut.execute({
			questionId: 'non-existent-question-id',
			authorId: 'author-1',
			title: 'Pergunta inexistente',
			content: 'Conteúdo inexistente',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
