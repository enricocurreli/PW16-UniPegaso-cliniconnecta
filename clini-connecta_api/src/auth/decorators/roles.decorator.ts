import { SetMetadata } from "@nestjs/common"
import { RoleStatus } from "../../enums/db-enum.enum"

export const ROLES_KEY = 'roles'
export const Roles = (...roles:RoleStatus[])=>(SetMetadata(ROLES_KEY, roles));