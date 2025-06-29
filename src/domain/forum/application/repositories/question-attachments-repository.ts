import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'

export abstract class QuestionAttachmentsRepository {
	abstract createMany(attachments: QuestionAttachment[]): Promise<void>
}
