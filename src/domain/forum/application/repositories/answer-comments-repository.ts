import { AnswerComment } from '~/domain/forum/enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
	abstract create(answerComment: AnswerComment): Promise<void>
}
