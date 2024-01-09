import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private userRepo: DataSource) {
    super(User, userRepo.createEntityManager());
  }

  async zz() {
    return await this.createQueryBuilder().select();
  }
}
