import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { NewPasswordInput } from '@/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class isPasswordMatching implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args?: ValidationArguments) {
		const obj = args.object as NewPasswordInput

		return obj.password === passwordRepeat
	}

	public defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Пароли не совпадают'
	}
}
