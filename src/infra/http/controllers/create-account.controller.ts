import { z } from 'zod'
import { StudentAlreadyExistsError } from '~/domain/forum/application/use-cases/errors/student-already-exists-error'
import { RegisterStudentUseCase } from '~/domain/forum/application/use-cases/register-student'
import { Public } from '~/infra/auth/public'

import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UsePipes,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
	constructor(private registerStudent: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(201)
	@UsePipes(new ZodValidationPipe(createAccountBodySchema))
	async handle(@Body() body: CreateAccountBodySchema) {
		const { name, email, password } = body

		const result = await this.registerStudent.execute({
			name,
			email,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case StudentAlreadyExistsError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}
