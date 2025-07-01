import { Answer } from '~/domain/forum/enterprise/entities/answer'

export abstract class AnswersRepository {
	abstract create(answer: Answer): Promise<void>
}
