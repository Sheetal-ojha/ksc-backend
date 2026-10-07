import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { Public } from './decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => String)
  async signup(@Args('input') input: RegisterInput) {
    console.log('signup hit', input.role, input.registeredId);
    await this.authService.signUp(input);
    return 'Registration successful';
  }

  @Public()
  @Mutation(() => AuthResponse)
  login(@Args('input') input: LoginInput) {
    return this.authService.signIn(input.email, input.password);
  }
}