import { Answer } from '~/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
	abstract findById(id: string): Promise<Answer | null>
	abstract create(answer: Answer): Promise<void>
}
