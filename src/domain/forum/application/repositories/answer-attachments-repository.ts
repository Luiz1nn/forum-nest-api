import { AnswerAttachment } from '~/domain/forum/enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
	abstract createMany(attachments: AnswerAttachment[]): Promise<void>
	abstract deleteManyByAnswerId(answerId: string): Promise<void>
}
