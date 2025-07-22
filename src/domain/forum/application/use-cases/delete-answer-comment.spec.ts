import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { NotAllowedError } from '~/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '~/core/errors/errors/resource-not-found-error'
import { makeAnswerComment } from '~/tests/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '~/tests/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository
		)

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment()

		await inMemoryAnswerCommentsRepository.create(answerComment)

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		})

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID('author-1'),
		})

		await inMemoryAnswerCommentsRepository.create(answerComment)

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: 'author-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should return ResourceNotFoundError if answer comment does not exist', async () => {
		const result = await sut.execute({
			answerCommentId: 'non-existent-id',
			authorId: 'any-author-id',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
