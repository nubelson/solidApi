import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';
import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';

//! S - Single Responsibility Principle
//* A classe abaixo criada tem a única responsabilidade de criação do usuário

export class CreateUserUseCase {
	//! Linskov Substitution Principle
	//* A partir do momento que recebemos o usersRepository e falamos que o seu tipo e um IUsersRepository (uma interface, que fala quais sao os métodos que vao existir dentro dele), nao interessa qual repositório passaremos para ele (PostgreSQL, MySQL, Mongo), se tiver esses métodos, esta tudo Okay

	constructor(
		private usersRepository: IUsersRepository,
		private mailProvider: IMailProvider
	) {}

	async execute(data: ICreateUserRequestDTO) {
		const userAlreadyExists = await this.usersRepository.findByEmail(
			data.email
		);

		if (userAlreadyExists) {
			throw new Error('User already exists.');
		}

		const user = new User(data);

		await this.usersRepository.save(user);

		await this.mailProvider.sendMail({
			to: {
				name: data.name,
				email: data.email,
			},
			from: {
				name: 'Equipe do meu App',
				email: 'equipe@meuapp.com',
			},
			subject: 'Seja bem-vindo à plataforma',
			body: '<p>Você já pode fazer login em nossa plataforma.</p>',
		});
	}
}
