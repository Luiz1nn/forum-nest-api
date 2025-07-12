import { QuestionComment } from '~/domain/forum/enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
	abstract findById(id: string): Promise<QuestionComment | null>
	abstract create(questionComment: QuestionComment): Promise<void>
	abstract delete(questionComment: QuestionComment): Promise<void>
}
