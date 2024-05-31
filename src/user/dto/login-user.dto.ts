import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: '账号不能为空',
  })
  username: string;
  @IsNotEmpty({
    message: '密码bunengweikog',
  })
  password: string;
}
