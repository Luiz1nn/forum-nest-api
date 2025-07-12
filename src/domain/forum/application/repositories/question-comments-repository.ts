import { QuestionComment } from '~/domain/forum/enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
	abstract create(questionComment: QuestionComment): Promise<void>
}
