import { FakeHasher } from '~/tests/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '~/tests/repositories/in-memory-students-repository'

import { StudentAlreadyExistsError } from './errors/student-already-exists-error'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		fakeHasher = new FakeHasher()

		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
	})

	it('should be able to register a new student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		})
	})

	it('should hash student password upon registration', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456',
		})

		const hashedPassword = await fakeHasher.hash('123456')

		expect(result.isRight()).toBe(true)
		expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
	})

	it('should not be able to register with same email twice', async () => {
		const email = 'johndoe@example.com'

		await sut.execute({
			name: 'John Doe',
			email,
			password: '123456',
		})

		const result = await sut.execute({
			name: 'John Doe',
			email,
			password: '123456',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(StudentAlreadyExistsError)
	})
})
