import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from '~/tests/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from '~/tests/repositories/in-memory-questions-repository'

import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository
		)
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
		])
	})

	it('should persist attachments when creating a new question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'Nova pergunta',
			content: 'Conteúdo da pergunta',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityID('1'),
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityID('1'),
				}),
			])
		)
	})
})
