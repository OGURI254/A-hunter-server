import { Injectable } from '@nestjs/common';
import { Prisma,User } from 'generated/prisma';
import { PrismaService } from 'src/prisma.service';
import crypto from 'crypto'
import * as bcrypt from 'bcrypt';

function generateUsername(name: string): string {
  const base = name.trim().toLowerCase().replace(/\s+/g, '');
  const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex').slice(0, 5);
  return `${base}${hash}`;
}

const salt = 10

@Injectable()
export class UsersService {
  constructor(private prisma:PrismaService){}

  async create(createUserDto:Prisma.UserCreateInput) {
    const userExists = await this.prisma.user.findUnique({
      where:{
        email:createUserDto.email
      }
    })

    if (userExists) return "User Exists"

    // const user = {
    //   username: generateUsername(createUserDto.name),
    //   password_hash: await bcrypt.hash(createUserDto.password_hash,salt),
    //   ...createUserDto
    // }
    const {username,password_hash,...rest} = createUserDto
    const new_username = generateUsername(username)
    const new_password = await bcrypt.hash(password_hash,salt)

    if (new_password){      
      return  await this.prisma.user.create({
        data:{
          username:new_username,
          password_hash:new_password,
          ...rest
        }
      })
    }

    return 'error occurred'
    
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where:{
        id
      }
    });
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
