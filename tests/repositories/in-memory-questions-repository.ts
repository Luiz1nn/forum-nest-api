import { DomainEvents } from '~/core/events/domain-events'
import { QuestionsRepository } from '~/domain/forum/application/repositories/questions-repository'
import { Question } from '~/domain/forum/enterprise/entities/question'

import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
  ) {}


  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}