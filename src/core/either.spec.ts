import { Either, left, right } from './either'

function doSomeThing(shouldSuccess: boolean): Either<string, number> {
	if (shouldSuccess) {
		return right(10)
	}

	return left('error')
}

test('success result', () => {
	const result = doSomeThing(true)

	expect(result.isRight()).toBe(true)
	expect(result.isLeft()).toBe(false)
})

test('error result', () => {
	const result = doSomeThing(false)

	expect(result.isLeft()).toBe(true)
	expect(result.isRight()).toBe(false)
})
