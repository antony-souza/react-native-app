class Environment {
    public readonly apiUrl:string = 'http://10.0.2.2:2301';
    public readonly auth: string = 'auth/login';
    public readonly getUser: string = 'users/find';

}

export const environment = new Environment();