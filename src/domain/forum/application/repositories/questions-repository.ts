import { PaginationParams } from '~/core/repositories/pagination-params'
import { Question } from '~/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '~/domain/forum/enterprise/entities/value-objects/question-details'

export abstract class QuestionsRepository {
	abstract findById(id: string): Promise<Question | null>
	abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
	abstract findManyRecent(params: PaginationParams): Promise<Question[]>
	abstract create(question: Question): Promise<void>
	abstract save(question: Question): Promise<void>
	abstract delete(question: Question): Promise<void>
}
