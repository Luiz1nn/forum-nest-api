import request from 'supertest'
import { AppModule } from '~/infra/app.module'
import { DatabaseModule } from '~/infra/database/database.module'
import { QuestionFactory } from '~/tests/factories/make-question'
import { StudentFactory } from '~/tests/factories/make-student'

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Upload attachment (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()

		studentFactory = moduleRef.get(StudentFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /attachments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/attachments')
			.set('Authorization', `Bearer ${accessToken}`)
			.attach('file', './tests/e2e/sample-upload.png')

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		})
	})
})
