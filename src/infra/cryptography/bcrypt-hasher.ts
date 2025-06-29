import { hash } from 'bcryptjs'
import { HashGenerator } from '~/domain/forum/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator {
	private HASH_SALT_LENGTH = 8

	hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT_LENGTH)
	}
}
