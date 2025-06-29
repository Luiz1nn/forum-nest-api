import { Question } from '~/domain/forum/enterprise/entities/question'

export abstract class QuestionsRepository {
	abstract findById(id: string): Promise<Question | null>
	abstract create(question: Question): Promise<void>
	abstract save(question: Question): Promise<void>
}
