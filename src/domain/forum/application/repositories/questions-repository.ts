import { Question } from '~/domain/forum/enterprise/entities/question'

export abstract class QuestionsRepository {
	abstract create(question: Question): Promise<void>
}
