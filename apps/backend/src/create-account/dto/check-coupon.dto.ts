import { IsNotEmpty } from "class-validator";

export class CheckCouponDto{
    @IsNotEmpty({message:'El token es obligatorio'})
    token:string
}
