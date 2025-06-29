import { QuestionAttachmentsRepository } from '~/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '~/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }
}