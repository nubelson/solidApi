import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { User } from '../../entities/User';

//! S - Single Responsibility Principle
//* A classe abaixo criada tem a única responsabilidade de criação do usuário

export class CreateUserUseCase {
	//! Linskov Substitution Principle
	//* A partir do momento que recebemos o usersRepository e falamos que o seu tipo e um IUsersRepository (uma interface, que fala quais sao os métodos que vao existir dentro dele), nao interessa qual repositório passaremos para ele (PostgreSQL, MySQL, Mongo), se tiver esses métodos, esta tudo Okay

	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: ICreateUserRequestDTO) {
		const userAlreadyExists = await this.usersRepository.findByEmail(
			data.email
		);

		if (userAlreadyExists) {
			throw new Error('User already exists.');
		}

		const user = new User(data);

		await this.usersRepository.save(user);
	}
}
