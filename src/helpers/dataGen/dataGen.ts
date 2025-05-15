import {faker} from '@faker-js/faker';

export class EmailGenerator {

    static generateValidEmail(): string {
        return faker.internet.email();
    }

    static generateInvalidEmail(): string[] {
        return [
            'userexample.com',
            'user@.com',
            'user@com',
            '@example.com',
            'user@example',
            'user@@example.com',
            'user@ example.com',
            'user@example..com',
            'user@example.c',
            'user@-example.com',
        ];
    }
}
