import { FakeEncrypter } from '~/tests/cryptography/fake-encrypter'
import { FakeHasher } from '~/tests/cryptography/fake-hasher'
import { makeStudent } from '~/tests/factories/make-student'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'

import { AuthenticateStudentUseCase } from './authenticate-student'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		fakeHasher = new FakeHasher()
		encrypter = new FakeEncrypter()

		sut = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			fakeHasher,
			encrypter
		)
	})

	it('should be able to authenticate a student', async () => {
		const student = makeStudent({
			email: 'johndoe@example.com',
			password: await fakeHasher.hash('123456'),
		})

		inMemoryStudentsRepository.items.push(student)

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		})
	})

	it('should not be able to authenticate with wrong password', async () => {
		const student = makeStudent({
			email: 'johndoe@example.com',
			password: await fakeHasher.hash('123456'),
		})

		inMemoryStudentsRepository.items.push(student)

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123123',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCredentialsError)
	})

	it('should not be able to authenticate with non existing email', async () => {
		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(WrongCredentialsError)
	})
})
