import { AnswerComment } from '~/domain/forum/enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
	abstract findById(id: string): Promise<AnswerComment | null>
	abstract create(answerComment: AnswerComment): Promise<void>
	abstract delete(answerComment: AnswerComment): Promise<void>
}
