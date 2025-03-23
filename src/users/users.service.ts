import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '@/config/supabase.config';
import { MailsService } from '@/mails/mails.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from '@/common/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private supabaseService: SupabaseService,
    private mailsService: MailsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const { data: existingUser } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', createUserDto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);

    // Create user in Supabase
    const { data, error } = await this.supabaseService.client
      .from('users')
      .insert({
        email: createUserDto.email,
        password: hashedPassword,
        role: Role.USER,
        is_email_verified: false,
        verification_token: hashedVerificationToken,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Send verification email
    await this.sendVerificationEmail(data.email, verificationToken);

    return this.mapToUserEntity(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapToUserEntity(data);
  }

  async findById(id: string): Promise<User> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserEntity(data);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;

    await this.supabaseService.client
      .from('users')
      .update({ refresh_token: hashedRefreshToken })
      .eq('id', userId);
  }

  async verifyEmail(token: string): Promise<void> {
    const { data: users, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('verification_token', token)
      .limit(1);

    if (error || !users || users.length === 0) {
      throw new NotFoundException('Invalid verification token');
    }

    const user = users[0];

    await this.supabaseService.client
      .from('users')
      .update({
        is_email_verified: true,
        verification_token: null,
      })
      .eq('id', user.id);
  }

  private async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.mailsService.sendVerificationEmail(email, token);
  }

  private mapToUserEntity(data: any): User {
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      isEmailVerified: data.is_email_verified,
      refreshToken: data.refresh_token,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
