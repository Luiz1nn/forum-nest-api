import { Either, right } from '~/core/either'
import { UniqueEntityID } from '~/core/entities/unique-entity-id'
import { Notification } from '~/domain/notification/enterprise/entities/notification'

import { Injectable } from '@nestjs/common'

import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
	recipientId: string
	title: string
	content: string
}

export type SendNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification
	}
>

@Injectable()
export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		title,
		content,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			recipientId: new UniqueEntityID(recipientId),
			title,
			content,
		})

		await this.notificationsRepository.create(notification)

		return right({
			notification,
		})
	}
}
